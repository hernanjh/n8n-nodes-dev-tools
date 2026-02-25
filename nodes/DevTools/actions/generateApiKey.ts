import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { randomBytes } from 'crypto';

export async function generateApiKey(this: IExecuteFunctions, index: number): Promise<IDataObject> {
	const length = this.getNodeParameter('length', index) as number;

	const apiKey = randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(0, length);

	return {
		apiKey,
		length: apiKey.length,
	};
}
