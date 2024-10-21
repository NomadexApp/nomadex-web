<!-- <script lang="ts">
	import { type Token, knownTokens, TokenType, knownPools, contracts } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';
	import { onNumberKeyPress } from '$lib/inputs';
	import MdSwapVert from '$lib/icons/MdSwapVert.svelte';
	import { onChainStateWatcher } from '$lib/stores/onchain';
	import { LimitOrderType, LimitOrders001ClientConnector } from '$lib/LimitOrderConnector';
	import { lastActiveLimitOrderPair } from '$lib/stores';

	const { page } = getStores();
	const tokenA = <Token>$knownTokens.find((token) => token.symbol === $page.params.tokenA);
	const tokenB = <Token>$knownTokens.find((token) => token.symbol === $page.params.tokenB);

	let voiToken: Token = <any>undefined;
	let arc200Token: Token = <any>undefined;

	if (tokenA?.symbol === 'VOI' && tokenB?.type === TokenType.ARC200) {
		voiToken = tokenA;
		arc200Token = tokenB;
	} else if (tokenB?.symbol === 'VOI' && tokenA?.type === TokenType.ARC200) {
		voiToken = tokenB;
		arc200Token = tokenA;
	} else if (browser) {
		goto(`/`);
	}

	lastActiveLimitOrderPair.set(arc200Token.symbol);

	let tokens: [Token, Token] | undefined = [tokenA, tokenB];

	let slippage = browser ? JSON.parse(localStorage.getItem('slippage') ?? '0.025') : 0.025;

	$: browser && localStorage.setItem('slippage', JSON.stringify(slippage));

	const connectedUserState = onChainStateWatcher.getAccountWatcher($connectedAccount);

	$: loaded = true;

	function setSelectedToken(token: Token, index: number) {
		if (index === 0) {
			if (tokenA.symbol !== token.symbol) {
				updateRoute(token, tokenB);
			}
		} else {
			if (tokenB.symbol !== token.symbol) {
				updateRoute(tokenA, token);
			}
		}
	}

	function updateRoute(aToken: Token, bToken: Token) {
		if (aToken.symbol !== tokenA.symbol || bToken.symbol !== tokenB.symbol) {
			goto(`/limit-orders/create/${aToken.symbol}-${bToken.symbol}`, { replaceState: true });
			pageContentRefresh(0);
		}
	}

	$: browser && tokens && tokenA && tokenB && updateRoute(tokenA, tokenB);

	let inputTokenA: number = 0;
	let inputTokenB: number = 0;
	let disabled = false;

	async function createLimitOrder() {
		if (!tokenA || !tokenB) return;
		const prev = disabled;
		disabled = true;

		const tokenAAmount = Math.floor(inputTokenA * tokenA.unit);
		const tokenBAmount = Math.floor(inputTokenB * tokenB.unit);
		const connector = new LimitOrders001ClientConnector(contracts.orderbookLimitOrderApp);

		if (tokenA.symbol === voiToken.symbol && tokenB.symbol === arc200Token.symbol) {
			await connector.invoke(
				'createOrder',
				LimitOrderType.SELL_ALGO_FOR_ARC200,
				arc200Token.id,
				BigInt(tokenAAmount),
				BigInt(tokenBAmount)
			);
			pageContentRefresh(0);
		} else if (tokenA.symbol === arc200Token.symbol && tokenB.symbol === voiToken.symbol) {
			await connector.invoke(
				'createOrder',
				LimitOrderType.SELL_ARC200_FOR_ALGO,
				arc200Token.id,
				BigInt(tokenBAmount),
				BigInt(tokenAAmount)
			);
			pageContentRefresh(0);
		}
		disabled = prev;
	}

	const getTokenSuggestions = (token: Token) => {
		if (token.type === TokenType.ARC200) {
			return $knownTokens.slice(1).map((token) => ({ name: token.symbol, value: token }));
		}
	};

	$: disabled = !inputTokenA || !inputTokenB;
</script>

{#if voiToken && arc200Token}
	<div class="w-full h-full flex flex-col items-center justify-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] prose">
			<h4 class="text-lg text-left prose">Limit Order (Sell {tokenA.symbol} for {tokenB.symbol})</h4>
			<label for="">
				{tokenA.symbol} (Selling Amount)
			</label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokenA.symbol} amount"
					bind:value={inputTokenA}
					step={0.000001}
					on:keydown={(e) => !loaded && e.preventDefault()}
					on:keypress={onNumberKeyPress}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={getTokenSuggestions(tokenA)}
					selected={{ name: tokenA.symbol, value: tokenA }}
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
			<label for="">{tokenB.symbol} (Buying Amount)</label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokenB.symbol} amount"
					bind:value={inputTokenB}
					step={0.000001}
					on:keydown={(e) => !loaded && e.preventDefault()}
					on:keypress={onNumberKeyPress}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={getTokenSuggestions(tokenB)}
					selected={{ name: tokenB.symbol, value: tokenB }}
					onSelect={(value) => setSelectedToken(value, 1)}
				/>
			</div>

			<div class="flex flex-col gap-0">
				<div class="br"></div>
			</div>

			<div class="flex justify-center mt-2 pr-0">
				<button
					class="btn btn-primary w-full box-border {tokenA.symbol === tokenB.symbol || disabled
						? 'disabled btn-outline'
						: ''}"
					on:click={disabled ? () => {} : createLimitOrder}
				>
					Create Limit Order
				</button>
			</div>
		</form>
		<div class="br"></div>
		<div class="br"></div>
		<div class="br"></div>
		<span class="flex justify-between">
			<div class="br"></div>
		</span>
	</div>
{/if}

<style>
	.disabled {
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
</style> -->
