export function calculateOutTokens(inAmount: number, inSupply: number, outSupply: number, fee: number) {
    const SHARES = 100_000_000;
    const factor = SHARES - fee;
    return (BigInt(inAmount) * BigInt(outSupply) * BigInt(factor)) / ((BigInt(inAmount) + BigInt(inSupply)) * BigInt(SHARES));
}

export function calculateInTokens(outAmount: number, inSupply: number, outSupply: number, fee: number) {
    const SHARES = 100_000_000;
    const factor = SHARES - fee;
    return (BigInt(outAmount) * BigInt(inSupply) * BigInt(SHARES)) / ((BigInt(factor) * BigInt(outSupply) - BigInt(outAmount)));
}
