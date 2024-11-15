<script lang="ts" module>
	export type SwapAlphaBetaOpts = {
		pool: Pool;
		tokenA: Token;
		tokenB: Token;
		amountA: bigint;
		amountB: bigint;
		isDirectionAlphaToBeta: boolean;
	};
</script>

<script lang="ts">
	import { type Pool, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { MyPool } from 'nomadex-client';

	export let onUpdate = () => {};

	async function handleSwap({ pool, tokenA, tokenB, amountA, amountB, isDirectionAlphaToBeta }: SwapAlphaBetaOpts) {
		const remove = addNotification(
			'pending',
			`Swapping ${isDirectionAlphaToBeta ? tokenA.symbol : tokenB.symbol} for ${isDirectionAlphaToBeta ? tokenB.symbol : tokenA.symbol}...`
		);

		try {
			const poolClient = new MyPool(pool.id, PUBLIC_NETWORK as any, nodeClient as any, getTransactionSignerAccount());
			const resultAmount = await poolClient.swap(tokenA, tokenB, amountA, amountB, isDirectionAlphaToBeta);
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
