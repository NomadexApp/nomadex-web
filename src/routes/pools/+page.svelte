<script lang="ts">
	import { type Token, knownTokens } from '$lib';
	import { currentAppId } from '$lib/_deployed';
	import { getArc200Balance, getBalance, viaAppId } from '$lib/_shared';
	import algosdk from 'algosdk';

	let pools: [Token, Token][] = [[knownTokens[0], knownTokens[1]]];

	async function loadLiq(): Promise<[number, number]> {
		const voiBalance = await getBalance(algosdk.getApplicationAddress(currentAppId));
		const viaBalance = await getArc200Balance(viaAppId, algosdk.getApplicationAddress(currentAppId));
		return [voiBalance, viaBalance];
	}
</script>

<div class="p-12 flex flex-col justify-start items-stretch h-full gap-2 pt-20">
	{#each pools as pool}
		<div class="grid min-h-20 card bg-base-200 rounded-box place-items-center">
			<div class="w-full flex flex-col lg:flex-row justify-between items-center py-2 px-4">
				<span class="text-md">{pool[0].ticker}-{pool[1].ticker}</span>
				<span class="text-sm">
					{#await loadLiq()}
						Liq. ... VOI / ... VIA
					{:then [voi, via]}
						Liq. {(voi / 1e6).toFixed(2)} VOI / {(via / 1e6).toFixed(2)} VIA
					{/await}
				</span>
				<div class="flex">
					<a href="/swap/{pool[0].ticker}-{pool[1].ticker}" class="btn btn-ghost btn-sm">SWAP</a>
					<a href="/liquidity/{pool[0].ticker}-{pool[1].ticker}/add" class="btn btn-ghost btn-sm"> Add Liquidity </a>
					<a href="/liquidity/{pool[0].ticker}-{pool[1].ticker}/remove" class="btn btn-ghost btn-sm">
						Remove Liquidity
					</a>
				</div>
			</div>
		</div>
		<div class="divider" />
	{/each}
</div>
