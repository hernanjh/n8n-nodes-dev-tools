import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import slugify from 'slugify';

export async function transformString(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const action = this.getNodeParameter('stringAction', index) as string;
	const value = this.getNodeParameter('value', index) as string;

	if (action === 'slugify') {
		return {
			result: slugify(value, { lower: true, strict: true }),
		};
	} else if (action === 'titleCase') {
		const result = value
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		return { result };
	} else if (action === 'camelCase') {
		const result = value
			.toLowerCase()
			.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
		return { result };
	} else if (action === 'snakeCase') {
		const result = value
			.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
			?.map((x) => x.toLowerCase())
			.join('_');
		return { result: result || '' };
	}

	return { result: value };
}
