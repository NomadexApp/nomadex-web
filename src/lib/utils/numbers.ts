export function powerOfTen(decimals: number | bigint): bigint {
	let result = 1n;

	for (let i = 0; i < Number(decimals); i = i + 1) {
		result = result * 10n;
	}

	return result;
}

export function convertDecimals(amount: bigint | number, decimals: bigint | number, targetDecimals: bigint | number) {
	if (typeof amount === "number") amount = Math.floor(amount);
	if (typeof decimals === "number") decimals = Math.floor(decimals);
	if (typeof targetDecimals === "number") targetDecimals = Math.floor(targetDecimals);
	return (BigInt(amount) * powerOfTen(targetDecimals)) / powerOfTen(decimals);
}
