import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import * as diff from 'diff';

export async function textDiff(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const oldValue = this.getNodeParameter('oldValue', index) as string;
	const newValue = this.getNodeParameter('newValue', index) as string;
	const outputFormat = this.getNodeParameter('outputFormat', index) as string;

	const changes = diff.diffWords(oldValue, newValue);

	if (outputFormat === 'html') {
		const html = changes.map(part => {
			const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
			const tag = part.added ? 'ins' : part.removed ? 'del' : 'span';
			const style = `style="color: ${color}; text-decoration: ${part.removed ? 'line-through' : 'none'};"`;
			return `<${tag} ${style}>${part.value}</${tag}>`;
		}).join('');
		return { html };
	} else {
		// Simple List
		const result = changes.map(part => ({
			added: !!part.added,
			removed: !!part.removed,
			value: part.value,
		}));
		return { result };
	}
}
