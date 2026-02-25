import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';

export async function transformBase64(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const mode = this.getNodeParameter('mode', index) as string;
	const sourceType = this.getNodeParameter('sourceType', index) as string;

	if (mode === 'encode') {
		if (sourceType === 'text') {
			const value = this.getNodeParameter('value', index) as string;
			return {
				result: Buffer.from(value).toString('base64'),
			};
		} else {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;
			const item = this.getInputData()[index];

			if (item.binary?.[binaryPropertyName] === undefined) {
				throw new NodeOperationError(this.getNode(), `No binary property "${binaryPropertyName}" found on item index ${index}.`, { itemIndex: index });
			}

			const binaryBuffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
			return {
				result: binaryBuffer.toString('base64'),
			};
		}
	} else {
		// Decode
		const value = this.getNodeParameter('value', index) as string;
		try {
			const decoded = Buffer.from(value, 'base64').toString('utf8');
			return {
				result: decoded,
			};
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'Invalid base64 string provided.', { itemIndex: index });
		}
	}
}
