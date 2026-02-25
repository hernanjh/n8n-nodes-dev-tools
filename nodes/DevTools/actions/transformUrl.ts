import { IExecuteFunctions, IDataObject } from 'n8n-workflow';

export async function transformUrl(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const mode = this.getNodeParameter('mode', index) as string;
	const value = this.getNodeParameter('value', index) as string;

	if (mode === 'encode') {
		return {
			result: encodeURIComponent(value),
		};
	} else {
		return {
			result: decodeURIComponent(value),
		};
	}
}
