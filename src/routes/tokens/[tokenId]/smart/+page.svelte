<script lang="ts">
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { SmartAssetClient, APP_SPEC } from '$lib/../contracts/clients/SmartAssetClient';
	import algosdk, { makeEmptyTransactionSigner } from 'algosdk';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { MySmartAsset } from 'nomadex-client';
	import { nodeClient } from '$lib/_shared';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';
	import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';

	let appId = $state(Number($page.params.tokenId));
	let currentManager = $state('');
	let manager = $state('');
	let name = $state('');
	let symbol = $state('');
	let decimals = $state(0);
	let totalSupply = $state('0');
	let loading = $state(false);

	onMount(async () => {
		loading = true;
		try {
			const client = new MySmartAsset(appId, nodeClient);

			name = await client.arc200Name();

			symbol = await client.arc200Symbol();

			decimals = await client.arc200Decimals();

			const supply = await client.arc200TotalSupply();
			totalSupply =
				(BigInt(supply) / 10n ** BigInt(decimals)).toLocaleString() +
				'.' +
				(10n ** BigInt(decimals)).toString().slice(1);

			currentManager = manager = await client.manager();
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	async function grant(manager: string) {
		try {
			const client = new SmartAssetClient(
				{
					id: appId,
					resolveBy: 'id',
					sender: getTransactionSignerAccount(),
				},
				nodeClient
			);
			const resp = await client.grant({
				manager: manager,
			});
			console.log('Confimed:', resp.confirmation?.confirmedRound);
		} catch (e) {
			console.error(e);
		}
	}

	async function updateSmartAsset() {
		try {
			const client = new SmartAssetClient(
				{
					id: appId,
					resolveBy: 'id',
					sender: getTransactionSignerAccount(),
				},
				nodeClient
			);
			const resp = await client.update.updateApplication({});
			console.log('Confimed:', resp.confirmation?.confirmedRound);
		} catch (e) {
			console.error(e);
		}
	}

	async function postUpdate() {
		try {
			const client = new SmartAssetClient(
				{
					id: appId,
					resolveBy: 'id',
					sender: getTransactionSignerAccount(),
				},
				nodeClient
			);
			let atc = await client
				.compose()
				.postUpdate(
					{},
					{
						sendParams: { fee: AlgoAmount.MicroAlgos(algosdk.ALGORAND_MIN_TX_FEE * 2) },
					}
				)
				.atc();
			atc = await populateAppCallResources(atc, nodeClient);
			const resp = await atc.execute(nodeClient, 3);

			console.log('Confimed:', resp.confirmedRound);
		} catch (e) {
			console.error(e);
		}
	}

	async function testRedeem() {
		try {
			const signer = getTransactionSignerAccount();
			const params = await nodeClient.getTransactionParams().do();
			const client = new SmartAssetClient(
				{
					id: appId,
					resolveBy: 'id',
					sender: signer,
				},
				nodeClient
			);
			let compose = client.compose();
			compose.addTransaction({
				txn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
					from: signer.addr,
					to: algosdk.getApplicationAddress(appId),
					assetIndex: 40266686,
					amount: 0,
					suggestedParams: params,
				}),
				signer: signer.signer,
			});
			compose.arc200Redeem({ amount: 0 });
			let atc = await compose.atc();
			atc = await populateAppCallResources(atc, nodeClient);
			const resp = await atc.execute(nodeClient, 3);

			console.log('Confimed:', resp.confirmedRound);
		} catch (e) {
			console.error(e);
		}
	}

	async function swapBack() {
		try {
			const signer = getTransactionSignerAccount();
			const params = await nodeClient.getTransactionParams().do();
			const client = new SmartAssetClient(
				{
					id: appId,
					resolveBy: 'id',
					sender: signer,
				},
				nodeClient
			);
			const compose = client.compose();
			compose.arc200SwapBack(
				{
					amount: 0,
				},
				{
					sendParams: { fee: AlgoAmount.MicroAlgos(algosdk.ALGORAND_MIN_TX_FEE * 2) },
				}
			);
			let atc = await compose.atc();
			atc = await populateAppCallResources(atc, nodeClient);
			const resp = await atc.execute(nodeClient, 3);

			console.log('Confimed:', resp.confirmedRound);
		} catch (e) {
			console.error(e);
		}
	}
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		<div class="br"></div>
		<div class="br"></div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Arc200 Token Id:</div>
			<input
				class="input input-secondary bg-[#00000040]"
				onkeypress={(e) => e.preventDefault()}
				onpaste={(e) => e.preventDefault()}
				type="number"
				value={appId}
			/>
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Token Name:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" value={name} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Token Symbol:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" value={symbol} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Decimals:</div>
			<input class="input input-secondary bg-[#00000040]" type="number" value={decimals} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Total Supply:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" value={totalSupply} />
		</div>

		{#if currentManager}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Manager Address:</div>
				<input class="input input-secondary bg-[#00000040]" type="text" bind:value={manager} />
			</div>
			{#if algosdk.isValidAddress(manager) && manager !== currentManager && algosdk.isValidAddress(manager)}
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" onclick={() => grant(manager)}>Change Manager</button>
				</div>
			{:else if currentManager === $connectedAccount}
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" onclick={() => updateSmartAsset()}>Update Contract</button>
				</div>
				{#if [412682].includes(appId)}
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<button class="btn btn-primary btn-sm" onclick={() => postUpdate()}>Post Update</button>
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<button class="btn btn-primary btn-sm" onclick={() => testRedeem()}>Test Redeem</button>
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<button class="btn btn-primary btn-sm" onclick={() => swapBack()}>Test Swap Back</button>
					</div>
				{/if}
			{/if}
		{/if}

		<!-- {#if $connectedAccount && symbol}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary" class:btn-outline={loading} disabled={loading} on:click={createVoiPool}>
					{#if $knownPools.find((pool) => pool.arc200Asset.assetId === appId)}
						Configure
					{:else}
						Create
					{/if}
					VOI/{symbol} Pool
				</button>
			</div>
		{/if} -->
	</div>
</section>

<style>
</style>
