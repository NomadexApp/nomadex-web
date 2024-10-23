<script lang="ts" context="module">
	export type SwapAlphaBetaOpts = {
		pool: Pool;
		tokenA: Token;
		tokenB: Token;
		inputTokenA: number;
		minOfTokenB: number;
		isDirectionAlphaToBeta: boolean;
	};
</script>

<script lang="ts">
	import { type Pool, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { convertDecimals } from '$lib/utils/numbers';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { MyPool } from 'nomadex-client';

	export let onUpdate = () => {};

	async function handleSwap({
		pool,
		tokenA,
		tokenB,
		inputTokenA,
		minOfTokenB,
		isDirectionAlphaToBeta,
	}: SwapAlphaBetaOpts) {
		const remove = addNotification(
			'pending',
			`Swapping ${isDirectionAlphaToBeta ? tokenA.symbol : tokenB.symbol} for ${isDirectionAlphaToBeta ? tokenB.symbol : tokenA.symbol}...`
		);

		try {
			const poolClient = new MyPool(pool.id, PUBLIC_NETWORK as any, nodeClient as any, getTransactionSignerAccount());
			const resultAmount = await poolClient.swap(
				tokenA,
				tokenB,
				convertDecimals(Math.floor(inputTokenA * 1e6), 6, tokenA.decimals),
				convertDecimals(Math.floor(minOfTokenB * 1e6), 6, tokenB.decimals),
				isDirectionAlphaToBeta
			);
			onUpdate();
			return resultAmount;
		} catch (e) {
			console.error(e);
			if (e instanceof Error) {
				addNotification('error', e.message, 15000);
			}
		} finally {
			remove();
		}
	}
</script>

<slot {handleSwap} />
