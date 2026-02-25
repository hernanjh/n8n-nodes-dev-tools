import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { convert } from 'html-to-text';

export async function convertHtmlText(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const html = this.getNodeParameter('html', index) as string;
	
	const text = convert(html, {
		wordwrap: 130,
	});

	return {
		text,
	};
}
