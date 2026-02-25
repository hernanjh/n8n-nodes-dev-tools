import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import * as actions from './actions';

export class DevTools implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dev Tools',
		name: 'devTools',
		icon: 'file:DevTools.node.svg',
		group: ['transform'],
		version: 1,
		description: 'A suite of utility tools for developers: Generators, converters, and transformers.',
		defaults: {
			name: 'Dev Tools',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'API Key Generator', value: 'apiKey' },
					{ name: 'Bar Code Generator', value: 'barCode' },
					{ name: 'Base64 Encoder/Decoder', value: 'base64' },
					{ name: 'HTML to Text', value: 'htmlToText' },
					{ name: 'Password Generator', value: 'password' },
					{ name: 'QR Generator', value: 'qrCode' },
					{ name: 'Unique ID Generator', value: 'uniqueId' },
					{ name: 'URL Encoder/Decoder', value: 'url' },
					{ name: 'XML <-> JSON', value: 'xmlJson' },
				],
				default: 'apiKey',
			},
			// API Key Params
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				displayOptions: { show: { operation: ['apiKey'] } },
				default: 32,
				routing: { request: { method: 'GET', url: '' } }, // Dummy for lints if needed, but we use manual execute
			},
			// Password Params
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				displayOptions: { show: { operation: ['password'] } },
				default: 16,
			},
			{
				displayName: 'Include Special Characters',
				name: 'includeSpecial',
				type: 'boolean',
				displayOptions: { show: { operation: ['password'] } },
				default: true,
			},
			{
				displayName: 'Include Numbers',
				name: 'includeNumbers',
				type: 'boolean',
				displayOptions: { show: { operation: ['password'] } },
				default: true,
			},
			{
				displayName: 'Include Uppercase',
				name: 'includeUppercase',
				type: 'boolean',
				displayOptions: { show: { operation: ['password'] } },
				default: true,
			},
			// QR Params
			{
				displayName: 'QR Type',
				name: 'qrType',
				type: 'options',
				displayOptions: { show: { operation: ['qrCode'] } },
				options: [
					{ name: 'Text/URL', value: 'text' },
					{ name: 'WiFi Config', value: 'wifi' },
				],
				default: 'text',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				displayOptions: { show: { operation: ['qrCode'], qrType: ['text'] } },
				default: '',
			},
			{
				displayName: 'SSID',
				name: 'ssid',
				type: 'string',
				displayOptions: { show: { operation: ['qrCode'], qrType: ['wifi'] } },
				default: '',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				displayOptions: { show: { operation: ['qrCode'], qrType: ['wifi'] } },
				default: '',
			},
			{
				displayName: 'Encryption',
				name: 'encryption',
				type: 'options',
				displayOptions: { show: { operation: ['qrCode'], qrType: ['wifi'] } },
				options: [
					{ name: 'WPA', value: 'WPA' },
					{ name: 'WEP', value: 'WEP' },
					{ name: 'No Pass', value: 'nopass' },
				],
				default: 'WPA',
			},
			{
				displayName: 'Output Type',
				name: 'outputType',
				type: 'options',
				displayOptions: { show: { operation: ['qrCode'] } },
				options: [
					{ name: 'Data URI (Base64 String)', value: 'dataUri' },
					{ name: 'Binary File', value: 'binary' },
				],
				default: 'dataUri',
			},
			// Unique ID Params
			{
				displayName: 'ID Type',
				name: 'idType',
				type: 'options',
				displayOptions: { show: { operation: ['uniqueId'] } },
				options: [
					{ name: 'UUID v4', value: 'uuidv4' },
					{ name: 'NanoID', value: 'nanoid' },
				],
				default: 'uuidv4',
			},
			// Barcode Params
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				displayOptions: { show: { operation: ['barCode'] } },
				default: '',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				displayOptions: { show: { operation: ['barCode'] } },
				options: [
					{ name: 'Code 128', value: 'code128' },
					{ name: 'EAN-13', value: 'ean13' },
					{ name: 'UPC-A', value: 'upca' },
				],
				default: 'code128',
			},
			{
				displayName: 'Output Type',
				name: 'outputType',
				type: 'options',
				displayOptions: { show: { operation: ['barCode'] } },
				options: [
					{ name: 'Data URI (Base64 String)', value: 'dataUri' },
					{ name: 'Binary File', value: 'binary' },
				],
				default: 'dataUri',
			},
			// Base64 Params
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				displayOptions: { show: { operation: ['base64'] } },
				options: [
					{ name: 'Encode', value: 'encode' },
					{ name: 'Decode', value: 'decode' },
				],
				default: 'encode',
			},
			{
				displayName: 'Source Type',
				name: 'sourceType',
				type: 'options',
				displayOptions: { show: { operation: ['base64'], mode: ['encode'] } },
				options: [
					{ name: 'Text Value', value: 'text' },
					{ name: 'Binary File', value: 'binary' },
				],
				default: 'text',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				displayOptions: { 
					show: { 
						operation: ['base64'],
					},
					hide: {
						mode: ['encode'],
						sourceType: ['binary'],
					}
				},
				default: '',
			},
			{
				displayName: 'Binary Property Name',
				name: 'binaryPropertyName',
				type: 'string',
				displayOptions: { 
					show: { 
						operation: ['base64', 'qrCode', 'barCode'],
						sourceType: ['binary'],
						outputType: ['binary'],
					} 
				},
				default: 'data',
			},
			// URL Params
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				displayOptions: { show: { operation: ['url'] } },
				options: [
					{ name: 'Encode', value: 'encode' },
					{ name: 'Decode', value: 'decode' },
				],
				default: 'encode',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				displayOptions: { show: { operation: ['url'] } },
				default: '',
			},
			// HTML Params
			{
				displayName: 'HTML',
				name: 'html',
				type: 'string',
				displayOptions: { show: { operation: ['htmlToText'] } },
				default: '',
			},
			// XML Params
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				displayOptions: { show: { operation: ['xmlJson'] } },
				options: [
					{ name: 'XML to JSON', value: 'xmlToJson' },
					{ name: 'JSON to XML', value: 'jsonToXml' },
				],
				default: 'xmlToJson',
			},
			{
				displayName: 'Input Data',
				name: 'inputData',
				type: 'string',
				displayOptions: { show: { operation: ['xmlJson'] } },
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: any;

				switch (operation) {
					case 'apiKey':
						responseData = await actions.generateApiKey.call(this, i);
						break;
					case 'password':
						responseData = await actions.generatePassword.call(this, i);
						break;
					case 'qrCode':
						responseData = await actions.generateQr.call(this, i);
						break;
					case 'uniqueId':
						responseData = await actions.generateUniqueId.call(this, i);
						break;
					case 'barCode':
						responseData = await actions.generateBarcode.call(this, i);
						break;
					case 'base64':
						responseData = await actions.transformBase64.call(this, i);
						break;
					case 'url':
						responseData = await actions.transformUrl.call(this, i);
						break;
					case 'htmlToText':
						responseData = await actions.convertHtmlText.call(this, i);
						break;
					case 'xmlJson':
						responseData = await actions.convertXmlJson.call(this, i);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
				}

				if (responseData.binary) {
					returnData.push({
						json: responseData.json || items[i].json,
						binary: responseData.binary,
						pairedItem: { item: i },
					});
				} else {
					returnData.push({
						json: responseData as any,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
