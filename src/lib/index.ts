import { writable } from 'svelte/store';
import { getCollection, putDoc } from './firebase';

export enum TokenType {
	Default = '',
	ASA = 'asa',
	ARC200 = 'arc200',
}

export type Token = {
	ticker: string;
	id: number;
	type: TokenType;
	decimals: number;
	unit: number;
};

export type Pool = {
	poolId: number;
	lptId: number;
	arc200Asset: {
		assetId: number;
		symbol: string;
		decimals: number;
		unit: number;
	};
	swapFee: number;
};

export const knownPools = writable<Pool[]>([
	// { lptId: 27705276, poolId: 27705276, swapFee: 1e12, arc200Asset: { symbol: 'VIA', assetId: 6779767, decimals: 6, unit: 1e6 } }
]);

export const knownTokens = writable<Token[]>([
	{ ticker: 'VOI', id: 0, type: TokenType.Default, decimals: 6, unit: 1e6 },
	{ ticker: 'VIA', id: 6779767, type: TokenType.ARC200, decimals: 6, unit: 1e6 },
	{ ticker: 'VRC200', id: 6778021, type: TokenType.ARC200, decimals: 8, unit: 1e8 },
	{ ticker: 'Tacos', id: 6795477, type: TokenType.ARC200, decimals: 0, unit: 1 },
]);

export const arePoolsLoaded = writable(false);

export const contracts = {
	orderbookLimitOrderApp: 26171479,
};

export const contractsConstants = {
	orderbookLimitOrderAppFeePercent: 1,
};

const network = 'voitest-v1';
const version = 'v02';

export async function getListOfArc200Tokens() {
	const tokensSnap = await getCollection(`/networks/${network}/versions/${version}/arc200tokens`);
	const tokens = tokensSnap.docs.map((doc) => {
		const data = doc.data();
		return {
			id: data.id,
			symbol: doc.id,
			decimals: data.decimals,
		};
	});
	const validTokens: Token[] = tokens
		.filter((token) => 0 <= token.decimals && token.decimals <= 18)
		.map((token) => ({
			id: token.id,
			ticker: token.symbol,
			type: TokenType.ARC200,
			decimals: token.decimals,
			unit: 10 ** token.decimals,
		}));

	console.log('Tokens:', validTokens);

	const poolsSnap = await getCollection(`/networks/${network}/versions/${version}/voiarc200pools`);

	const pools = poolsSnap.docs.map((doc) => {
		const data = doc.data();
		return {
			id: data.id,
			arc200Asset: <Token>validTokens.find((token) => token.id === data.arc200Id),
		};
	});
	const validPools: Pool[] = pools
		.filter((pool) => pool.arc200Asset)
		.map((token) => ({
			lptId: token.id,
			poolId: token.id,
			swapFee: 1_000_000_000_000,
			arc200Asset: {
				assetId: token.arc200Asset.id,
				symbol: token.arc200Asset.ticker,
				unit: token.arc200Asset.unit,
				decimals: token.arc200Asset.decimals,
			},
		}));

	console.log('Pools:', validPools);

	knownPools.update((pools) => pools.slice(0, 0).concat(validPools.sort((a, b) => a.poolId - b.poolId)));
	knownTokens.update((toks) => toks.slice(0, 1).concat(validTokens.sort((a, b) => a.id - b.id)));

	arePoolsLoaded.set(true);
}

export async function saveArc200TokenToList(symbol: string, id: number, decimals: number) {
	if (typeof symbol !== 'string' || typeof id !== 'number' || typeof decimals !== 'number') {
		throw Error('Bad arc200 token args, cannot add arc200 to the list');
	}
	await putDoc(`/networks/${network}/versions/${version}/arc200tokens/${symbol}`, { id, decimals });
	await getListOfArc200Tokens();
}

export async function saveVoiArc200PoolToList(symbol: string, poolId: number, arc200Id: number) {
	if (typeof symbol !== 'string' || typeof poolId !== 'number' || typeof arc200Id !== 'number') {
		throw Error('Bad voi-arc200 pool args, cannot add pool to the list');
	}
	await putDoc(`/networks/${network}/versions/${version}/voiarc200pools/VOI-${symbol}`, {
		id: poolId,
		arc200Id: arc200Id,
	});
	await getListOfArc200Tokens();
}

interface ActionTypes {
	'connect-wallet': {
		address: string,
		timestamp: number
		wallet: 'kibisis' | 'wc'
	};
	'swap': {
		address: string,
		timestamp: number,
		txn_id: string,
		pool_id: number,
		arc200_id: number,
		arc200_symbol: string,
		amount_voi: string,
		amount_arc200: string,
		x_to_y: boolean
	};
	'add-liquidity': {
		address: string,
		timestamp: number,
		txn_id: string,
		pool_id: number,
		arc200_id: number,
		arc200_symbol: string,
		amount_voi: string,
		amount_arc200: string,
	};
	'remove-liquidity': {
		address: string,
		timestamp: number,
		txn_id: string,
		pool_id: number,
		arc200_id: number,
		arc200_symbol: string,
		amount_lpt: string
	};
	'create-limit-order': {
		address: string,
		timestamp: number,
		txn_id: string,
		arc200_id: number,
		arc200_symbol: string,
		amount_voi: string,
		amount_arc200: string,
		x_to_y: boolean
	};
	'create-arc200-token': {
		address: string,
		timestamp: number,
		arc200_id: number,
		arc200_symbol: string,
	};
	'create-arc200-pool': {
		address: string,
		timestamp: number,
		pool_id: number,
		arc200_id: number,
		arc200_symbol: string
	};
}

export async function saveVoiActionToList<K extends keyof ActionTypes>(action: K, context: ActionTypes[K]) {
	if (typeof action !== 'string' || typeof context.address !== "string" || typeof context.timestamp !== "number") {
		throw Error('Bad action, cannot save action to the list');
	}
	try {
		// await putDoc(`/networks/${network}/versions/${version}/actions/${context.timestamp}`, { ...context, action });
		const response = await fetch(`https://api.nomadex.app/actions`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				...context,
				action
			})
		});
		const jsonResponse = await response.json();

		if (jsonResponse.success) {
			console.log(`Saved Action: ${action}`);
		}
	} catch (e) {
		console.log(e);
	}
}