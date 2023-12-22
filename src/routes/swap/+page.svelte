<script lang="ts">
	import { TokenType, type Token, knownTokens } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';

	let tokens: Token[] = [knownTokens[0], knownTokens[1]];

	function swapOptions(token: Token): Token[] {
		return knownTokens.filter((tok) => tok.ticker !== token.ticker);
	}

	function setSelectedToken(token: Token, index: number) {
		const lastSelected = tokens[index];
		if (lastSelected.ticker !== token.ticker) {
			let otherTokenIndex: number = index === 0 ? 1 : 0;
			if (token.ticker === tokens[otherTokenIndex].ticker) {
				tokens[otherTokenIndex] = tokens[index];
			}
			tokens[index] = token;
		}
	}
</script>

<div class="flex flex-col justify-center items-center h-full prose">
	<form on:submit|preventDefault class="flex flex-col gap-2 lg:min-w-72">
		<h4 class="text-left">Swap {tokens[0].ticker} for {tokens[1].ticker}</h4>
		<label for="">
			{tokens[0].ticker}
			{#if tokens[0].type}({tokens[0].type}){/if}
		</label>
		<div>
			<input
				type="number"
				placeholder="{tokens[0].ticker} amount"
				class="input input-bordered input-primary"
			/>
			<Dropdown
				options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
				selected={{ name: tokens[0].ticker, value: tokens[0] }}
				onSelect={(value) => setSelectedToken(value, 0)}
			/>
		</div>
		<label for=""
			>{tokens[1].ticker}
			{#if tokens[1].type}({tokens[1].type}){/if}</label
		>
		<div>
			<input
				type="number"
				placeholder="{tokens[1].ticker} amount"
				class="input input-bordered input-primary"
			/>
			<Dropdown
				options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
				selected={{ name: tokens[1].ticker, value: tokens[1] }}
				onSelect={(value) => setSelectedToken(value, 1)}
			/>
		</div>
		<button
			class="btn btn-outline btn-primary"
			class:btn-disabled={tokens[0].ticker === tokens[1].ticker}>Swap</button
		>
	</form>
</div>
