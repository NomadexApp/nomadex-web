<script lang="ts">
	import { connectedAccount, getTransactionSignerAccount, signAndSendTransections } from '$lib/UseWallet.svelte';
	import { getUnnamedResourcesAccessed, nodeClient } from '$lib/_shared';
	import algosdk from 'algosdk';
	import { Arc200TokenClient } from '../../../contracts/clients/Arc200TokenClient';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Contract from 'arc200js';
	import { AlgoArc200PoolV02Client } from '../../../contracts/clients/AlgoArc200PoolV02Client';
	import { addNotification } from '$lib/Notify.svelte';
	import { Arc200Interface } from '$lib/utils';
	import { AlgoArc200PoolConnector } from '$lib/AlgoArc200PoolConnector';

	let appId = Number($page.params.tokenId);
	let currentManager = '';
	let manager = '';
	let name = '';
	let symbol = '';
	let decimals = 0;
	let totalSupply = 0;

	onMount(async () => {
		const client = new Arc200TokenClient(
			{
				id: appId,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		const contract = new Contract(appId, nodeClient, undefined);

		const arc200_name = await contract.arc200_name();
		name = arc200_name.success ? arc200_name.returnValue : '';

		const arc200_symbol = await contract.arc200_symbol();
		symbol = arc200_symbol.success ? arc200_symbol.returnValue : '';

		const arc200_decimals = await contract.arc200_decimals();
		decimals = arc200_decimals.success ? Number(arc200_decimals.returnValue) : 0;

		const arc200_totalSupply = await contract.arc200_totalSupply();
		totalSupply = arc200_totalSupply.success ? Number(arc200_totalSupply.returnValue / 10n ** BigInt(decimals)) : 0;

		const state = await client.getGlobalState();
		if (state.manager) {
			manager = algosdk.encodeAddress(state.manager.asByteArray());
			currentManager = manager;
		}
	});

	function strToFixedBytes(str: string, length: number) {
		str = str.slice(0, length);
		const uint8Array = new TextEncoder().encode(str);
		const restArray = new Uint8Array(length - uint8Array.length);

		return Uint8Array.from([...uint8Array, ...restArray]);
	}

	const FIRST_LIQUIDITY = 100;

	async function createVoiPool() {
		const connector = await AlgoArc200PoolConnector.createPool(appId);

		console.log('Created App:', connector.appId);
		await connector.invoke('initPool');

		console.log('Created LP Asset:', connector.lptAssetId);

		await connector.invoke('mint', BigInt(FIRST_LIQUIDITY * 1e6), BigInt(FIRST_LIQUIDITY) * 10n ** BigInt(decimals));
		console.log('added liquidity');

		return;
		const tokenAppId = appId;

		manager = $connectedAccount;
		console.log(manager);
		const tokenInfo = {
			manager,
			name: strToFixedBytes(`VOI-${symbol} LPT`, 32),
			symbol: strToFixedBytes(`LPT`, 8),
		};
		const client = new AlgoArc200PoolV02Client(
			{
				id: 0,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			new algosdk.Algodv2('', 'https://testnet-api.voi.nodly.io', '')
		);

		let remove = () => {};
		try {
			remove = addNotification('pending', 'Deploying token contract');
			console.log('deploying');
			const result = await client.create.createApplication({ manager: $connectedAccount });
			console.log('deployed');
			const poolAppId = Number(result.confirmation?.applicationIndex);

			console.log('Deployed contract:', poolAppId);
			remove();

			remove = addNotification('pending', 'Initializing token contract');

			const suggestedParams = await nodeClient.getTransactionParams().do();

			const getInitGroup = async (res?: object): Promise<algosdk.Transaction[]> => {
				console.log(res);
				const deployed = new AlgoArc200PoolV02Client(
					{
						id: poolAppId,
						resolveBy: 'id',
						sender: getTransactionSignerAccount(),
					},
					nodeClient
				).compose();

				deployed.addTransaction({
					txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
						from: $connectedAccount,
						to: algosdk.getApplicationAddress(poolAppId),
						amount: 1_000_000,
						suggestedParams: suggestedParams,
					}),
					signer: getTransactionSignerAccount().signer,
				});

				await deployed.poolInitialize(
					{
						name: tokenInfo.name,
						symbol: tokenInfo.symbol,
						tokenYAppId: tokenAppId,
					},
					...(res ? [res] : [])
				);

				const txns = (await deployed.atc()).buildGroup().map((a) => a.txn);

				if (res) {
					return txns;
				}

				return getInitGroup(await getUnnamedResourcesAccessed(txns));
			};

			const arc200TransferTxns = await Arc200Interface.arc200_transfer(
				tokenAppId,
				$connectedAccount,
				algosdk.getApplicationAddress(poolAppId),
				10n ** BigInt(decimals)
			);
			const txns = await getInitGroup();

			const allTxns: algosdk.Transaction[] = [];

			for (const txn of [...arc200TransferTxns, ...txns]) {
				txn.group = undefined;
				allTxns.push(txn);
			}

			algosdk.assignGroupID(allTxns);

			await signAndSendTransections(nodeClient, [allTxns]);
			remove();
			addNotification('success', `Created pool ${poolAppId}`, 10000);
		} catch (e) {
			console.error((<Error>e).message);
			remove();
		}
	}
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Arc200 Token Id:</div>
			<input
				class="input input-primary"
				on:keypress|preventDefault
				on:paste|preventDefault
				type="number"
				value={appId}
			/>
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Token Name:</div>
			<input class="input input-primary" type="text" bind:value={name} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Token Symbol:</div>
			<input class="input input-primary" type="text" bind:value={symbol} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Decimals:</div>
			<input class="input input-primary" type="number" bind:value={decimals} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Total Supply:</div>
			<input class="input input-primary" type="number" bind:value={totalSupply} />
		</div>

		{#if currentManager}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Manager Adress:</div>
				<input class="input input-primary" type="text" bind:value={manager} />
			</div>
			{#if algosdk.isValidAddress(manager) && manager !== currentManager}
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" on:click={() => (manager = $connectedAccount)}>Change Manager</button>
				</div>
			{/if}
		{/if}

		{#if symbol}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={createVoiPool}>Create VOI/{symbol} Pool</button>
			</div>
		{/if}
	</div>
</section>

<style>
</style>
