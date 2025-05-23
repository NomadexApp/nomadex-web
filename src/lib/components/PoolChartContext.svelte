<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { type SwapTxn } from '$lib/utils/events';
	import CandleChart, { type PriceCandleData } from '$lib/chart/CandleChart.svelte';
	import { browser } from '$app/environment';
	import { knownPools, type Pool, type Token } from '$lib';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { convertDecimals } from '$lib/utils/numbers';
	import { openModal } from './modal/Modal.svelte';
	import { pageContentRefresh } from '../utils';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { Timescale } from '$lib/chart/type';
	import SelectPoolModal from './modal/SelectPoolModal.svelte';

	const { page } = getStores();
	const pool = $knownPools.find((p) => p.id === Number($page.params.poolId)) as Pool;
	if (!pool) {
		throw Error('Pool not found!');
	}

	const [tokenA, tokenB] = pool.assets;

	let {
		price = $bindable(0),
		context = 'analytics',
		allevents,
	}: {
		price?: number;
		context?: string;
		allevents: Snippet<[Token, Token, ((typeof swapEvents)[0] | (typeof depositEvents)[0])[]]>;
	} = $props();

	let swapEvents: {
		sender: string;
		fromAmount: number;
		toAmount: number;
		direction: number;
		poolBals: [bigint, bigint];
		txn: SwapTxn;
	}[] = $state([]);
	let depositEvents: {
		sender: string;
		amts: [bigint, bigint];
		lpt: bigint;
		adding: boolean;
		poolBals: [bigint, bigint];
		txn: SwapTxn;
	}[] = $state([]);
	let pricingDirection: string = $state(`${tokenB.symbol}/${tokenA.symbol}`);
	let timescale = $state(browser ? (Number(localStorage.getItem('timescale')) ?? Timescale['1hr']) : Timescale['1hr']);
	let logarithmic = $state(false);

	$effect(() => {
		if (timescale === 0) {
			timescale = Timescale['1hr'];
		}
		if (browser && typeof timescale === 'number') {
			console.log('SET:', { timescale });
			localStorage.setItem('timescale', `${timescale}`);
		}
	});

	async function loadEvents() {
		const response = await fetch(
			`https://${PUBLIC_NETWORK}-analytics.nomadex.app/pools/${$page.params.poolId}?limit=${window.innerWidth <= 500 ? 500 : 1000}`
		);
		const jsonResponse: {
			id: string;
			in: [string, string, string];
			out: [string, string, string];
			pool: number;
			round: number;
			sender: string;
			timestamp: number;
			tvl: [string, string];
			type: number;
		}[] = await response.json();
		if (!jsonResponse) return console.log('Events response not defined');
		const swapEventsCopy: typeof swapEvents = [];
		const depositEventsCopy: typeof depositEvents = [];
		for (const event of jsonResponse ?? []) {
			if (event.type === 0) {
				swapEventsCopy.push({
					sender: event.sender,
					fromAmount: Number(BigInt(event.in[0]) < BigInt(event.in[1]) ? BigInt(event.in[1]) : BigInt(event.in[0])),
					toAmount: Number(BigInt(event.out[0]) < BigInt(event.out[1]) ? BigInt(event.out[1]) : BigInt(event.out[0])),
					direction: BigInt(event.in[0]) < BigInt(event.in[1]) ? 1 : 0,
					poolBals: [BigInt(event.tvl[0]), BigInt(event.tvl[1])],
					txn: { id: event.id, 'confirmed-round': event.round, 'round-time': event.timestamp } as any,
				});
			} else if (event.type === 1) {
				depositEventsCopy.push({
					adding: true,
					amts: [BigInt(event.in[0]), BigInt(event.in[1])],
					lpt: BigInt(event.out[2]),
					poolBals: [BigInt(event.tvl[0]), BigInt(event.tvl[1])],
					sender: event.sender,
					txn: { id: event.id, 'confirmed-round': event.round, 'round-time': event.timestamp } as any,
				});
			} else if (event.type === 2) {
				depositEventsCopy.push({
					adding: false,
					amts: [BigInt(event.out[0]), BigInt(event.out[1])],
					lpt: BigInt(event.in[2]),
					poolBals: [BigInt(event.tvl[0]), BigInt(event.tvl[1])],
					sender: event.sender,
					txn: { id: event.id, 'confirmed-round': event.round, 'round-time': event.timestamp } as any,
				});
			}
		}

		swapEvents = [...swapEventsCopy].sort((a, b) => a.txn['round-time'] - b.txn['round-time']);
		depositEvents = [...depositEventsCopy].sort((a, b) => a.txn['round-time'] - b.txn['round-time']);

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

	let priceData: PriceCandleData[] = $state([]);

	async function generateDataByTime(priceOf: string, duration = timescale) {
		const _priceData: PriceCandleData[] = [];
		const events = [...swapEvents].filter((e) => (e.direction === 0 ? e.fromAmount : e.toAmount) > 10);
		// console.log('events:', events);

		if (!events.length) return;

		let pricingCurrency = priceOf === `VOI/${tokenB.symbol}` ? 0 : 1;

		const getTime = (event: (typeof events)[0]) => event.txn['round-time'];
		const getPrice = (event: (typeof events)[0]) => {
			let viaPrice =
				Number(convertDecimals(event.poolBals[0], tokenA.decimals, 6)) /
				Number(convertDecimals(event.poolBals[1], tokenB.decimals, 6));

			if (viaPrice) {
				return pricingCurrency === 0 ? 1 / viaPrice : viaPrice;
			} else {
				const voiAmount = event.direction === 0 ? event.fromAmount : event.toAmount;
				const viaAmount = event.direction === 0 ? event.toAmount : event.fromAmount;

				return pricingCurrency === 0
					? viaAmount / tokenB.unit / (voiAmount / tokenA.unit)
					: voiAmount / tokenA.unit / (viaAmount / tokenB.unit);
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
		const fromTime = Math.floor(getStartOfHour(getTime(events[0]) * 1000) / 1000);
		const currentTime = Math.floor(Date.now() / 1000);

		for (let time = fromTime; time < currentTime; time += duration) {
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
				if (close < 0) continue;
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

	let innerWidth = $state(browser ? window.innerWidth : 0);
	let chartWidth = $state(0);

	function convertAmt(amount: number, token: Token) {
		const pool = $knownPools.find((p) => p.assets[0].id === 0 && p.assets[1].id === token.id);
		if (typeof pool === 'undefined') return 0;
		const priceOfToken =
			Number(
				(convertDecimals(BigInt(pool.balances[0]), pool.assets[0].decimals, 6) * BigInt(1e6)) /
					convertDecimals(BigInt(pool.balances[1]), pool.assets[1].decimals, 6)
			) / 1e6;
		return priceOfToken * amount;
	}
</script>

<svelte:window bind:innerWidth />

<section class="flex flex-col items-center gap-2 max-w-[900px] mx-auto">
	<div class="flex w-full gap-2">
		<button
			aria-label="tokens"
			class="currency flex justify-center items-center mt-[0.1rem] p-2 py-0 w-[2.2rem] h-[1.8rem] rounded text-white bg-transparent"
			onclick={() => {
				openModal(SelectPoolModal, {
					pools: [...$knownPools],
					handleSelect(p) {
						if (!p) return;
						goto(`/analytics/${p.id}`);
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
			{#if tokenA.symbol != 'VOI'}
				{@const voiPrice = convertAmt(price, tokenA)}
				{#if voiPrice}
					<span class="text-[1rem] text-gray-400">
						≈ {voiPrice < 0.1 ? Number(voiPrice.toFixed(6)) : voiPrice.toLocaleString('en')}
						VOI
					</span>
				{/if}
			{/if}
		</h1>
	</div>
	<div class="flex flex-wrap gap-4 justify-between items-center w-full max-w-[900px]">
		{#if context !== 'limit'}
			<div class="cursor-pointer flex flex-col">
				<span class="text-2xl">
					Price ≈ {price < 0.1 ? Number(price.toFixed(6)) : price.toLocaleString('en')}
					{pricingDirection.split('/')[1]}
				</span>
				<span></span>
			</div>
			<div>
				<button
					class="btn btn-sm btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white hidden sm:inline-flex rounded-[4px]"
					onclick={() => {
						logarithmic = !logarithmic;
						generateDataByTime(pricingDirection);
					}}>{logarithmic ? 'linear' : 'log'}</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['30m']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					onclick={() => {
						timescale = Timescale['30m'];
						generateDataByTime(pricingDirection);
					}}>30m</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['1hr']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					onclick={() => {
						timescale = Timescale['1hr'];
						generateDataByTime(pricingDirection);
					}}>1hr</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['1d']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					onclick={() => {
						timescale = Timescale['1d'];
						generateDataByTime(pricingDirection);
					}}>1d</button
				>
				<button
					class="btn btn-sm {timescale === Timescale['1w']
						? 'btn-primary'
						: 'btn-ghost border-none bg-[#00000040] hover:bg-[#00000040] hover:opacity-70 text-white'} hidden sm:inline-flex rounded-[4px]"
					onclick={() => {
						timescale = Timescale['1w'];
						generateDataByTime(pricingDirection);
					}}>1w</button
				>
			</div>
		{/if}
	</div>
	{#if context !== 'limit'}
		<div
			class="chart-container min-w-[250px] w-full overflow-hidden bg-[#00000033] rounded-[8px]"
			bind:clientWidth={chartWidth}
			style="min-height: {chartWidth / 2.6}px;"
		>
			<CandleChart
				label={`Price of ${pricingDirection.split('/').join(' in ')}`}
				{logarithmic}
				data={priceData.slice(-50)}
			/>
		</div>
	{/if}

	{@render allevents(
		tokenA,
		tokenB,
		[...swapEvents, ...depositEvents].sort((a, b) => b.txn['confirmed-round'] - a.txn['confirmed-round'])
	)}
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
