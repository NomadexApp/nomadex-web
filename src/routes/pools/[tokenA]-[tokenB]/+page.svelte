<!-- <script lang="ts">
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { getStores } from '$app/stores';
	import {
		knownPools,
		knownTokens,
		TokenType,
		type Token,
		type Pool,
	} from '$lib';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { onChainStateWatcher, watchArc200Balance } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { nodeClient } from '$lib/_shared';
	import { convertDecimals } from '$lib/numbers';

	const { page } = getStores();
	const tokenA = <Token>$knownTokens.find((token) => token.symbol === $page.params.tokenA);
	const tokenB = <Token>$knownTokens.find((token) => token.symbol === $page.params.tokenB);

	let voiToken: Token = <any>undefined;
	let arc200Token: Token = <any>undefined;
	let matchedPool: Pool = <any>undefined;

	if (tokenA?.symbol === 'VOI' && tokenB?.type === TokenType.SMART) {
		voiToken = tokenA;
		arc200Token = tokenB;
	} else if (tokenB?.symbol === 'VOI' && tokenA?.type === TokenType.SMART) {
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

	let selectionPk = '';
	let stateProofPk = '';
	let votePk = '';
	let voteFirst = 0;
	let voteLast = 0;
	let voteKeyDilution = 0;

	async function registerOnline() {
		const connector = new PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);
		await connector.invoke('registerOnline', {
			selectionPk: Uint8Array.from(Buffer.from(selectionPk, 'base64')),
			stateProofPk: Uint8Array.from(Buffer.from(stateProofPk, 'base64')),
			votePk: Uint8Array.from(Buffer.from(votePk, 'base64')),
			voteFirst,
			voteLast,
			voteKeyDilution,
		});
	}

	async function registerOffline() {
		const connector = new PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);
		await connector.invoke('registerOffline', {});
	}

	// if (!matchedPool) {
	// 	throw Error('pool not found');
	// }

	onMount(async () => {
		if (!matchedPool) return;
		const connector = new PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);
		const globalState = await connector.getGlobalState();
		const manager = globalState.manager;
		const feeController = globalState.feeController;
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
			const connector = new PoolConnector(
				matchedPool.arc200Asset.assetId,
				matchedPool.poolId,
				undefined,
				nodeClient
			);
			await connector.invoke('updatePool');
			console.log('updated');
		} catch (e) {}
		updating = false;

		return;
	}

	$: initialLiquidityAmount = Number(convertDecimals($arc200Balance ?? 0n, arc200Token.decimals, 6)) / 1e6;

	async function createVoiPool() {
		const connector = await PoolConnector.createPool(arc200Token.id);

		console.log('Created App:', connector.appId);
		await connector.invoke('initPool');

		let retry = 0;
		while (!(await saveVoiArc200PoolToList(arc200Token.symbol, connector.appId, arc200Token.id))) {
			if (++retry > 5) break;
		}
		await new Promise((r) => setTimeout(r, 4000));

		window.location.href = `/liquidity/${arc200Token.symbol}/add`;

		return;
	}

	async function setPoolFee() {
		const targetFee = ((feePercent / 100) * SCALE * 100) / platformFeePercent;
		const connector = new PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);
		console.log(await connector.getUnnamedResourcesAccessedFromMethod('setFees', { fee: targetFee }));
		await connector.invoke(
			'setFees',
			{ fee: targetFee },
			await connector.getUnnamedResourcesAccessedFromMethod('setFees', { fee: targetFee })
		);
	}
</script>

<section class="flex flex-col justify-center items-center h-full">
	<div class="w-full h-full flex flex-col items-center p-2">
		{#if matchedPool}
			{#if $connectedAccount === feeControllerAddress}
				<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px]">
					<h4 class="text-left">LP Fee {feePercent}%</h4>
					<input
						type="number"
						placeholder="Swap fee %"
						bind:value={feePercent}
						step={0.000001}
						required
						class="input input-secondary bg-[#00000040] input-bordered w-full focus:outline-none"
					/>

					<div class="flex justify-center mt-2 pr-0">
						<button
							class="btn btn-ghost bg-[#00000040] w-full box-border"
							class:disabled={updating}
							disabled={updating}
							on:click={setPoolFee}
						>
							Set LP Fee
						</button>
					</div>
					<div class="br"></div>
				</form>
			{/if}
			{#if [managerAddress, feeControllerAddress].includes($connectedAccount)}
				<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px]">
					<h4 class="text-left text-xl">Consensus</h4>
					<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<div>Selection PK:</div>
							<input class="input input-secondary bg-[#00000040]" type="text" bind:value={selectionPk} />
						</div>
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<div>State Proof PK:</div>
							<input class="input input-secondary bg-[#00000040]" type="text" bind:value={stateProofPk} />
						</div>
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<div>Vote PK:</div>
							<input class="input input-secondary bg-[#00000040]" type="text" bind:value={votePk} />
						</div>
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<div>Vote First:</div>
							<input class="input input-secondary bg-[#00000040]" type="number" bind:value={voteFirst} />
						</div>
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<div>Vote Last:</div>
							<input class="input input-secondary bg-[#00000040]" type="number" bind:value={voteLast} />
						</div>
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<div>Vote Key Dilution:</div>
							<input class="input input-secondary bg-[#00000040]" type="number" bind:value={voteKeyDilution} />
						</div>
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<button class="btn btn-ghost bg-[#00000040]" on:click={registerOnline}>Register Online</button>
						</div>
						<div class="w-full max-w-[610px] flex flex-col justify-center">
							<button class="btn btn-ghost bg-[#00000040]" on:click={registerOffline}>Register Offline</button>
						</div>
					</div>
					<div class="br"></div>
					{#if $connectedAccount === managerAddress}
						<h4 class="text-left">Update Pool Contract (VOI/{arc200Token.symbol})</h4>

						<div class="flex justify-center mt-2 pr-0">
							<button
								class="btn btn-ghost bg-[#00000040] w-full box-border"
								class:disabled={updating}
								disabled={updating}
								on:click={updatePool}
							>
								Update Pool Contract
							</button>
						</div>
						<div class="br"></div>
					{/if}
				</form>
			{/if}
		{:else if typeof $arc200Balance !== 'undefined'}
			{#if Number($arc200Balance || 0) >= 1}
				<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40">
					<h4 class="text-left">Create Liquidity Pool (VOI/{arc200Token.symbol})</h4>
					<h6 class="text-left">
						Token Balance: {initialLiquidityAmount}
						{arc200Token.symbol}
					</h6>

					{#if $connectedAccount}
						<div class="flex justify-center mt-2 pr-0">
							<button
								class="btn btn-ghost bg-[#00000040] w-full box-border"
								class:disabled={updating}
								disabled={updating}
								on:click={createVoiPool}
							>
								Create Pool
							</button>
						</div>
					{/if}
					<div class="br"></div>
				</form>
			{:else}
				Not Enough balance to create liquidity pool
				<div class="br"></div>
				Balance: {(Number(convertDecimals($arc200Balance ?? 0n, arc200Token.decimals, 6)) / 1e6).toLocaleString('en')}
				{arc200Token.symbol}
			{/if}
		{/if}
	</div>
</section> -->
