<script lang="ts">
	import { goto } from '$app/navigation';
	import { TokenType, type Token, knownTokens } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';

	let pools: [Token, Token][] = [
		[knownTokens[0], knownTokens[1]],
		[knownTokens[0], knownTokens[2]],
		[knownTokens[0], knownTokens[3]],
		[knownTokens[1], knownTokens[2]],
		[knownTokens[1], knownTokens[3]],
		[knownTokens[2], knownTokens[3]]
	];
</script>

<div class="p-12 flex flex-col justify-start items-stretch h-full gap-2 pt-20">
	{#each pools as pool}
		<div class="grid h-20 card bg-base-300 rounded-box place-items-center">
			<div class="w-full flex justify-between items-center py-2 px-4">
				<span class="text-md">{pool[0].ticker}-{pool[1].ticker}</span>
				<span class="text-sm">
					Liq. {10000} VOI / {20000} VIA
				</span>
				<div>
					<a href="/swap/{pool[0].ticker}-{pool[1].ticker}" class="btn btn-ghost btn-sm">SWAP</a>
					<a href="/swap/{pool[0].ticker}-{pool[1].ticker}" class="btn btn-ghost btn-sm">
						Add Liquidity
					</a>
				</div>
			</div>
		</div>
		<div class="divider" />
	{/each}
</div>
