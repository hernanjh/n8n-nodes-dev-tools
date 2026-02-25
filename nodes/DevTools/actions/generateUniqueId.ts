import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';

export async function generateUniqueId(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const idType = this.getNodeParameter('idType', index) as string;

	let id = '';
	if (idType === 'uuidv4') {
		id = randomUUID();
	} else if (idType === 'nanoid') {
		id = nanoid();
	}

	return {
		id,
		type: idType,
	};
}
