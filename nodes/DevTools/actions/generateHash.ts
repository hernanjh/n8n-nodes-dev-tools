import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import * as crypto from 'crypto';

export async function generateHash(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const algorithm = this.getNodeParameter('algorithm', index) as string;
	const value = this.getNodeParameter('value', index) as string;

	const hash = crypto.createHash(algorithm.toLowerCase()).update(value).digest('hex');

	return {
		hash,
		algorithm,
	};
}
