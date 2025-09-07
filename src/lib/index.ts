import { PUBLIC_NETWORK } from "$env/static/public";
import { get, writable } from "svelte/store";
import { PoolFactoryClient } from "../contracts/clients/PoolFactoryClient";
import { indexerClient, nodeClient } from "./_shared";
import algosdk from "algosdk";
import { getWellknownAssetIds } from "./wellknown";

export enum TokenType {
	ALGO = 0,
	ASA = 1,
	SMART = 2,
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
	tvl: number;
	balances: [string, string];
	volume: [bigint, bigint];
	apr: number;
	online: boolean;
};

export const platformFee = writable<bigint>();
export const knownTokens = writable<Token[]>([{
	symbol: "VOI",
	id: 0,
	type: TokenType.ALGO,
	decimals: 6,
	unit: 1e6,
}]);

export const knownPools = writable<Pool[]>([]);
export const knownAprBoost = {
	411756: 28.75,
	411789: 14.375,
	40176866: 14.375,
	40176894: 14.375,
	40215993: 14.375,
};

export const arePoolsLoaded = writable(false);

export const contracts = {
	localnet: {
		poolFcatory: 1002,
	},
	voitest: {
		poolFcatory: 8319,
	},
	voimain: {
		poolFcatory: 411751,
	},
};

export const contractsConstants = {
	orderbookLimitOrderAppFeePercent: 1,
};

