<script lang="ts">
	import PoolChartContext from '$lib/components/PoolChartContext.svelte';
	import CurrencyNumber from '$lib/components/CurrencyNumber.svelte';
	import { timeAgo } from '$lib/utils';
	import { convertDecimals } from '$lib/utils/numbers';
</script>

<PoolChartContext>
	<svelte:fragment slot="all-events" let:events let:tokenA let:tokenB>
		<div class="br" />
		<div class="events gap-0 justify-center items-center w-full max-w-[900px]">
			{#if events?.length}
				{@const someEvents = [...events].sort((a, b) => b.txn['confirmed-round'] - a.txn['confirmed-round']).slice(0, 100)}
				<div class="w-full event font-bold p-3 px-0 flex justify-start items-center gap-1 max-w-[900px]">
					<h4 class="text-lg text-left w-full mb-1 max-w-[724px] font-medium">Transactions</h4>
					<span class="flex-grow" />
				</div>

				<table class="table-auto w-full max-w-[900px] bg-[#00000033] backdrop-blur-[5px] rounded-[8px]">
					<thead>
						<tr>
							<th class="text-left px-4 py-3 hidden min-[380px]:table-cell">TxId</th>
							<th class="text-left px-4 py-3 hidden sm:table-cell">Sender</th>
							<th class="text-left px-4 py-3 hidden lg:table-cell">Time</th>
							<th class="text-left px-4 py-3 hidden lg:table-cell">Round</th>
							<th class="text-left px-4 py-3">Amount</th>
							<th class="text-center px-4 py-3" />
							<th class="text-right px-4 py-3">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each someEvents as event}
							{@const isLiquidityTxn = typeof event['lpt'] !== 'undefined'}
							{@const isSwapTxn = !isLiquidityTxn}
							{@const fromAmount = isSwapTxn ? Number(event['fromAmount']) / (event['direction'] ? tokenB.unit : tokenA.unit) : 0}
							{@const toAmount = isSwapTxn ? Number(event['toAmount']) / (event['direction'] ? tokenA.unit : tokenB.unit) : 0}
							{@const alphaAmount = isLiquidityTxn ? Number(convertDecimals(event['amts'][0], tokenA.decimals, 6)) / 1e6 : 0}
							{@const betaAmount = isLiquidityTxn ? Number(convertDecimals(event['amts'][1], tokenB.decimals, 6)) / 1e6 : 0}
							<tr>
								<td class="text-left px-4 py-2 hidden min-[380px]:table-cell">
									<a class="text-white flex-grow text-[0.8rem] sm:text-[1rem]" href="https://avmexplorer.com/tx/{event.txn.id}" target="_blank" referrerpolicy="no-referrer">
										{event.txn.id.slice(0, 3)}...{event.txn.id.slice(-3)}
									</a>
								</td>
								<td class="text-left px-4 py-2 hidden sm:table-cell">
									<a
										class="text-white flex-grow text-[0.8rem] sm:text-[1rem]"
										href="https://avmexplorer.com/address/{event.sender}"
										target="_blank"
										referrerpolicy="no-referrer"
									>
										{event.sender.slice(0, 3)}...{event.sender.slice(-3)}
									</a>
								</td>
								<td class="text-left px-4 py-2 hidden lg:table-cell">
									<span class="text-white flex-grow text-[0.8rem] sm:text-[1rem]">
										{timeAgo(event.txn['round-time'] * 1000)}
									</span>
								</td>
								<td class="text-left px-4 py-2 hidden lg:table-cell">
									<a
										href="https://avmexplorer.com/block/{event.txn['confirmed-round']}"
										target="_blank"
										referrerpolicy="no-referrer"
										class="text-white flex-grow text-[0.8rem] sm:text-[1rem]"
									>
										{event.txn['confirmed-round']}
									</a>
								</td>
								<td class="text-left px-4 py-2 text-nowrap">
									{#if isSwapTxn}
										<span class="opacity-50">{event['direction'] ? tokenB.symbol : tokenA.symbol}</span>
										<CurrencyNumber amount={fromAmount} />
									{:else}
										<span class="opacity-50">{event['direction'] ? tokenB.symbol : tokenA.symbol}</span>
										<CurrencyNumber amount={alphaAmount} />
									{/if}
								</td>
								<td class="text-center px-4 py-2">
									{#if isSwapTxn}
										<span class="opacity-70">→</span>
									{:else if event['adding']}
										<span class="opacity-70 text-xl text-green-400">+</span>
									{:else}
										<span class="opacity-70 text-3xl font-thin text-red-400">-</span>
									{/if}
								</td>
								<td class="text-right px-4 py-2 text-nowrap">
									{#if isSwapTxn}
										<CurrencyNumber amount={toAmount} />
										<span class="opacity-50">{event['direction'] ? tokenA.symbol : tokenB.symbol}</span>
									{:else}
										<CurrencyNumber amount={betaAmount} />
										<span class="opacity-50">{event['direction'] ? tokenA.symbol : tokenB.symbol}</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
		<div class="br" />
		<div class="br" />
		<div class="br" />
	</svelte:fragment>
</PoolChartContext>

<style>
</style>
