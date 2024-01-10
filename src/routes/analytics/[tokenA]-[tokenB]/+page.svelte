<script lang="ts">
	import { onMount } from 'svelte';
	import algosdk from 'algosdk';
	import { SwapEvents, type SwapTxn } from '$lib/events';
	import CandleChart, { type PriceCandleData } from '$lib/chart/CandleChart.svelte';
	import { browser } from '$app/environment';
	import { pageContentRefresh, timeAgo } from '$lib/utils';
	import { TokenType, knownPools, type Token, knownTokens } from '$lib';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getClient } from '$lib/_shared';

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

	enum Timescale {
		'15m' = 15 * 60,
		'30m' = 30 * 60,
		'1hr' = 60 * 60,
		'4hr' = 4 * 60 * 60,
		'1d' = 24 * 60 * 60,
	}

	let swapEvents: {
		sender: string;
		fromAmount: number;
		toAmount: number;
		direction: number;
		txn: SwapTxn;
	}[] = [];
	let price = 0;
	let pricingDirection: string = `${tokenA.ticker}/${tokenB.ticker}`;
	let timescale = browser
		? JSON.parse(localStorage.getItem('timescale') ?? JSON.stringify(Timescale['15m']))
		: Timescale['15m'];
	let logarithmic = false;

	$: browser && localStorage.setItem('timescale', JSON.stringify(timescale));

	async function loadEvent() {
		const updatedSwapEvents: typeof swapEvents = [];
		const txns = await SwapEvents.loadTxnsByEvent(matchedPool.poolId, `Swap(address,uint64,uint64,uint8)`);
		for (const txn of txns) {
			const events = txn.events[`Swap(address,uint64,uint64,uint8)`];
			if (events instanceof Array) {
				for (const event of events) {
					updatedSwapEvents.push({
						sender: event[0],
						fromAmount: Number(event[1]),
						toAmount: Number(event[2]),
						direction: Number(event[3]),
						txn: txn,
					});
				}
			}
		}
		swapEvents = updatedSwapEvents;
		generateDataByTime(pricingDirection, timescale);
	}

	onMount(() => {
		loadEvent();
		const interval = setInterval(() => loadEvent(), 10_000);
		return () => {
			clearInterval(interval);
		};
	});

	const getFromTokenFromEvent = (event: (typeof swapEvents)[0]) => {
		return event.direction === 0 ? voiToken : arc200Token;
	};

	const getToTokenFromEvent = (event: (typeof swapEvents)[0]) => {
		return event.direction === 0 ? arc200Token : voiToken;
	};

	let priceData: PriceCandleData[] = [];

	async function generateDataByTime(priceOf: string, duration = timescale) {
		const _priceData: PriceCandleData[] = [];
		const events = [...swapEvents].filter((e) => (e.direction === 0 ? e.fromAmount : e.toAmount) > 10);

		if (!events.length) return;

		let pricingCurrency = priceOf === `VOI/${arc200Token.ticker}` ? 0 : 1;

		const getTime = (event: (typeof events)[0]) => event.txn['round-time'];
		const getPrice = (event: (typeof events)[0]) => {
			const voiAmount = event.direction === 0 ? event.fromAmount : event.toAmount;
			const viaAmount = event.direction === 0 ? event.toAmount : event.fromAmount;

			return pricingCurrency === 0
				? viaAmount / arc200Token.unit / (voiAmount / voiToken.unit)
				: voiAmount / voiToken.unit / (viaAmount / arc200Token.unit);
		};

		const getStartOfHour = (ms: number) => {
			let date = new Date(ms);
			while (date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
				date = new Date(--ms);
			}
			return ms;
		};

		let close = 1;

		for (
			let time = Math.floor(getStartOfHour(getTime(events[0]) * 1000) / 1000) + 0.1;
			time < Math.floor(Date.now() / 1000);
			time += duration
		) {
			const matchingEvents = events.filter((e) => getTime(e) >= time && getTime(e) < time + duration);
			if (matchingEvents.length) {
				for (const event of matchingEvents) {
					event['price'] = getPrice(event);
				}

				const _low = matchingEvents.reduce((l, e) => Math.min(l, getPrice(e)), Number.MAX_SAFE_INTEGER);
				const _high = matchingEvents.reduce((h, e) => Math.max(h, getPrice(e)), 0);
				const _open = close;
				const _close = getPrice(matchingEvents[matchingEvents.length - 1]);

				_priceData.push({
					x: time * 1000,
					o: _open,
					c: _close,
					h: _high,
					l: _low,
				});

				close = _close;
				price = _close;
			} else {
				_priceData.push({
					x: time * 1000,
					o: close,
					c: close,
					h: close,
					l: close,
				});
			}
		}

		const checksum1 = _priceData.map((d) => `${d.x}:${d.o}:${d.h}:${d.l}:${d.c}`).join(':');
		const checksum2 = priceData.map((d) => `${d.x}:${d.o}:${d.h}:${d.l}:${d.c}`).join(':');
		if (checksum1 !== checksum2) {
			priceData = _priceData;
		}
	}

	let innerWidth = browser ? window.innerWidth : 0;
	let chartWidth = 0;
</script>

<svelte:window bind:innerWidth />

