<script lang="ts">
	import { type Token, knownTokens, TokenType, knownPools } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { calculateInTokens, calculateOutTokens } from '$lib/howMuch';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';
	import { onNumberKeyPress } from '$lib/inputs';
	import MdSwapVert from 'svelte-star/dist/md/MdSwapVert.svelte';
	import { onChainStateWatcher } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { AlgoArc200PoolConnector } from '$lib/AlgoArc200PoolConnector';

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
		goto(`/`);
	}

	if (voiToken && arc200Token) {
		const match = knownPools.find((pool) => pool.arc200Asset.assetId === arc200Token.id);
		if (match) matchedPool = match;
	}

	if (!matchedPool) {
		throw Error('pool not found');
	}

	let tokens: [Token, Token] | undefined = [tokenA, tokenB];

	const slippage = 0.01;
	const connectedUserState = onChainStateWatcher.getAccountWatcher($connectedAccount);
	const currentPoolState = onChainStateWatcher.getAccountWatcher(algosdk.getApplicationAddress(matchedPool.poolId));

	$: loaded = $currentPoolState.arc200Balances[tokenA.ticker === 'VOI' ? tokenB.id : tokenA.id];

	function setSelectedToken(token: Token, index: number) {
		if (index === 0) {
			if (tokenA.ticker !== token.ticker) {
				updateRoute(token, tokenB);
			}
		} else {
			if (tokenB.ticker !== token.ticker) {
				updateRoute(tokenA, token);
			}
		}
	}

	function updateRoute(aToken: Token, bToken: Token) {
		if (aToken.ticker !== tokenA.ticker || bToken.ticker !== tokenB.ticker) {
			goto(`/swap/${aToken.ticker}-${bToken.ticker}`, { replaceState: true });
			pageContentRefresh(0);
		}
	}

	$: browser && tokens && tokenA && tokenB && updateRoute(tokenA, tokenB);

	let inputTokenA: number = 0;
	let inputTokenB: number = 0;
	let disabled = true;
	let loading = false;

	let timeout: NodeJS.Timeout;

	async function onInputTokenA() {
		if (!tokenA || !tokenB) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenB = 0;
		if (!inputTokenA || typeof inputTokenA !== 'number') return;
		let tm: NodeJS.Timeout | undefined;
		await new Promise((r) => {
			timeout = setTimeout(r, 500);
			tm = timeout;
		});
		loading = true;
		const ret = calculateOutTokens(
			Math.floor(inputTokenA * tokenA.unit),
			tokenA.ticker === 'VOI' ? $currentPoolState.amount : $currentPoolState.arc200Balances[arc200Token.id],
			tokenA.ticker === 'VOI' ? $currentPoolState.arc200Balances[arc200Token.id] : $currentPoolState.amount,
			matchedPool.swapFee
		);
		loading = false;
		if (tm && tm === timeout) {
			inputTokenB = Number(ret) / tokenB.unit;
			disabled = !inputTokenB;
		}
	}

	async function onInputTokenB() {
		if (!tokenA || !tokenB) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		if (!inputTokenB || typeof inputTokenB !== 'number') return;
		let tm: NodeJS.Timeout | undefined;
		await new Promise((r) => {
			timeout = setTimeout(r, 500);
			tm = timeout;
		});
		loading = true;
		const ret = calculateInTokens(
			Math.floor(inputTokenB * tokenB.unit),
			tokenA.ticker === 'VOI' ? $currentPoolState.amount : $currentPoolState.arc200Balances[arc200Token.id],
			tokenA.ticker === 'VOI' ? $currentPoolState.arc200Balances[arc200Token.id] : $currentPoolState.amount,
			matchedPool.swapFee
		);
		loading = false;
		if (tm && tm === timeout) {
			inputTokenA = (Number(ret) + Number(ret) * 0.0001) / tokenA.unit;
			disabled = !inputTokenB;
		}
	}

	async function swap() {
		if (!tokenA || !tokenB) return;
		const prev = disabled;
		disabled = true;

		const tokenAAmount = Math.floor(inputTokenA * tokenA.unit);
		const tokenBAmount = Math.floor(inputTokenB * tokenB.unit);
		const minOfTokenB = Math.floor(tokenBAmount - Math.round(tokenBAmount * slippage));

		const algoArc200PoolConnector = new AlgoArc200PoolConnector(
			matchedPool.arc200Asset.assetId,
			matchedPool.poolId,
			matchedPool.lptId
		);

		if (tokenA.ticker === voiToken.ticker && tokenB.ticker === arc200Token.ticker) {
			await algoArc200PoolConnector.invoke('swapVoiToArc200', tokenAAmount, minOfTokenB);
			pageContentRefresh(0);
		} else if (tokenA.ticker === arc200Token.ticker && tokenB.ticker === voiToken.ticker) {
			await algoArc200PoolConnector.invoke('swapArc200ToVoi', tokenAAmount, 0);
			pageContentRefresh(0);
		}
		disabled = prev;
	}

	const getTokenSuggestions = (token: Token) => {
		if (token.type === TokenType.ARC200) {
			return knownTokens.slice(1).map((token) => ({ name: token.ticker, value: token }));
		}
	};
