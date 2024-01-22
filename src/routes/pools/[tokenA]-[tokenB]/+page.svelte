<script lang="ts">
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { AlgoArc200PoolConnector } from '$lib/AlgoArc200PoolConnector';
	import { getStores } from '$app/stores';
	import { knownPools, knownTokens, TokenType, type Token, type Pool, saveVoiArc200PoolToList } from '$lib';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { onChainStateWatcher, watchArc200Balance } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { nodeClient, nodeClientAllowsCompile } from '$lib/_shared';

	const { page } = getStores();
	const tokenA = <Token>$knownTokens.find((token) => token.ticker === $page.params.tokenA);
	const tokenB = <Token>$knownTokens.find((token) => token.ticker === $page.params.tokenB);

	let voiToken: Token = <any>undefined;
	let arc200Token: Token = <any>undefined;
	let matchedPool: Pool = <any>undefined;

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
		const match = $knownPools.find((pool) => pool.arc200Asset.assetId === arc200Token.id);
		if (match) matchedPool = match;
	}

	const connectedUserState = onChainStateWatcher.getAccountWatcher($connectedAccount);
	const arc200Balance = watchArc200Balance(arc200Token.id, $connectedAccount);

	const SCALE = 100_000_000_000_000;
	let managerAddress = '';
	let feeControllerAddress = '';
	let feePercent = 0;
	let platformFeePercent = 0;

	// if (!matchedPool) {
	// 	throw Error('pool not found');
	// }

	onMount(async () => {
		if (!matchedPool) return;
		const connector = new AlgoArc200PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);
		const globalState = await connector.getGlobalState();
		const manager = globalState.manager;
		const feeController = globalState.fee_controller;
		if (manager) {
			managerAddress = algosdk.encodeAddress(manager.asByteArray());
		}
		if (feeController) {
			feeControllerAddress = algosdk.encodeAddress(feeController.asByteArray());
		}

		const feeBox = await nodeClient.getApplicationBoxByName(matchedPool.poolId, new TextEncoder().encode('fee')).do();
		const swapFee = Number(algosdk.ABIUintType.from('uint256').decode(feeBox.value.slice(0, 32)));
		const platformFee = Number(algosdk.ABIUintType.from('uint256').decode(feeBox.value.slice(32)));
		feePercent = (((100 * swapFee) / SCALE) * platformFee) / SCALE;
		platformFeePercent = (100 * platformFee) / SCALE;
	});

	let updating = false;

	async function updatePool() {
		if (!matchedPool) return;
		try {
			updating = true;
			const connector = new AlgoArc200PoolConnector(
				matchedPool.arc200Asset.assetId,
				matchedPool.poolId,
				undefined,
				nodeClientAllowsCompile
			);
			await connector.invoke('updatePool');
			console.log('updated');
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
		let FIRST_LIQUIDITY = initialLiquidityAmount;
		const connector = await AlgoArc200PoolConnector.createPool(arc200Token.id);

		console.log('Created App:', connector.appId);
		await connector.invoke('initPool');

		await connector.invoke(
			'mint',
			BigInt(FIRST_LIQUIDITY * 1e6),
			BigInt(FIRST_LIQUIDITY) * 10n ** BigInt(arc200Token.decimals)
		);
		console.log('added liquidity');

		await saveVoiArc200PoolToList(arc200Token.ticker, connector.appId, arc200Token.id);

		goto('/');

		return;
	}

	async function setPoolFee() {
		const targetFee = ((feePercent / 100) * SCALE * 100) / platformFeePercent;
		const connector = new AlgoArc200PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);
		console.log(await connector.getUnnamedResourcesAccessedFromMethod('setFees', { fee: targetFee }));
		await connector.invoke(
			'setFees',
			{ fee: targetFee },
			await connector.getUnnamedResourcesAccessedFromMethod('setFees', { fee: targetFee })
		);
	}
</script>

<section class="flex flex-col justify-center items-center h-full">
	<div class="w-full h-full flex flex-col items-center p-12">
		<br />
		{#if matchedPool}
			{#if $connectedAccount === feeControllerAddress}
				<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] prose">
					<h4 class="text-left">LP Fee {feePercent}%</h4>
					<input
						type="number"
						placeholder="Swap fee %"
						bind:value={feePercent}
						step={0.000001}
						required
						class="input input-primary input-bordered w-full focus:outline-none"
					/>

					<div class="flex justify-center mt-2 pr-0">
						<button
							class="btn btn-primary w-full box-border"
							class:disabled={updating}
							disabled={updating}
							on:click={setPoolFee}
						>
							Set LP Fee
						</button>
					</div>
					<br />
				</form>
			{/if}
			{#if $connectedAccount === managerAddress}
				<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] prose">
					<h4 class="text-left">Update Pool Contract (VOI/{arc200Token.ticker})</h4>

					<div class="flex justify-center mt-2 pr-0">
						<button
							class="btn btn-primary w-full box-border"
							class:disabled={updating}
							disabled={updating}
							on:click={updatePool}
						>
							Update Pool Contract
						</button>
					</div>
					<br />
				</form>
			{/if}
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
