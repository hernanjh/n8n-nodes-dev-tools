import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';

export async function parseUrl(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const urlInput = this.getNodeParameter('url', index) as string;

	try {
		const parsedUrl = new URL(urlInput);
		const searchParams: IDataObject = {};
		
		parsedUrl.searchParams.forEach((value, key) => {
			searchParams[key] = value;
		});

		return {
			protocol: parsedUrl.protocol,
			hostname: parsedUrl.hostname,
			port: parsedUrl.port,
			pathname: parsedUrl.pathname,
			hash: parsedUrl.hash,
			searchParams,
		};
	} catch (error) {
		throw new NodeOperationError(this.getNode(), `Invalid URL provided: ${urlInput}`, { itemIndex: index });
	}
}
