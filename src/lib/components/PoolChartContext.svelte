<script lang="ts">
	import { onMount } from 'svelte';
	import { type SwapTxn } from '$lib/utils/events';
	import CandleChart, { type PriceCandleData } from '$lib/chart/CandleChart.svelte';
	import { browser } from '$app/environment';
	import { knownPools, knownTokens, TokenType, type Pool } from '$lib';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { convertDecimals } from '$lib/utils/numbers';
	import { openModal } from './modal/Modal.svelte';
	import SelectTokenModal from './modal/SelectTokenModal.svelte';
	import { pageContentRefresh } from '../utils';
	import { ABITupleType } from 'algosdk';

	const { page } = getStores();
	const pool = <Pool>$knownPools.find((p) => p.id === Number($page.params.poolId));
	if (!pool) {
		throw Error('Pool not found!');
	}

	const [tokenA, tokenB] = pool.assets;

	export let price = 0;
	export let context = 'analytics';

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
		poolBals: [bigint, bigint];
		txn: SwapTxn;
	}[] = [];
	let depositEvents: {
		sender: string;
		amts: [bigint, bigint];
		lpt: bigint;
		adding: boolean;
		poolBals: [bigint, bigint];
		txn: SwapTxn;
	}[] = [];
	let pricingDirection: string = `${tokenB.symbol}/${tokenA.symbol}`;
	let timescale = browser ? JSON.parse(localStorage.getItem('timescale') ?? JSON.stringify(Timescale['15m'])) : Timescale['15m'];
	let logarithmic = false;

	$: browser && localStorage.setItem('timescale', JSON.stringify(timescale));

	async function loadEvents() {
		const response = await fetch(`https://voitest-analytics.nomadex.app/pools/${$page.params.poolId}`);
		const jsonResponse: { round: number; time: number; appId: number; txid: string; logs: string[] }[] = await response.json();
		if (!jsonResponse) return console.log('Events response not defined');
		const allSwapEvents: [string, [bigint, bigint], [bigint, bigint], [bigint, bigint], string, number, number][] = [];
		const allDepositEvents: [string, bigint | [bigint, bigint], bigint | [bigint, bigint], [bigint, bigint], string, number, number][] = [];
		for (const event of jsonResponse ?? []) {
			for (const log of event.logs ?? []) {
				const buff = Uint8Array.from(Buffer.from(log, 'base64'));
				if (log.startsWith('cEjQ6')) {
					// Swap
					allSwapEvents.push(<any>[
						...(<any>ABITupleType.from(`(address,(uint256,uint256),(uint256,uint256),(uint256,uint256))`).decode(buff.slice(4))),
						event.txid,
						event.round,
						event.time,
					]);
				} else if (log.startsWith('PQE+f')) {
					// Deposit
					allDepositEvents.push(<any>[
						...(<any>ABITupleType.from(`(address,(uint256,uint256),uint256,(uint256,uint256))`).decode(buff.slice(4))),
						event.txid,
						event.round,
						event.time,
					]);
				} else if (log.startsWith('po5lX')) {
					// Withdraw
					allDepositEvents.push(<any>[
						...(<any>ABITupleType.from(`(address,uint256,(uint256,uint256),(uint256,uint256))`).decode(buff.slice(4))),
						event.txid,
						event.round,
						event.time,
					]);
				}
			}
		}

		swapEvents = allSwapEvents.map((event) => ({
			sender: event[0],
			fromAmount: Number(event[1][0] < event[1][1] ? event[1][1] : event[1][0]),
			toAmount: Number(event[2][0] < event[2][1] ? event[2][1] : event[2][0]),
			direction: event[1][0] < event[1][1] ? 1 : 0,
			poolBals: event[3],
			txn: <any>{ id: event[4], 'confirmed-round': event[5], 'round-time': event[6] },
		}));

		depositEvents = allDepositEvents.map((event) => ({
			sender: event[0],
			adding: event[1] instanceof Array,
			lpt: <bigint>(event[1] instanceof Array ? event[2] : event[1]),
			amts: <[bigint, bigint]>(event[1] instanceof Array ? event[1] : event[2]),
			poolBals: event[3],
			txn: <any>{ id: event[4], 'confirmed-round': event[5], 'round-time': event[6] },
		}));

		generateDataByTime(pricingDirection, timescale);
	}

	onMount(() => {
		if (context === 'limit') return;
		loadEvents();
		const interval = setInterval(() => {
			loadEvents();
		}, 30_000);
		return () => clearInterval(interval);
	});

	let priceData: PriceCandleData[] = [];

	async function generateDataByTime(priceOf: string, duration = timescale) {
		const _priceData: PriceCandleData[] = [];
		const events = [...swapEvents].filter((e) => (e.direction === 0 ? e.fromAmount : e.toAmount) > 10);
		console.log('events:', events);

		if (!events.length) return;

		let pricingCurrency = priceOf === `VOI/${tokenB.symbol}` ? 0 : 1;

		const getTime = (event: (typeof events)[0]) => event.txn['round-time'];
		const getPrice = (event: (typeof events)[0]) => {
			let viaPrice = Number(convertDecimals(event.poolBals[0], 6, 6)) / Number(convertDecimals(event.poolBals[1], tokenB.decimals, 6));
			viaPrice = viaPrice < 0.001 && tokenB.symbol === 'VIA' ? 0 : viaPrice;

			if (viaPrice) {
				return pricingCurrency === 0 ? 1 / viaPrice : viaPrice;
			} else {
				const voiAmount = event.direction === 0 ? event.fromAmount : event.toAmount;
				const viaAmount = event.direction === 0 ? event.toAmount : event.fromAmount;

				return pricingCurrency === 0 ? viaAmount / tokenB.unit / (voiAmount / tokenA.unit) : voiAmount / tokenA.unit / (viaAmount / tokenB.unit);
			}
		};

		const getStartOfHour = (ms: number) => {
			let date = new Date(ms);
			while (date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
				date = new Date(--ms);
			}
			return ms;
		};

		let close = -1;

		for (let time = Math.floor(getStartOfHour(getTime(events[0]) * 1000) / 1000) + 0.1; time < Math.floor(Date.now() / 1000); time += duration) {
			const matchingEvents = events.filter((e) => getTime(e) >= time && getTime(e) < time + duration);
			if (matchingEvents.length) {
				for (const event of matchingEvents) {
					event['price'] = getPrice(event);
				}

				const _low = matchingEvents.reduce((l, e) => Math.min(l, getPrice(e)), Number.MAX_SAFE_INTEGER);
				const _high = matchingEvents.reduce((h, e) => Math.max(h, getPrice(e)), 0);
				const _close = getPrice(matchingEvents[matchingEvents.length - 1]);
				const _open = close < 0 ? _close : close;

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

<section class="flex flex-col items-center gap-2 max-w-[900px] mx-auto">
	<div class="flex w-full gap-2">
		<button
			class="currency flex justify-center items-center mt-[0.1rem] p-2 py-0 w-[2.2rem] h-[1.8rem] rounded text-white bg-transparent"
			on:click={() => {
				openModal(SelectTokenModal, {
					tokens: $knownPools.filter((pool) => pool.assets[0].type === TokenType.Default).map((t) => t.assets[1]),
					handleSelect(token) {
						const pool = $knownPools.find((pool) => pool.assets[1].id === token.id);
						if (!pool) return;
						goto(`/analytics/${pool.id}`);
						pageContentRefresh();
					},
				});
			}}
		>
			<svg style="width: 25px;" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" class="">
				<path d="M0.97168 1L6.20532 6L11.439 1" stroke="currentColor" stroke-width="2px" />
			</svg>
		</button>
		<h1 class="text-3xl">
			{tokenB.symbol}
		</h1>
	</div>
	<div class="flex flex-wrap gap-4 justify-between items-center w-full max-w-[900px]">
		{#if context !== 'limit'}
			<div class="cursor-pointer flex flex-col">
				<span class="text-2xl">
					Price ≈ {price < 0.1 ? Number(price.toFixed(10)) : price.toLocaleString('en')}
					{pricingDirection.split('/')[0]}
				</span>
				<span />
			</div>
			<div>
				<button
					class="btn btn-sm btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white hidden sm:inline-flex rounded-[4px]"
					on:click={() => {
						logarithmic = !logarithmic;
						generateDataByTime(pricingDirection);
					}}>{logarithmic ? 'linear' : 'log'}</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['15m']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					on:click={() => {
						timescale = Timescale['15m'];
						generateDataByTime(pricingDirection);
					}}>15m</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['30m']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					on:click={() => {
						timescale = Timescale['30m'];
						generateDataByTime(pricingDirection);
					}}>30m</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['1hr']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					on:click={() => {
						timescale = Timescale['1hr'];
						generateDataByTime(pricingDirection);
					}}>1hr</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['4hr']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					on:click={() => {
						timescale = Timescale['4hr'];
						generateDataByTime(pricingDirection);
					}}>4hr</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['1d']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					on:click={() => {
						timescale = Timescale['1d'];
						generateDataByTime(pricingDirection);
					}}>1d</button
				>
			</div>
		{/if}
	</div>
	{#if context !== 'limit'}
		<div class="chart-container min-w-[250px] w-full overflow-hidden bg-[#00000033] rounded-[8px]" bind:clientWidth={chartWidth} style="min-height: {chartWidth / 2.6}px;">
			<CandleChart label={`Price of ${pricingDirection.split('/').join(' in ')}`} {logarithmic} data={priceData.slice(-80)} />
		</div>
	{/if}

	<slot name="swap-events" {tokenA} {tokenB} {swapEvents} />
	<slot name="liquidity-events" {tokenA} {tokenB} {depositEvents} />
</section>

<style>
	section {
		width: 100%;
	}
	.chart-container {
		backdrop-filter: blur(5px);
		width: 100%;
		display: flex;
		justify-content: center;
		max-height: 500px;
		max-width: 900px;
		padding-right: 0.5rem;
	}

	@media (max-width: 300px) {
		.chart-container {
			display: none;
		}
	}
</style>
