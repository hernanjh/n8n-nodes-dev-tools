import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { Parser, Builder } from 'xml2js';

export async function convertXmlJson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const mode = this.getNodeParameter('mode', index) as string;
	const inputData = this.getNodeParameter('inputData', index) as string;

	if (mode === 'xmlToJson') {
		const parser = new Parser({ explicitArray: false });
		const result = await parser.parseStringPromise(inputData);
		return result;
	} else {
		// JSON to XML
		let jsonObject: object;
		try {
			jsonObject = typeof inputData === 'string' ? JSON.parse(inputData) : inputData;
		} catch (error) {
			jsonObject = { root: inputData };
		}
		const builder = new Builder();
		const xml = builder.buildObject(jsonObject);
		return { xml };
	}
}
