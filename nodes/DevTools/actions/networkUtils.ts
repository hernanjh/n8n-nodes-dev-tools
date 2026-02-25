import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import IPCIDR from 'ip-cidr';

export async function networkUtils(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const action = this.getNodeParameter('networkAction', index) as string;
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
		// Subnet Info
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
}