</script>

{#if voiToken && arc200Token}
	<div class="w-full h-full flex flex-col items-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
			<h4 class="text-left">Swap {tokenA.ticker} for {tokenB.ticker}</h4>
			<label for="">
				{tokenA.ticker}
			</label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokenA.ticker} amount"
					bind:value={inputTokenA}
					step={0.000001}
					on:keydown={(e) => !loaded && e.preventDefault()}
					on:keypress={onNumberKeyPress}
					on:keyup={onInputTokenA}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				{#await tokenA.ticker === arc200Token.ticker ? $connectedUserState.arc200Balances[arc200Token.id] : $connectedUserState.amount then balance}
					<span
						class="absolute right-0 bottom-full cursor-pointer"
						on:click={() => {
							inputTokenA = balance / tokenA.unit;
							onInputTokenA();
						}}
						on:keydown={null}>MAX {(balance / tokenA.unit).toLocaleString('en')}</span
					>
				{/await}
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={getTokenSuggestions(tokenA)}
					selected={{ name: tokenA.ticker, value: tokenA }}
					onSelect={(value) => setSelectedToken(value, 0)}
				/>
			</div>
			<div class="flex justify-center px-1">
				<button
					type="reset"
					class="btn btn-ghost btn-link btn-sm opacity-30 text-base-content"
					on:click={() => {
						if (!tokens) return;
						updateRoute(tokenB, tokenA);
					}}
				>
					<span class="block h-6"><MdSwapVert /></span>
				</button>
			</div>
			<label for="">{tokenB.ticker}</label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokenB.ticker} amount"
					bind:value={inputTokenB}
					step={0.000001}
					on:keydown={(e) => !loaded && e.preventDefault()}
					on:keypress={onNumberKeyPress}
					on:keyup={onInputTokenB}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				{#await tokenB.ticker === arc200Token.ticker ? $connectedUserState.arc200Balances[arc200Token.id] : $connectedUserState.amount then balance}
					<span class="absolute right-0 bottom-full cursor-pointer">{(balance / tokenB.unit).toLocaleString('en')}</span>
				{/await}
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={getTokenSuggestions(tokenB)}
					selected={{ name: tokenB.ticker, value: tokenB }}
					onSelect={(value) => setSelectedToken(value, 1)}
				/>
			</div>

			<div class="flex flex-col gap-0">
				<span class="flex justify-between items-center">
					Min Received = {(inputTokenB - inputTokenB * slippage).toLocaleString('en')}
					{tokenB.ticker}
					{#if loading}<span class="loading h-4 w-4" />{/if}
				</span>

				<span class="flex justify-between">
					{#if $currentPoolState.arc200Balances[arc200Token.id]}
						Liquidity =
						{($currentPoolState.amount / voiToken.unit).toLocaleString('en')}
						{voiToken.ticker} /
						{($currentPoolState.arc200Balances[arc200Token.id] / arc200Token.unit).toLocaleString('en')}
						{arc200Token.ticker}
					{:else}
						Liquidity = 0 {voiToken.ticker} / 0 {arc200Token.ticker}
						<span class="loading w-[1rem]" />
					{/if}
				</span>
			</div>

			<div class="flex justify-center mt-2 pr-0">
				<button
					class="btn btn-primary w-full box-border"
					class:disabled={tokenA.ticker === tokenB.ticker || disabled}
					{disabled}
					on:click={swap}
				>
					Swap
				</button>
			</div>
		</form>
	</div>
{/if}

<style lang="postcss">
	.disabled {
		@apply btn-outline;
		pointer-events: none;
	}
	form {
		opacity: 0;
		animation: fadein 1s forwards;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
