import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';

export async function transformBase64(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const mode = this.getNodeParameter('mode', index) as string;
	if (mode === 'encode') {
		const sourceType = this.getNodeParameter('sourceType', index, 'text') as string;
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
		// Decode
		const value = this.getNodeParameter('value', index) as string;
		const targetType = this.getNodeParameter('targetType', index, 'text') as string;
		
		try {
			const decodedBuffer = Buffer.from(value, 'base64');
			
			if (targetType === 'text') {
				return {
					result: decodedBuffer.toString('utf8'),
				};
			} else {
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;
				const binaryData = await this.helpers.prepareBinaryData(decodedBuffer, 'decoded_file', 'application/octet-stream');
				
				return {
					json: { success: true },
					binary: {
						[binaryPropertyName]: binaryData,
					},
				};
			}
		} catch {
			throw new NodeOperationError(this.getNode(), 'Invalid base64 string provided.', { itemIndex: index });
		}
	}
}
