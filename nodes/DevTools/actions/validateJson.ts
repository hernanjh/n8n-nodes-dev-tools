import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import Ajv from 'ajv';

export async function validateJson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dataInput = this.getNodeParameter('data', index) as string | object;
	const schemaInput = this.getNodeParameter('schema', index) as string | object;

	let data: any;
	let schema: any;

	try {
		data = typeof dataInput === 'string' ? JSON.parse(dataInput) : dataInput;
	} catch (error) {
		throw new NodeOperationError(this.getNode(), 'Invalid JSON data provided', { itemIndex: index });
	}

	try {
		schema = typeof schemaInput === 'string' ? JSON.parse(schemaInput) : schemaInput;
	} catch (error) {
		throw new NodeOperationError(this.getNode(), 'Invalid JSON schema provided', { itemIndex: index });
	}

	const ajv = new Ajv({ allErrors: true });
	const validate = ajv.compile(schema);
	const isValid = validate(data);

	return {
		isValid,
		errors: validate.errors || [],
	};
}
