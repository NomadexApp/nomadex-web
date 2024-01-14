<script lang="ts">
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { AlgoArc200PoolConnector } from '$lib/AlgoArc200PoolConnector';
	import { getStores } from '$app/stores';
	import { knownPools, knownTokens, TokenType, type Token } from '$lib';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import algosdk from 'algosdk';
	import { onChainStateWatcher, watchArc200Balance, watchPoolTotalSupply } from '$lib/stores/onchain';

	const { page } = getStores();
	const tokenA = <Token>knownTokens.find((token) => token.ticker === $page.params.tokenA);
	const tokenB = <Token>knownTokens.find((token) => token.ticker === $page.params.tokenB);

	let voiToken: Token = <any>undefined;
	let arc200Token: Token = <any>undefined;
	let matchedPool: (typeof knownPools)[0] = <any>undefined;

	if (tokenA?.ticker === 'VOI' && tokenB?.type === TokenType.ARC200) {
		voiToken = tokenA;
		arc200Token = tokenB;
	} else if (tokenB?.ticker === 'VOI' && tokenA?.type === TokenType.ARC200) {
		voiToken = tokenB;
		arc200Token = tokenA;
	} else if (browser) {
		goto(`/`, { replaceState: true });
	}

	if (voiToken && arc200Token) {
		const match = knownPools.find((pool) => pool.arc200Asset.assetId === arc200Token.id);
		if (match) matchedPool = match;
	}

	const connectedUserState = onChainStateWatcher.getAccountWatcher($connectedAccount);
	const arc200Balance = watchArc200Balance(arc200Token.id, $connectedAccount);

	// if (!matchedPool) {
	// 	throw Error('pool not found');
	// }

	let updating = false;

	async function updatePool() {
		if (!matchedPool) return;
		try {
			updating = true;
			const connector = new AlgoArc200PoolConnector(
				matchedPool.arc200Asset.assetId,
				matchedPool.poolId,
				matchedPool.lptId
			);
			await connector.updatePool();
		} catch (e) {}
		updating = false;

		return;
	}

	$: initialLiquidityAmount = Math.min(
		Math.min(
			Math.floor(Number(($arc200Balance ?? 0n) / 10n ** BigInt(Math.max(0, arc200Token.decimals - 6))) / 1e6),
			Math.min(Math.floor($connectedUserState.amount), 100)
		),
		100
	);

	async function createVoiPool() {
		let FIRST_LIQUIDITY = 0;
		const connector = await AlgoArc200PoolConnector.createPool(arc200Token.id);

		console.log('Created App:', connector.appId);
		await connector.invoke('initPool');

		console.log('Created LP Asset:', connector.lptAssetId);

		await connector.invoke(
			'mint',
			BigInt(FIRST_LIQUIDITY * 1e6),
			BigInt(FIRST_LIQUIDITY) * 10n ** BigInt(arc200Token.decimals)
		);
		console.log('added liquidity');

		return;
	}
</script>

<section class="flex flex-col justify-center items-center h-full">
	<div class="w-full h-full flex flex-col items-center p-12">
		{#if matchedPool}
			<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
				<h4 class="text-left">Update Liquidity Pool (VOI/{arc200Token.ticker})</h4>

				<div class="flex justify-center mt-2 pr-0">
					<button
						class="btn btn-primary w-full box-border"
						class:disabled={updating}
						disabled={updating}
						on:click={updatePool}
					>
						Update Pool
					</button>
				</div>
				<br />
			</form>
		{:else if typeof $arc200Balance !== 'undefined'}
			<!--  -->
			{#if (initialLiquidityAmount ?? 0) > 1}
				<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
					<h4 class="text-left">Create Liquidity Pool (VOI/{arc200Token.ticker})</h4>
					<h6 class="text-left">
						Initial Liquidity: {initialLiquidityAmount} VOI / {initialLiquidityAmount}
						{arc200Token.ticker}
					</h6>

					<div class="flex justify-center mt-2 pr-0">
						<button
							class="btn btn-primary w-full box-border"
							class:disabled={updating}
							disabled={updating}
							on:click={createVoiPool}
						>
							Create Pool
						</button>
					</div>
					<br />
				</form>
			{:else}
				Not Enough balance to create liquidity pool
				<br />
				Balance: {($connectedUserState.amount / 1e6).toLocaleString('en')} VOI / {(
					Number(($arc200Balance ?? 0n) / 10n ** BigInt(Math.max(0, arc200Token.decimals - 6))) / 1e6
				).toLocaleString('en')}
				{arc200Token.ticker}
			{/if}
		{/if}
	</div>
</section>
