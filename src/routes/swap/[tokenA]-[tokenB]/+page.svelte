<script lang="ts">
	import { TokenType, type Token, knownTokens } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const { page } = getStores();
	const tokenA = knownTokens.find((token) => token.ticker === $page.params.tokenA);
	const tokenB = knownTokens.find((token) => token.ticker === $page.params.tokenB);

	let tokens: [Token, Token] | undefined = undefined;

	onMount(() => {
		if (!tokenA || !tokenB) {
			goto(`/swap/${knownTokens[0].ticker}-${knownTokens[1].ticker}`, { replaceState: true });
			return;
		}
		tokens = [tokenA, tokenB];
	});

	function setSelectedToken(token: Token, index: number) {
		if (!tokens) return;
		const lastSelected = tokens[index];
		if (lastSelected.ticker !== token.ticker) {
			let otherTokenIndex: number = index === 0 ? 1 : 0;
			if (token.ticker === tokens[otherTokenIndex].ticker) {
				tokens[otherTokenIndex] = tokens[index];
			}
			tokens[index] = token;
		}
	}

	function updateRoute(tokenA: Token, tokenB: Token) {
		goto(`/swap/${tokenA.ticker}-${tokenB.ticker}`);
	}

	$: browser && tokens && tokens[0] && tokens[1] && updateRoute(tokens[0], tokens[1]);
</script>

{#if tokenA && tokenB && tokens}
	<div class="w-full h-full flex flex-col items-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
			<h4 class="text-left">Swap {tokens[0].ticker} for {tokens[1].ticker}</h4>
			<label for="">
				{tokens[0].ticker}
				{#if tokens[0].type}({tokens[0].type}){/if}
			</label>
			<div class="flex items-center">
				<input
					type="number"
					placeholder="{tokens[0].ticker} amount"
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				<Dropdown
					class="btn-primary border-primary border-l-0 rounded-l-none m-0"
					options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
					selected={{ name: tokens[0].ticker, value: tokens[0] }}
					onSelect={(value) => setSelectedToken(value, 0)}
				/>
			</div>
			<label for=""
				>{tokens[1].ticker}
				{#if tokens[1].type}({tokens[1].type}){/if}</label
			>
			<div class="flex items-center">
				<input
					type="number"
					placeholder="{tokens[1].ticker} amount"
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				<Dropdown
					class="btn-primary border-primary border-l-0 rounded-l-none m-0"
					options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
					selected={{ name: tokens[1].ticker, value: tokens[1] }}
					onSelect={(value) => setSelectedToken(value, 1)}
				/>
			</div>
			<div class="flex justify-center mt-2">
				<button
					class="btn btn-primary w-full"
					class:btn-disabled={tokens[0].ticker === tokens[1].ticker}>Swap</button
				>
			</div>
		</form>
	</div>
{/if}
