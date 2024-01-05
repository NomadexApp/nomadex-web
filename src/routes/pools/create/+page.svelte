<script lang="ts">
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { AlgoArc200PoolConnector } from '$lib/AlgoArc200PoolConnector';

	let tokenAppId = 6795477;
	let lpFeePercent = 2.5;

	let appId = 0;
	let lpAssetId = 0;

	async function createPool() {
		const connector = await AlgoArc200PoolConnector.createPool(tokenAppId, $connectedAccount, lpFeePercent);

		console.log('Created App:', connector.appId);
		await connector.initialize();

		console.log('Created LP Asset:', connector.lptAssetId);

		await connector.addLiquidity(BigInt(1_000_000), BigInt(100));
		console.log('added liquidity');

		return;
	}
</script>

<section class="flex flex-col justify-center items-center h-full">
	<div class="w-full h-full flex flex-col items-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
			<h4 class="text-left">Create Liquidity Pool for VIA/Arc200</h4>
			<label for=""> Arc200 Token AppId </label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="amount"
					bind:value={tokenAppId}
					step={1}
					required
					class="input input-primary input-bordered w-full focus:outline-none"
				/>
			</div>

			<label for=""> LP Fee (%) </label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="amount"
					bind:value={lpFeePercent}
					min={0}
					max={50}
					step={0.0001}
					required
					class="input input-primary input-bordered w-full focus:outline-none"
				/>
			</div>

			<div class="flex justify-center mt-2 pr-0">
				<button
					class="btn btn-primary w-full box-border"
					class:disabled={!tokenAppId}
					disabled={!tokenAppId}
					on:click={createPool}
				>
					Create Pool
				</button>
			</div>
			<br />
			{#if appId}
				<label for=""> App ID </label>
				<div class="flex items-center relative">
					<input
						type="number"
						placeholder="amount"
						bind:value={appId}
						step={1}
						on:keydown|preventDefault
						class="input input-primary input-bordered w-full focus:outline-none"
					/>
				</div>
			{/if}

			{#if lpAssetId}
				<label for=""> LP Asset ID </label>
				<div class="flex items-center relative">
					<input
						type="number"
						placeholder="amount"
						bind:value={lpAssetId}
						step={1}
						on:keydown|preventDefault
						class="input input-primary input-bordered w-full focus:outline-none"
					/>
				</div>
			{/if}
		</form>
	</div>
</section>
