<script lang="ts">
	import { deployVoiSwap, getClient, nodeClient } from '$lib/_shared';
	import algosdk from 'algosdk';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { browser } from '$app/environment';
	let appId = 24589652;
	let poolToken = 24589656;
	let fee = 0;

	async function deploy() {
		appId = (await deployVoiSwap(0)) ?? appId;
	}

	async function update() {
		appId = (await deployVoiSwap(appId)) ?? appId;
	}

	async function create_pool_token() {
		const params = await nodeClient.getTransactionParams().do();
		const client = getClient(appId);
		const resp = await client.createPoolToken({
			seed: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				from: $connectedAccount,
				to: algosdk.getApplicationAddress(appId),
				amount: 1010_000,
				suggestedParams: params,
			}),
		});
		poolToken = Number(resp.return ?? 0);
	}

	async function getInitializetion() {
		const client = getClient(appId);
		const globalState = await client.getGlobalState();
		if (globalState.fee) {
			fee = globalState.fee.asNumber();
		}
		return globalState.initialized;
	}

	async function update_fee() {
		const client = getClient(appId);
		const _fee = fee;
		await client.setFees({
			fee: _fee,
		});
	}
</script>

<section class="p-4 h-full flex flex-col justify-center items-center gap-3">
	<div class="w-full max-w-[200px] flex flex-col justify-center">
		<div>App Id:</div>
		<input class="input input-primary" type="number" bind:value={appId} />
	</div>
	<div class="w-full max-w-[200px] flex flex-col justify-center">
		<button class="btn btn-primary btn-sm" on:click={deploy}>DEPLOY</button>
	</div>
	{#if appId !== 0 && appId > 100}
		<div class="w-full max-w-[200px] flex flex-col justify-center">
			<button class="btn btn-primary btn-sm" on:click={update}>Update</button>
		</div>

		<div class="w-full max-w-[200px] flex flex-col justify-center">
			<div>Pool Token:</div>
			<input class="input input-primary" type="number" bind:value={poolToken} />
		</div>
		{#if !poolToken}
			<div class="w-full max-w-[200px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={create_pool_token}>Create LPT</button>
			</div>
		{:else}
			<div class="w-full max-w-[200px] flex flex-col justify-center">
				{#await getInitializetion()}
					Initialized: ...
				{:then isInitialized}
					Initialized: {Boolean(isInitialized?.asByteArray()[0])}
				{/await}
			</div>
		{/if}
		<div class="w-full max-w-[200px] flex flex-col justify-center">
			<div>Fee:</div>
			<input class="input input-primary" type="number" min={0} max={10000} step={1} bind:value={fee} />
		</div>
		<div class="w-full max-w-[200px] flex flex-col justify-center">
			<button class="btn btn-primary btn-sm" on:click={update_fee}>Update Fee</button>
		</div>
	{/if}
</section>

<style>
</style>
