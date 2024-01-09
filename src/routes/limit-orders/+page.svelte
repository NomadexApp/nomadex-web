<script lang="ts">
	import { onMount } from 'svelte';
	import { contracts, contractsConstants, knownTokens, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import algosdk from 'algosdk';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { LimitOrders001ClientConnector, LimitOrderType } from '$lib/LimitOrderConnector';
	import { pageContentRefresh } from '$lib/utils';

	let limitOrders: {
		orderId: number;
		name: Uint8Array;
		value: Uint8Array;
		maker: string;
		arc200Id: number;
		arc200Token: Token;
		algoAmount: number;
		arc200Amount: bigint;
		isDirectionFromArc200ToAlgo: number;
	}[] = [];

	async function fetchOrders() {
		const { boxes: boxesNames } = await nodeClient.getApplicationBoxes(contracts.orderbookLimitOrderApp).do();

		const boxes = await Promise.all(
			boxesNames.map((box) => nodeClient.getApplicationBoxByName(contracts.orderbookLimitOrderApp, box.name).do())
		);

		limitOrders = boxes
			.map((box) => {
				const [maker, arc200Id, algoAmount, arc200Amount, isDirectionFromArc200ToAlgo] = <
					[string, bigint, bigint, bigint, bigint]
				>algosdk.ABITupleType.from('(address,uint64,uint64,uint256,uint8)').decode(box.value);
				return {
					orderId: Number('0x' + Buffer.from(box.name).toString('hex')),
					name: box.name,
					value: box.value,
					maker,
					arc200Id: Number(arc200Id),
					arc200Token: <Token>knownTokens.find((t) => t.id === Number(arc200Id)),
					algoAmount: Number(algoAmount),
					arc200Amount,
					isDirectionFromArc200ToAlgo: Number(isDirectionFromArc200ToAlgo),
				};
			})
			.filter((b) => b.arc200Token);
	}

	onMount(async () => {
		fetchOrders();
		const timeout = setInterval(() => fetchOrders(), 15_000);
		return () => clearTimeout(timeout);
	});

	let selcetdOrder: number | undefined;
	let amounts: Record<string, number> = {};

	async function sell(amount: number, limitOrder: (typeof limitOrders)[0]) {
		const connector = new LimitOrders001ClientConnector(contracts.orderbookLimitOrderApp);

		if (limitOrder.isDirectionFromArc200ToAlgo) {
			await connector.invoke(
				'fillOrder',
				LimitOrderType.SELL_ARC200_FOR_ALGO,
				limitOrder.orderId,
				limitOrder.maker,
				limitOrder.arc200Id,
				BigInt(amount * 1e6)
			);
		} else {
			const amnt = Math.floor(amount * limitOrder.arc200Token.unit);
			await connector.invoke(
				'fillOrder',
				LimitOrderType.SELL_ALGO_FOR_ARC200,
				limitOrder.orderId,
				limitOrder.maker,
				limitOrder.arc200Id,
				BigInt(amnt)
			);
		}
		pageContentRefresh(0);
	}

	async function cancelLimitOrder(e: MouseEvent, limitOrder: (typeof limitOrders)[0]) {
		e.stopPropagation();
		const connector = new LimitOrders001ClientConnector(contracts.orderbookLimitOrderApp);

		if (limitOrder.maker === $connectedAccount) {
			await connector.invoke('deleteLimitOrder', limitOrder.orderId);
		}
		pageContentRefresh(0);
	}

	const isValid = (amount: number, limitOrder: (typeof limitOrders)[0]) =>
		amount &&
		amount <=
			Number(limitOrder.isDirectionFromArc200ToAlgo ? limitOrder.algoAmount : limitOrder.arc200Amount) /
				Number(limitOrder.isDirectionFromArc200ToAlgo ? BigInt(1e6) : limitOrder.arc200Token.unit);

	function amountAfterFee(amount: number, percentFee: number) {
		return (amount * (100 - percentFee)) / 100;
	}
</script>

<section class="p-4">
	<br />
	<br />
	<div class="flex flex-col justify-center gap-2 pt-6 max-w-[800px] mx-auto">
		<div class="flex justify-center">
			<h4 class="text-xl font-bold prose w-full mb-5">Limit Orders</h4>
			<a href="/limit-orders/create/VOI-VIA" class="btn">Create</a>
		</div>
		{#each limitOrders.sort((a, b) => b.orderId - a.orderId) as limitOrder}
			<div class="w-full flex flex-col pt-6 p-4 bg-base-300 relative">
				<div class="pool rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px]">
					<div
						class="flex justify-between cursor-pointer select-none"
						on:click={() => (selcetdOrder = selcetdOrder === limitOrder.orderId ? undefined : limitOrder.orderId)}
						on:keydown
					>
						<span class="name mb-0">
							#{limitOrder.orderId}
							{limitOrder.maker.slice(0, 3)} is selling
							{#if limitOrder.isDirectionFromArc200ToAlgo}
								{(Number(limitOrder.arc200Amount) / limitOrder.arc200Token.unit).toLocaleString('en')}
								{limitOrder.arc200Token.ticker} for {(Number(limitOrder.algoAmount) / 1e6).toLocaleString('en')} VOI
							{:else}
								{(Number(limitOrder.algoAmount) / 1e6).toLocaleString('en')} VOI for {(
									Number(limitOrder.arc200Amount) / limitOrder.arc200Token.unit
								).toLocaleString('en')}
								{limitOrder.arc200Token.ticker}
							{/if}
						</span>
						{#if limitOrder.maker === $connectedAccount}
							<button class="btn btn-sm btn-ghost" on:click={(e) => cancelLimitOrder(e, limitOrder)}>x</button>
						{/if}
					</div>
					<span class="flex flex-wrap justify-end" />
				</div>
				<div
					class="pool rounded-btn flex flex-col items-center overflow-hidden gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px] transition-all duration-200"
					style="height: {selcetdOrder === Number(limitOrder.orderId) ? '200' : '0'}px;"
				>
					<div class="flex flex-col pt-4 gap-2 w-full max-w-[448px]">
						<label for="">
							Enter {limitOrder.isDirectionFromArc200ToAlgo ? 'VOI' : limitOrder.arc200Token.ticker} amount</label
						>
						<input
							type="number"
							placeholder="Enter {limitOrder.isDirectionFromArc200ToAlgo
								? 'VOI'
								: limitOrder.arc200Token.ticker} amount"
							bind:value={amounts[limitOrder.orderId]}
							step={0.000001}
							required
							class="input input-primary input-bordered w-full focus:outline-none"
						/>
						<div class="flex justify-center mt-2 pr-0">
							<button
								class="btn btn-primary w-full box-border"
								disabled={!isValid(amounts[limitOrder.orderId], limitOrder)}
								class:btn-outline={!isValid(amounts[limitOrder.orderId], limitOrder)}
								on:click={() => sell(amounts[limitOrder.orderId], limitOrder)}
							>
								SELL
							</button>
						</div>

						{#if isValid(amounts[limitOrder.orderId], limitOrder)}
							<div class="text-right">
								You will receive {amountAfterFee(
									Number(
										limitOrder.isDirectionFromArc200ToAlgo
											? (amounts[limitOrder.orderId] *
													(Number(limitOrder.arc200Amount) / limitOrder.arc200Token.unit)) /
													(Number(limitOrder.algoAmount) / 1e6)
											: (amounts[limitOrder.orderId] * (Number(limitOrder.algoAmount) / 1e6)) /
													(Number(limitOrder.arc200Amount) / limitOrder.arc200Token.unit)
									),
									contractsConstants.orderbookLimitOrderAppFeePercent
								).toLocaleString('en')}
								{limitOrder.isDirectionFromArc200ToAlgo ? limitOrder.arc200Token.ticker : 'VOI'}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
