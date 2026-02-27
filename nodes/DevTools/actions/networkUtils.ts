import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import IPCIDR from 'ip-cidr';
// eslint-disable-next-line n8n-nodes-base/community-package-json-name
import * as ping from 'ping';
// eslint-disable-next-line n8n-nodes-base/community-package-json-name
import * as dns from 'dns';
// eslint-disable-next-line n8n-nodes-base/community-package-json-name
import * as net from 'net';
// eslint-disable-next-line n8n-nodes-base/community-package-json-name
import * as wol from 'wake_on_lan';
// eslint-disable-next-line n8n-nodes-base/community-package-json-name
import { promisify } from 'util';

const wolWake = promisify(wol.wake);

export async function networkUtils(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const action = this.getNodeParameter('networkAction', index) as string;

	if (action === 'ipInRange' || action === 'subnetInfo') {
		const cidrInput = this.getNodeParameter('cidr', index) as string;

		if (!IPCIDR.isValidCIDR(cidrInput)) {
			throw new NodeOperationError(this.getNode(), `Invalid CIDR format: ${cidrInput}`, { itemIndex: index });
		}

		const cidr = new IPCIDR(cidrInput);

		if (action === 'ipInRange') {
			const ip = this.getNodeParameter('ip', index) as string;
			return {
				contains: cidr.contains(ip),
			};
		} else {
			const start = cidr.start<string>();
			const end = cidr.end<string>();
			
			return {
				firstIp: start,
				lastIp: end,
				broadcast: (cidr.address as any).broadcast || '',
				mask: (cidr.address as any).subnetMask || '',
				hostsCount: cidr.size.toString(),
			};
		}
	} else if (action === 'ping') {
		const host = this.getNodeParameter('host', index) as string;
		const packets = this.getNodeParameter('packets', index) as number;
		try {
			const res = await ping.promise.probe(host, { min_reply: packets });
			return res as unknown as IDataObject;
		} catch (error) {
			return { success: false, host, error: error.message };
		}
	} else if (action === 'dns') {
		const domain = this.getNodeParameter('domain', index) as string;
		const recordType = this.getNodeParameter('recordType', index) as string;
		try {
			const records = await dns.promises.resolve(domain, recordType);
			return { success: true, domain, recordType, records };
		} catch (error) {
			return { success: false, domain, recordType, error: error.message };
		}
	} else if (action === 'tcpCheck') {
		const host = this.getNodeParameter('host', index) as string;
		const port = this.getNodeParameter('port', index) as number;
		const timeoutMs = this.getNodeParameter('timeout', index) as number;
		
		return new Promise((resolve) => {
			const socket = new net.Socket();
			
			socket.setTimeout(timeoutMs);
			
			socket.on('connect', () => {
				socket.destroy();
				resolve({ status: 'open', host, port });
			});
			
			socket.on('timeout', () => {
				socket.destroy();
				resolve({ status: 'closed_or_filtered', host, port, error: 'Timeout' });
			});
			
			socket.on('error', (err) => {
				socket.destroy();
				resolve({ status: 'closed_or_filtered', host, port, error: err.message });
			});
			
			socket.connect(port, host);
		});
	} else if (action === 'wol') {
		const macAddress = this.getNodeParameter('macAddress', index) as string;
		try {
			await wolWake(macAddress);
			return { success: true, mac: macAddress, message: 'Magic packet sent' };
		} catch (error) {
			return { success: false, mac: macAddress, error: error.message };
		}
	}

	throw new NodeOperationError(this.getNode(), `Network action ${action} not implemented`, { itemIndex: index });
}
