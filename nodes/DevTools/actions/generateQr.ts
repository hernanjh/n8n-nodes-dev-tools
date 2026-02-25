import { IExecuteFunctions, IDataObject, IBinaryKeyData } from 'n8n-workflow';
import * as QRCode from 'qrcode';

export async function generateQr(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const qrType = this.getNodeParameter('qrType', index) as string;
	const outputType = this.getNodeParameter('outputType', index) as string;

	let textToEncode = '';
	if (qrType === 'text') {
		textToEncode = this.getNodeParameter('text', index) as string;
	} else {
		const ssid = this.getNodeParameter('ssid', index) as string;
		const password = this.getNodeParameter('password', index) as string;
		const encryption = this.getNodeParameter('encryption', index) as string;
		textToEncode = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
	}

	if (outputType === 'dataUri') {
		const qrDataUri = await QRCode.toDataURL(textToEncode);
		return { qrDataUri };
	} else {
		// Binary file
		const qrBuffer = await QRCode.toBuffer(textToEncode);
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
		
		const binaryData = await this.helpers.prepareBinaryData(qrBuffer, 'qrcode.png', 'image/png');
		
		const binary: IBinaryKeyData = {};
		binary[binaryPropertyName] = binaryData;

		return {
			json: { success: true },
			binary,
		};
	}
}
