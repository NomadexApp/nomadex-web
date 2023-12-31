<script lang="ts">
	import { deployVoiSwap, getClient, nodeClient } from '$lib/_shared';
	import algosdk from 'algosdk';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { currentAppId, currentLptAssetId } from '$lib/_deployed';

	let appId = currentAppId;
	let poolToken = currentLptAssetId;
	let fee = 0;
	let admin = '';

	let selection_pk: string;
	let state_proof_pk: string;
	let vote_pk: string;
	let vote_first: number;
	let vote_last: number;
	let vote_key_dilution: number;

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
		const pk = globalState.admin?.asByteArray();
		if (pk) {
			admin = algosdk.encodeAddress(pk) ?? admin;
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

	async function set_admin() {
		const client = getClient(appId);
		if (algosdk.isValidAddress(admin)) {
			await client.setAdmin({
				admin: admin,
			});
		} else {
			console.log('invalid address admin =', admin);
		}
	}

	async function register_offline() {
		const client = getClient(appId);
		await client.registerOffline({});
	}

	async function register_online() {
		const client = getClient(appId);
		await client.registerOnline({
			selection_pk: Uint8Array.from(Buffer.from(selection_pk, 'base64')),
			state_proof_pk: Uint8Array.from(Buffer.from(state_proof_pk, 'base64')),
			vote_pk: Uint8Array.from(Buffer.from(vote_pk, 'base64')),
			vote_first: vote_first,
			vote_last: vote_last,
			vote_key_dilution: vote_key_dilution,
		});
	}
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>App Id:</div>
			<input class="input input-primary" type="number" bind:value={appId} />
		</div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<button class="btn btn-primary btn-sm" on:click={deploy}>DEPLOY</button>
		</div>
		{#if appId !== 0 && appId > 100}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={update}>Update</button>
			</div>

			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Pool Token:</div>
				<input class="input input-primary" type="number" bind:value={poolToken} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={create_pool_token}>Create LPT</button>
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				{#await getInitializetion()}
					Initialized: ...
				{:then isInitialized}
					Initialized: {Boolean(isInitialized?.asByteArray()[0])}
				{/await}
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Admin:</div>
				<input class="input input-primary" type="text" bind:value={admin} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={set_admin}>Set Admin</button>
			</div>

			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Fee:</div>
				<input class="input input-primary" type="number" min={0} max={10000} step={1} bind:value={fee} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={update_fee}>Update Fee</button>
			</div>
		{/if}
	</div>
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		{#if appId !== 0 && appId > 100}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Selection PK:</div>
				<input class="input input-primary" type="text" bind:value={selection_pk} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>State Proof PK:</div>
				<input class="input input-primary" type="text" bind:value={state_proof_pk} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Vote PK:</div>
				<input class="input input-primary" type="text" bind:value={vote_pk} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Vote First:</div>
				<input class="input input-primary" type="number" bind:value={vote_first} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Vote Last:</div>
				<input class="input input-primary" type="number" bind:value={vote_last} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Vote Key Dilution:</div>
				<input class="input input-primary" type="number" bind:value={vote_key_dilution} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={register_online}>Register Online</button>
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={register_offline}>Register Offline</button>
			</div>
		{/if}
	</div>
</section>

<style>
</style>
