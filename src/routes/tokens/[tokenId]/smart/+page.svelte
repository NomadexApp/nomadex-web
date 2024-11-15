<script lang="ts">
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { MySmartAsset } from '$lib/MySmartAsset';

	let appId = Number($page.params.tokenId);
	let currentManager = '';
	let manager = '';
	let name = '';
	let symbol = '';
	let decimals = 0;
	let totalSupply = '0';
	let loading = false;

	onMount(async () => {
		loading = true;
		try {
			const client = new MySmartAsset(appId);

			name = await client.arc200Name();

			symbol = await client.arc200Symbol();

			decimals = await client.arc200Decimals();

			const supply = await client.arc200TotalSupply();
			totalSupply =
				(BigInt(supply) / 10n ** BigInt(decimals)).toLocaleString() +
				'.' +
				(10n ** BigInt(decimals)).toString().slice(1);

			manager = await client.manager();
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		<div class="br"></div>
		<div class="br"></div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Arc200 Token Id:</div>
			<input
				class="input input-secondary bg-[#00000040]"
				on:keypress|preventDefault
				on:paste|preventDefault
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
					<button class="btn btn-primary btn-sm" on:click={() => (manager = $connectedAccount)}>Change Manager</button>
				</div>
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
