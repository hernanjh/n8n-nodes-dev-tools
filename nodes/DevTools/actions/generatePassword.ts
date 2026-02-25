import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { randomInt } from 'crypto';

export async function generatePassword(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const length = this.getNodeParameter('length', index) as number;
	const includeSpecial = this.getNodeParameter('includeSpecial', index) as boolean;
	const includeNumbers = this.getNodeParameter('includeNumbers', index) as boolean;
	const includeUppercase = this.getNodeParameter('includeUppercase', index) as boolean;

	const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
	const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numberChars = '0123456789';
	const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

	let charset = lowercaseChars;
	if (includeUppercase) charset += uppercaseChars;
	if (includeNumbers) charset += numberChars;
	if (includeSpecial) charset += specialChars;

	let password = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = randomInt(0, charset.length);
		password += charset.charAt(randomIndex);
	}

	return {
		password,
	};
}
