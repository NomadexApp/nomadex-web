<script lang="ts">
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { AlgoArc200PoolConnector } from '$lib/AlgoArc200PoolConnector';
	import { getStores } from '$app/stores';
	import { knownPools, knownTokens, TokenType, type Token } from '$lib';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

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
		goto(`/swap/${knownTokens[0].ticker}-${knownTokens[1].ticker}`, { replaceState: true });
	}

	if (voiToken && arc200Token) {
		const match = knownPools.find((pool) => pool.arc200Asset.assetId === arc200Token.id);
		if (match) matchedPool = match;
	}

	if (!matchedPool) {
		throw Error('pool not found');
	}

	let updating = false;

	async function createPool() {
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
</script>

<section class="flex flex-col justify-center items-center h-full">
	<div class="w-full h-full flex flex-col items-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
			<h4 class="text-left">Update Liquidity Pool (VIA/{matchedPool.arc200Asset.symbol})</h4>

			<div class="flex justify-center mt-2 pr-0">
				<button
					class="btn btn-primary w-full box-border"
					class:disabled={updating}
					disabled={updating}
					on:click={createPool}
				>
					Update Pool
				</button>
			</div>
			<br />
		</form>
	</div>
</section>
