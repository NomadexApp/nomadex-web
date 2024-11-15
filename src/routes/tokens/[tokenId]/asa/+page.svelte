<script lang="ts">
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { nodeClient } from '$lib/_shared';
	import algosdk from 'algosdk';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { knownPools } from '$lib';

	let appId = $state(Number($page.params.tokenId));
	let currentManager = $state('');
	let manager = $state('');
	let reserve = $state('');
	let freeze = $state('');
	let clawback = $state('');
	let name = $state('');
	let symbol = $state('');
	let decimals = $state(0);
	let totalSupply = $state('0');
	let loading = $state(false);

	onMount(async () => {
		loading = true;
		try {
			const resp = await nodeClient.getAssetByID(appId).do();
			console.log(resp.params);
			currentManager = resp.params.manager;
			manager = resp.params.manager;
			reserve = resp.params.reserve;
			freeze = resp.params.freeze;
			clawback = resp.params.clawback;
			name = resp.params.name;
			symbol = resp.params['unit-name'];
			decimals = resp.params.decimals;

			const supply = resp.params.total;
			totalSupply =
				(BigInt(supply) / 10n ** BigInt(decimals)).toLocaleString() +
				'.' +
				(10n ** BigInt(decimals)).toString().slice(1);
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	async function createVoiPool() {
		goto(`/pools/VOI-${symbol}`);
	}
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		<div class="br"></div>
		<div class="br"></div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>ASA Id:</div>
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
			{#if algosdk.isValidAddress(manager) && manager !== currentManager}
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" onclick={() => (manager = $connectedAccount)}>Change Manager</button>
				</div>
			{/if}
		{/if}

		{#if reserve}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Reserve Address:</div>
				<input class="input input-secondary bg-[#00000040]" type="text" bind:value={reserve} />
			</div>
		{/if}

		{#if freeze}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Freeze Address:</div>
				<input class="input input-secondary bg-[#00000040]" type="text" bind:value={freeze} />
			</div>
		{/if}

		{#if clawback}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Clawback Address:</div>
				<input class="input input-secondary bg-[#00000040]" type="text" bind:value={clawback} />
			</div>
		{/if}

		{#if $connectedAccount && symbol}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary" class:btn-outline={loading} disabled={loading} onclick={createVoiPool}>
					{#if $knownPools.find((pool) => pool.assets.find((as) => as.id === appId))}
						Configure
					{:else}
						Create
					{/if}
					VOI/{symbol} Pool
				</button>
			</div>
		{/if}
	</div>
</section>

<style>
</style>