<section class="p-4 flex flex-col items-center gap-2">
	<br />
	<br />
	<div class="flex flex-wrap gap-4 justify-between w-full max-w-[900px]">
		<div
			class="cursor-pointer text-lg"
			on:click={() => {
				goto(`/analytics/${tokenB.ticker}-${tokenA.ticker}`);
				pageContentRefresh(0);
				generateDataByTime(pricingDirection);
			}}
			on:keydown
		>
			<span class="opacity-90">Current Price</span>
			<br />
			<span class="text-sm">
				<span class="">1</span>
				{pricingDirection.split('/')[0]} ≈
			</span>
			<span class="font-normal prose">
				{price < 0.1 ? Number(price.toFixed(10)) : price.toLocaleString('en')}
				{pricingDirection.split('/')[1]}
			</span>
		</div>
		<div>
			<button
				class="btn btn-sm"
				on:click={() => {
					logarithmic = !logarithmic;
					generateDataByTime(pricingDirection);
				}}>{logarithmic ? 'linear' : 'log'}</button
			>
			<button
				class="btn btn-sm"
				class:btn-primary={timescale === Timescale['15m']}
				on:click={() => {
					timescale = Timescale['15m'];
					generateDataByTime(pricingDirection);
				}}>15m</button
			>
			<button
				class="btn btn-sm"
				class:btn-primary={timescale === Timescale['30m']}
				on:click={() => {
					timescale = Timescale['30m'];
					generateDataByTime(pricingDirection);
				}}>30m</button
			>
			<button
				class="btn btn-sm"
				class:btn-primary={timescale === Timescale['1hr']}
				on:click={() => {
					timescale = Timescale['1hr'];
					generateDataByTime(pricingDirection);
				}}>1hr</button
			>
			<button
				class="btn btn-sm"
				class:btn-primary={timescale === Timescale['4hr']}
				on:click={() => {
					timescale = Timescale['4hr'];
					generateDataByTime(pricingDirection);
				}}>4hr</button
			>
			<button
				class="btn btn-sm"
				class:btn-primary={timescale === Timescale['1d']}
				on:click={() => {
					timescale = Timescale['1d'];
					generateDataByTime(pricingDirection);
				}}>1d</button
			>
		</div>
	</div>
	<div
		class="chart-container min-w-[350px] overflow-hidden"
		bind:clientWidth={chartWidth}
		style="min-height: {chartWidth / 2.6}px;"
	>
		<CandleChart
			label={`Price of ${pricingDirection.split('/').join(' in ')}`}
			{logarithmic}
			data={priceData.slice(-80)}
		/>
	</div>
	<div class="events flex flex-col gap-0 justify-center items-center w-full sm:w-[calc(100vw-400px)]">
		{#if swapEvents?.length}
			<div class="w-full event font-bold p-3 px-0 rounded-btn flex justify-start items-center gap-1 max-w-[800px]">
				<h4 class="text-lg text-left w-full mb-2 max-w-[724px]">Recent Txns</h4>
				<span class="flex-grow" />
			</div>
			<div
				class="w-full event bg-base-300 font-bold p-3 px-6 rounded-btn flex justify-start items-center gap-1 max-w-[800px]"
			>
				<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28"> TxId </span>
				<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28 hidden lg:flex">Time</span>
				<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28 hidden lg:flex">Round</span>
				<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28 hidden lg:flex"> Sender </span>
				<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-20 sm:w-28 text-left">From Amt.</span>
				<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-20 sm:w-28 text-left">To Amt.</span>
			</div>
			{#each [...swapEvents].sort((a, b) => b.txn['confirmed-round'] - a.txn['confirmed-round']) as event}
				{@const fromAmount = Number(event.fromAmount / getFromTokenFromEvent(event).unit)}
				{@const toAmount = Number(event.toAmount / getToTokenFromEvent(event).unit)}
				<div
					class="w-full event bg-base-300 hover:invert-[10%] p-2 px-6 rounded-btn flex justify-start items-center gap-1 max-w-[800px]"
				>
					<a
						class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28"
						href="https://voi.observer/explorer/transaction/{event.txn.id}"
						target="_blank"
						referrerpolicy="no-referrer"
					>
						{event.txn.id.slice(0, 3)}...{event.txn.id.slice(-3)}
					</a>
					<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28 hidden lg:flex"
						>{timeAgo(event.txn['round-time'] * 1000)}</span
					>
					<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28 hidden lg:flex"
						>{event.txn['confirmed-round']}</span
					>
					<a
						class="flex-grow text-[0.8rem] sm:text-[1rem] w-16 sm:w-28 hidden lg:flex"
						href="https://voi.observer/explorer/account/{event.sender}"
						target="_blank"
						referrerpolicy="no-referrer"
					>
						{event.sender.slice(0, 3)}...{event.sender.slice(-3)}
					</a>
					<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-20 sm:w-28 text-justify">
						{fromAmount < 0.001 ? fromAmount : fromAmount.toLocaleString()}
						{event.direction ? arc200Token.ticker : 'VOI'}</span
					>
					<span class="flex-grow text-[0.8rem] sm:text-[1rem] w-20 sm:w-28 text-justify">
						{toAmount < 0.001 ? toAmount : toAmount.toLocaleString()}
						{event.direction ? 'VOI' : arc200Token.ticker}</span
					>
				</div>
			{/each}
		{/if}
	</div>
	<br />
	<br />
	<br />
</section>

<style>
	.chart-container {
		width: 100%;
		display: flex;
		justify-content: center;
		max-height: 500px;
		max-width: calc(100vw - 400px);
	}
	.event * {
		text-wrap: nowrap;
		cursor: default;
	}

	.event a {
		cursor: pointer;
	}
</style>
