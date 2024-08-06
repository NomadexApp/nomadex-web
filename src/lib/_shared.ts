import algosdk, { AtomicTransactionComposer, type EncodedSignedTransaction } from 'algosdk';
import { Arc200SwapClient } from '../contracts/clients/Arc200SwapClient';
import { Buffer } from 'buffer';
import { connectedAccount, getTransactionSignerAccount } from './UseWallet.svelte';
import { get } from 'svelte/store';
import type { SendTransactionFrom } from '@algorandfoundation/algokit-utils/types/transaction';
import Contract from 'arc200js';
import { knownPools } from '$lib';

export const nodeClientAllowsCompile = new algosdk.Algodv2('', 'https://testnet-api.voi.nodly.io', '');
export const algodClientOpts: [string, string, string] = [
	// '', 'https://testnet-api.voi.nodly.io', ''
	/***********************************/
	'b14d9ca0ec11a5b80d961d1824e9733f5bac9c833a476b078ff01a9413434347',
	'https://voi-node-api.nomadex.app/',
	''
];
export const nodeClient = new algosdk.Algodv2(...algodClientOpts);
export const indexerClient = new algosdk.Indexer('', 'https://testnet-idx.voi.nodly.io', '');

export const viaAppId = 6779767;

export const getBoxName = (addr: string) => {
	const box = new Uint8Array(33).fill(0);
	box.set(algosdk.decodeAddress(addr).publicKey, 1);
	return box;
};

export const getBoxValue = async (appId: number, address: string) => {
	return (await nodeClient.getApplicationBoxByName(appId, getBoxName(address)).do()).value;
};

export const getBalance = async (address: string, withoutMinBalance = true) => {
	if (!address) return 0;
	const accountInfo = await nodeClient.accountInformation(address).do();
	return accountInfo.amount - (withoutMinBalance ? accountInfo['min-balance'] : 0);
};

export const getASABalance = async (assetId: number, address: string) => {
	if (!address) return 0;
	const accountInfo = await nodeClient.accountInformation(address).do();
	const asset = (accountInfo.assets ?? []).find((asset) => asset['asset-id'] === assetId);
	if (!asset) {
		return -1;
	} else {
		return asset.amount;
	}
};

export const getArc200Balance = async (appId: number, address: string) => {
	if (!address) return 0;
	const contract = new Contract(appId, nodeClient, indexerClient);
	const resp = await contract.arc200_balanceOf(address);
	if (resp.success) {
		return Number(resp.returnValue);
	}
	try {
		return Number('0x' + Buffer.from(await getBoxValue(appId, address)).toString('hex'));
	} catch (err) {
		return 0;
	}
};

export const getSuggestedParams = async () => {
	return await nodeClient.getTransactionParams().do();
};

export const deployVoiSwap = async (appId = 0) => {
	const account = get(connectedAccount);
	if (!account) return;
	const voiSwapClient = new Arc200SwapClient(
		{
			resolveBy: 'id',
			id: appId ?? 0,
			sender: getTransactionSignerAccount(),
		},
		nodeClient
	);

	if (appId) {
		await voiSwapClient.update.updateApplication([]);
		return appId;
	} else {
		const result = await voiSwapClient.create.createApplication([]);
		return Number(result.confirmation?.applicationIndex);
	}
};

export const getClient = (appId: number, signer = <SendTransactionFrom>getTransactionSignerAccount()) => {
	return new Arc200SwapClient(
		{
			resolveBy: 'id',
			id: appId,
			...(signer
				? {
					sender: signer,
				}
				: {}),
		},
		nodeClient
	);
};

export async function getUnnamedResourcesAccessed(txns: algosdk.Transaction[]) {
	const signer = algosdk.makeEmptyTransactionSigner();
	txns = txns.map((txn) => algosdk.decodeUnsignedTransaction(algosdk.encodeUnsignedTransaction(txn)));

	for (const txn of txns) {
		txn.group = undefined;
	}

	algosdk.assignGroupID(txns);

	const signed = await signer(
		txns,
		txns.map((_, i) => i)
	);

	const request = new algosdk.modelsv2.SimulateRequest({
		txnGroups: [
			new algosdk.modelsv2.SimulateRequestTransactionGroup({
				txns: <EncodedSignedTransaction[]>signed.map(algosdk.decodeObj),
			}),
		],
		allowUnnamedResources: true,
		allowEmptySignatures: true,
	});

	const simulated = await nodeClient.simulateTransactions(request).do();

	return {
		apps: (simulated.txnGroups[0].unnamedResourcesAccessed?.apps ?? []).map((n) => Number(n)),
		assets: (simulated.txnGroups[0].unnamedResourcesAccessed?.assets ?? []).map((n) => Number(n)),
		boxes: (simulated.txnGroups[0].unnamedResourcesAccessed?.boxes ?? []).map((box) => ({
			appIndex: Number(box.app),
			name: box.name,
		})),
		accounts: simulated.txnGroups[0].unnamedResourcesAccessed?.accounts ?? [],
		simulated,
	};
}

export async function getUnnamedResourcesAccessedFromComposer(composer: AtomicTransactionComposer) {
	const txns = composer.buildGroup().map(({ txn }) => txn);
	return getUnnamedResourcesAccessed(txns);
}

export async function getUnnamedResourcesAccessedFromMethod<C extends Arc200SwapClient>(
	client: C,
	methodName: keyof ReturnType<C['compose']>,
	args: any = {}
) {
	const cl: any = client;
	const composer: AtomicTransactionComposer = await cl.compose()[methodName](args, {}).atc();
	return getUnnamedResourcesAccessedFromComposer(composer);
}

export async function getArc200Balances(requests: { assetId: number, address: string }[]) {
	const resp = await fetch(`https://api.nomadex.app/fetch-balances`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(requests.map(req => ({ tokenType: 'ARC200', ...req }))),
	});
	const jsonResponse = await resp.json();
	return jsonResponse.balances;
}

export async function getPoolBalances(userAddress: string) {
	const requests: { tokenType: string; assetId: number; address: string }[] = [];
	for (const pool of get(knownPools)) {
		const poolId = pool.poolId;
		const assetId = pool.arc200Asset.assetId;
		const poolAddress = algosdk.getApplicationAddress(pool.poolId);
		const arc200Bals: [number, string][] = [
			[poolId, poolAddress],
			[assetId, poolAddress],
			...(userAddress ? [<[number, string]>[poolId, userAddress]] : []),
		];
		requests.push(
			...[
				{
					tokenType: 'NET',
					assetId: 0,
					address: poolAddress,
				},
				...arc200Bals.map((bal) => ({
					tokenType: 'ARC200',
					assetId: bal[0],
					address: bal[1],
				})),
			]
		);
	}

	const balances: Record<string, Record<string, string>> = {};
	const limit = 400;

	for (let i = 0; i < requests.length; i += limit) {
		const resp = await fetch(`https://api.nomadex.app/fetch-balances`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(requests.slice(i, i + limit)),
		});
		const jsonResponse = await resp.json();
		if (jsonResponse.balances) {
			for (const addr in jsonResponse.balances) {
				const bals = balances[addr] || {};
				balances[addr] = { ...bals, ...(jsonResponse.balances[addr] || {}) }
			}
		}
	}
	return { balances };
}
