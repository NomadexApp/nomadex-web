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
	type: TokenType.ARC200;
	poolId: number;
	assets: [Token, Token];
	swapFee: number;
};


export const knownTokens = writable<Token[]>([
	{ symbol: 'ALGO', id: 0, type: TokenType.Default, decimals: 6, unit: 1e6 },
	{ symbol: 'ARC200', id: 722730128, type: TokenType.ARC200, decimals: 6, unit: 1e6 },
	{ symbol: 'ASA', id: 722745795, type: TokenType.ASA, decimals: 6, unit: 1e6 },
	{ symbol: 'NEW', id: 722854721, type: TokenType.ASA, decimals: 6, unit: 1e6 },
]);

export const knownPools = writable<Pool[]>([
	// { id: 27705276, poolId: 27705276, swapFee: 1e12, arc200Asset: { symbol: 'VIA', assetId: 6779767, decimals: 6, unit: 1e6 } }
	{ id: 722854523, type: TokenType.ARC200, poolId: 722854523, swapFee: 2e12, assets: [get(knownTokens)[0], get(knownTokens)[1]], },
	{ id: 722854579, type: TokenType.ARC200, poolId: 722854579, swapFee: 2e12, assets: [get(knownTokens)[0], get(knownTokens)[2]], },
	{ id: 722854637, type: TokenType.ARC200, poolId: 722854637, swapFee: 2e12, assets: [get(knownTokens)[2], get(knownTokens)[1]], },
	{ id: 722854800, type: TokenType.ARC200, poolId: 722854800, swapFee: 2e12, assets: [get(knownTokens)[2], get(knownTokens)[3]], },
]);

export const arePoolsLoaded = writable(false);

export const contracts = {
	orderbookLimitOrderApp: 26171479,
	poolFcatory: 722854430,
	arc200Token: 722730128,
	asaToken: 722745795
};

export const contractsConstants = {
	orderbookLimitOrderAppFeePercent: 1,
};

export async function getListOfArc200Tokens() {
	return;
	const tokensSnap: { id: number, symbol: string, decimals: number }[] = await (await fetch('https://api.nomadex.app/tokens')).json();
	const tokens = tokensSnap.map((token) => {
		return {
			id: token.id,
			symbol: token.symbol,
			decimals: token.decimals,
		};
	});
	const validTokens: Token[] = tokens
		.filter((token) => 0 <= token.decimals && token.decimals <= 18)
		.map((token) => ({
			id: token.id,
			symbol: token.symbol,
			type: TokenType.ARC200,
			decimals: token.decimals,
			unit: 10 ** token.decimals,
		}));

	console.log('Tokens:', validTokens);

	const poolsSnap: { pool_id: number, swap_fee: string, arc200_id: number }[] = await (await fetch('https://api.nomadex.app/pools')).json();

	const pools = poolsSnap.map((pool) => {
		return {
			id: pool.pool_id,
			arc200Asset: <Token>validTokens.find((token) => token.id === pool.arc200_id),
		};
	});
	const validPools: Pool[] = pools
		.filter((pool) => pool.arc200Asset)
		.map((token) => ({
			id: token.id,
			poolId: token.id,
			swapFee: 1_000_000_000_000,
			arc200Asset: {
				assetId: token.arc200Asset.id,
				symbol: token.arc200Asset.symbol,
				unit: token.arc200Asset.unit,
				decimals: token.arc200Asset.decimals,
			},
		}));

	console.log('Pools:', validPools);

	knownPools.update((pools) => pools.slice(0, 0).concat(validPools.sort((a, b) => a.poolId - b.poolId)));
	knownTokens.update((toks) => {
		const tokens = toks.slice(0, 1).concat(validTokens.toSorted((a, b) => {
			const prefer = ['VIA', 'UNIT', 'POINTS', 'Tacos', 'NOM', 'ROCKET'];
			if (prefer.includes(a.symbol) && prefer.includes(b.symbol)) {
				return prefer.indexOf(a.symbol) - prefer.indexOf(b.symbol);
			} else if (prefer.includes(a.symbol)) {
				return -1;
			} else if (prefer.includes(b.symbol)) {
				return 1;
			}

			return a.id - b.id;
		}));
		return tokens;
	});

	arePoolsLoaded.set(true);
}

export async function saveArc200TokenToList(symbol: string, id: number, decimals: number) {
	if (typeof symbol !== 'string' || typeof id !== 'number' || typeof decimals !== 'number') {
		throw Error('Bad arc200 token args, cannot add arc200 to the list');
	}
	const resp = await fetch('https://api.nomadex.app/tokens', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			id: id,
			symbol: symbol,
			decimals: decimals
		})
	});
	const rep = await resp.json();
	if (rep.success) {
		await getListOfArc200Tokens();
		return true;
	}
}

export async function saveVoiArc200PoolToList(symbol: string, poolId: number, arc200Id: number) {
	if (typeof symbol !== 'string' || typeof poolId !== 'number' || typeof arc200Id !== 'number') {
		throw Error('Bad voi-arc200 pool args, cannot add pool to the list');
	}
	const resp = await fetch('https://api.nomadex.app/pools', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			pool_id: poolId,
			swap_fee: `1000000000000`,
			arc200_id: arc200Id
		})
	});
	const rep = await resp.json();
	if (rep.success) {
		await getListOfArc200Tokens();
		return true;
	}
}