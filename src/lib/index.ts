import { PUBLIC_NETWORK } from '$env/static/public';
import { get, writable } from 'svelte/store';

export enum TokenType {
	Default = 0,
	ASA = 1,
	ARC200 = 2,
}

export type Token = {
	symbol: string;
	id: number;
	type: TokenType;
	decimals: number;
	unit: number;
};

export type Pool = {
	id: number;
	type: TokenType;
	poolId: number;
	assets: [Token, Token];
	swapFee: string;
};


export const knownTokens = writable<Token[]>([
	{ symbol: 'VOI', id: 0, type: TokenType.Default, decimals: 6, unit: 1e6 },
]);

export const knownPools = writable<Pool[]>([]);

export const arePoolsLoaded = writable(false);

export const contracts = {
	poolFcatory: 2059,
};

export const contractsConstants = {
	orderbookLimitOrderAppFeePercent: 1,
};

export async function getListOfArc200Tokens() {
	const tokensSnap: { id: number, symbol: string, decimals: number, type: number }[] = await (await fetch(`https://${PUBLIC_NETWORK}-analytics.nomadex.app/tokens`)).json();
	const tokens = tokensSnap.map((token) => {
		return {
			id: token.id,
			symbol: token.symbol,
			decimals: token.decimals,
			type: token.type,
		};
	});
	const validTokens: Token[] = get(knownTokens).slice(0, 1).concat(tokens
		.filter((token) => 0 <= token.decimals && token.decimals <= 18)
		.map((token) => ({
			id: token.id,
			symbol: token.symbol,
			type: <TokenType>token.type,
			decimals: token.decimals,
			unit: 10 ** token.decimals,
		})));



	console.log('Tokens:', validTokens);

	const poolsSnap: {
		id: number,
		alphaId: number,
		alphaType: number,
		betaId: number,
		betaType: number,
		swapFee: string
	}[] = await (await fetch(`https://${PUBLIC_NETWORK}-analytics.nomadex.app/pools`)).json();
	const pools = poolsSnap.map((pool) => {
		return {
			id: pool.id,
			alphaId: pool.alphaId,
			alphaType: pool.alphaType,
			betaId: pool.betaId,
			betaType: pool.betaType,
			swapFee: pool.swapFee,
		};
	});
	const validPools: Pool[] = pools.map((pool) => ({
		id: pool.id,
		poolId: pool.id,
		swapFee: pool.swapFee,
		type: TokenType.ARC200,
		assets: <[Token, Token]>[pool.alphaId, pool.betaId].map(id => validTokens.find(t => t.id === id))
	})).filter(p => p.assets.reduce((a, r) => !!r && !!a, true));

	console.log('Pools:', validPools);

	knownPools.update((pools) => pools.slice(0, 0).concat(validPools.sort((a, b) => a.poolId - b.poolId)));
	knownTokens.update((toks) => {
		const tokens = toks.slice(0, 0).concat(validTokens.toSorted((a, b) => {
			return a.id - b.id;
		}));
		return tokens;
	});

	arePoolsLoaded.set(true);
}
