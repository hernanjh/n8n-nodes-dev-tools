import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { jwtDecode } from 'jwt-decode';

export async function decodeJwt(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const token = this.getNodeParameter('token', index) as string;

	try {
		const decoded = jwtDecode(token);
		return decoded as IDataObject;
	} catch (error) {
		throw new NodeOperationError(this.getNode(), 'Invalid JWT token provided.', { itemIndex: index });
	}
}
