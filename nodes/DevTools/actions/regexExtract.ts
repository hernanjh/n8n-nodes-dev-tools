import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';

export async function regexExtract(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const text = this.getNodeParameter('text', index) as string;
	const regexString = this.getNodeParameter('regex', index) as string;
	const global = this.getNodeParameter('global', index, false) as boolean;

	try {
		const flags = global ? 'g' : '';
		const regex = new RegExp(regexString, flags);
		
		if (global) {
			const matches = Array.from(text.matchAll(regex));
			const results = matches.map(match => match.groups || {});
			return { results };
		} else {
			const match = regex.exec(text);
			return (match?.groups || {}) as IDataObject;
		}
	} catch (error) {
		throw new NodeOperationError(this.getNode(), `Invalid Regex: ${regexString}`, { itemIndex: index });
	}
}
