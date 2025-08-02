<script lang="ts">
	import type { Token } from '$lib';
	import { convertDecimals } from '$lib/utils/numbers';
	import { getWellknownAssetIds } from '$lib/wellknown';
	import TextInput from '../form/TextInput.svelte';

	let {
		close,
		tokens = [],
		handleSelect = () => {},
	}: { close: Function; tokens?: Token[]; handleSelect?: (token: Token) => void } = $props();

	let tokenSearch = $state('');
	let balances = $state({});

	let filteredTokens = $derived(
		tokenSearch
			? tokens.filter(
					(token) =>
						token.id.toString() === tokenSearch ||
						token.symbol.toLowerCase().match(new RegExp(`^${tokenSearch.toLowerCase()}`))
				)
			: tokens
	);

	let finalTokensList = $derived(
		[...filteredTokens].sort(
			(a, b) => Number(balances[b.id] || 0) / 10 ** b.decimals - Number(balances[a.id] || 0) / 10 ** a.decimals
		)
	);

	const wellknown = getWellknownAssetIds();
</script>

<form>
	<h3 class="text-2xl mb-4">Select a token</h3>
	<TextInput placeholder="Search by name or id" bind:value={tokenSearch} />
	<div class="br"></div>
	<span class="block text-xl mb-4">
		{#if tokenSearch}Matched tokens{:else}Tokens{/if}
	</span>
	<div class="tokens flex flex-col gap-2 mb-4 overflow-y-auto max-h-96">
		{#each finalTokensList as token}
			<button
				class="text-left token flex gap-4 bg-[#f0f0f005] hover:bg-[#f0f0f010] rounded p-2 cursor-pointer"
				onclick={() => {
					handleSelect(token);
					close();
				}}
			>
				<div class="icon avatar w-10 h-10 bg-[#f0f0f005] rounded-full flex justify-center items-center">
					<object
						title={token.symbol}
						data={wellknown.includes(token.id) ? `/tokens/${token.id}.png` : ''}
						type={wellknown.includes(token.id) ? 'image/png' : ''}
						class="hidden sm:flex icon avatar w-7 h-7 bg-[#3a635f] rounded-full justify-center items-center"
					>
						?
					</object>
				</div>
				<div class="flex flex-col text-sm flex-grow">
					<span class="name">{token.symbol}</span>
					<span class="symbol text-gray-200">{token.id}</span>
				</div>
				{#if balances[token.id] && Number(balances[token.id]) > 0}
					<div>
						{(Number(convertDecimals(balances[token.id] ?? 0, token.decimals, 6)) / 1e6).toLocaleString()}
						{token.symbol}
					</div>
				{/if}
			</button>
		{/each}
	</div>
</form>

<div class="buttons">
	<button class="btn btn-ghost w-full" onclick={() => close()}>Close</button>
</div>

<style>
	form {
		width: 100vw;
		max-width: calc(500px - 2rem);
		overflow: hidden;
	}
	.tokens {
		display: flex;
		flex-direction: column;
	}

	.token {
		display: flex;
	}
</style>