export async function loadTokensAndPools() {
	const factoryId = contracts[PUBLIC_NETWORK].poolFcatory;
	if (!factoryId) {
		arePoolsLoaded.set(true);
		return;
	}
	if (PUBLIC_NETWORK === "localnet") {
		const assets = await indexerClient.searchForAssets().do();
		const apps = await indexerClient.searchForApplications().do();
		const smart = apps.applications.map((app) => {
			console.log(app);
			const asset = {
				id: app.id,
				symbol: "",
				type: TokenType.SMART,
				decimals: 0,
				unit: 1e0,
			};
			app.params["global-state"].forEach((state) => {
				const key = Buffer.from(state.key, "base64").toString();
				if (key === "symbol") {
					asset.symbol = Buffer.from(state.value.bytes, "base64")
						.toString().replace(/\0/g, "");
				}
				if (key === "decimals") {
					asset.decimals = state.value.uint;
					asset.unit = 10 ** state.value.uint;
				}
			});
			return asset;
		});
		knownTokens.set([
			{
				id: 0,
				symbol: "ALGO",
				type: TokenType.ALGO,
				decimals: 6,
				unit: 1e6,
			},
			...assets.assets.map((asa) => ({
				id: asa.index,
				symbol: asa.params["unit-name"],
				type: TokenType.ASA,
				decimals: asa.params.decimals,
				unit: 10 ** asa.params.decimals,
			})),
			...smart,
		]);
		knownPools.set([]);
		arePoolsLoaded.set(true);
		return;
	}
	const tokensSnap: {
		id: number;
		symbol: string;
		decimals: number;
		type: number;
	}[] = await (
		await fetch(`https://${PUBLIC_NETWORK}-analytics.nomadex.app/tokens`)
	).json();
	const tokens = tokensSnap.map((token) => {
		return {
			id: token.id,
			symbol: token.symbol,
			decimals: token.decimals,
			type: token.type,
		};
	});
	const validTokens: Token[] = get(knownTokens)
		.slice(0, 1)
		.concat(
			tokens
				.filter((token) => 0 <= token.decimals && token.decimals <= 18)
				.map((token) => ({
					id: token.id,
					symbol: token.symbol,
					type: <TokenType> token.type,
					decimals: token.decimals,
					unit: 10 ** token.decimals,
				})),
		);

	// console.log('Tokens:', validTokens);

	const poolsSnap: {
		id: number;
		alphaId: number;
		alphaType: number;
		betaId: number;
		betaType: number;
		swapFee: string;
		balances: [string, string];
		volume: [string, string];
		apr: number;
		online: boolean;
	}[] = await (await fetch(
		`https://${PUBLIC_NETWORK}-analytics.nomadex.app/pools`,
	)).json();
	const pools = poolsSnap.map((pool) => {
		return {
			id: pool.id,
			alphaId: pool.alphaId,
			alphaType: pool.alphaType,
			betaId: pool.betaId,
			betaType: pool.betaType,
			swapFee: pool.swapFee,
			balances: pool.balances,
			volume: pool.volume,
			apr: pool.apr,
			online: pool.online,
		};
	});
	const validPools: Pool[] = pools
		.map((pool) => ({
			id: pool.id,
			poolId: pool.id,
			swapFee: pool.swapFee,
			type: TokenType.SMART,
			assets: <[Token, Token]> [pool.alphaId, pool.betaId].map((id) =>
				validTokens.find((t) => t.id === id)
			),
			balances: pool.balances,
			tvl: 0,
			volume: [BigInt(pool.volume[0]), BigInt(pool.volume[1])] as [
				bigint,
				bigint,
			],
			apr: pool.apr,
			online: pool.online ?? false,
		}))
		.filter((p) => p.assets.reduce((a, r) => !!r && !!a, true));

	// console.log('Pools:', validPools);

	const factory = new PoolFactoryClient(
		{
			id: factoryId,
			resolveBy: "id",
		},
		nodeClient,
	);
	const state = await factory.getGlobalState();
	const buff = state.platformFee?.asByteArray();
	if (!buff) return;
	platformFee.set(algosdk.ABIType.from("uint256").decode(buff) as bigint);

	// console.log('Platform Fee (%):', (Number(get(platformFee)) * 100) / SCALE);

	for (const pool of validPools) {
		const [alpha, beta] = pool.assets;
		const algoIdx = [alpha, beta].findIndex((a) => a.id === 0);
		if (algoIdx > -1) {
			if (
				pool["balances"].reduce(
					(acc, x) => Boolean(acc && Number(x)),
					true,
				)
			) {
				pool.tvl = Number(pool["balances"][algoIdx]) * 2;
			} else {
				pool.tvl = Number(pool["balances"][algoIdx]);
			}
		}
	}

	for (const pool of validPools) {
		if (pool.assets[0].type === TokenType.ALGO) continue;
		const pools = pool.assets.map((asset) => {
			if (asset.type !== TokenType.ALGO) {
				return validPools.find((p) =>
					p.assets[0].id === 0 && p.assets[1].id === asset.id
				);
			}
		});
		if ((pools[0]?.tvl ?? 0) > (pools[1]?.tvl ?? 0) && pools[0]) {
			pool.tvl = (2 *
				(Number(pool.balances[0]) * Number(pools[0].balances[0]))) /
				Number(pools[0].balances[1]);
		} else if (pools[1]) {
			pool.tvl = (2 *
				(Number(pool.balances[1]) * Number(pools[1].balances[0]))) /
				Number(pools[1].balances[1]);
		}
	}

	knownPools.update(() =>
		validPools
			.toSorted((a, b) => {
				let scoreB = b.tvl;
				const scale = 1;
				// if (b.online) scoreB *= scale;
				if (b.volume[0] > 0n) scoreB *= scale;
				if (knownAprBoost[b.id]) scoreB *= scale;
				scoreB *= 1 + b.apr / 50;
				let scoreA = a.tvl;
				// if (a.online) scoreA *= scale;
				if (a.volume[0] > 0n) scoreA *= scale;
				if (knownAprBoost[b.id]) scoreA *= scale;
				scoreA *= 1 + b.apr / 50;
				return scoreB - scoreA;
			})
	);
	const wellKnown = getWellknownAssetIds();
	knownTokens.update(() =>
		validTokens
			.toSorted((a, b) => {
				return a.id - b.id;
			})
			.toSorted((a, b) => {
				if (wellKnown.includes(a.id) && wellKnown.includes(b.id)) {
					return 0;
				} else if (wellKnown.includes(a.id)) {
					return -1;
				} else if (wellKnown.includes(b.id)) {
					return 1;
				}
				return 0;
			})
	);

	arePoolsLoaded.set(true);
}

export async function tokensAndPoolsRefresh() {
	try {
		await loadTokensAndPools();
	} catch (e: unknown) {
		if (e) {
			//
		}
	}
}
