import { IExecuteFunctions, IDataObject, IBinaryKeyData } from 'n8n-workflow';
import * as bwipjs from 'bwip-js';

export async function generateBarcode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const text = this.getNodeParameter('text', index) as string;
	const format = this.getNodeParameter('format', index) as string;
	const outputType = this.getNodeParameter('outputType', index) as string;

	const options: any = {
		bcid: format,
		text: text,
		scale: 3,
		height: 10,
		includetext: true,
		textxalign: 'center',
	};

	const barcodeBuffer = await bwipjs.toBuffer(options);

	if (outputType === 'dataUri') {
		return {
			barcodeDataUri: `data:image/png;base64,${barcodeBuffer.toString('base64')}`,
		};
	} else {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
		const binaryData = await this.helpers.prepareBinaryData(barcodeBuffer, 'barcode.png', 'image/png');
		
		const binary: IBinaryKeyData = {};
		binary[binaryPropertyName] = binaryData;

		return {
			json: { success: true },
			binary,
		};
	}
}
