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
	let loading = false;

	async function fetchOrders() {
		try {
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
		} catch (e) {}
	}

	onMount(async () => {
		loading = true;
		fetchOrders().finally(() => {
			loading = false;
		});
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
	<div class="flex flex-col justify-center gap-1 pt-6 max-w-[800px] mx-auto">
		<div class="flex justify-center">
			<h4 class="text-xl font-bold prose w-full mb-5">Limit Orders</h4>
			<a href="/limit-orders/create/VOI-VIA" class="btn">Create</a>
		</div>
		<div class="w-full flex flex-col pt-4 p-4 bg-base-300 relative">
			<div class="pool rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px]">
				<div class="flex justify-between cursor-pointer select-none font-bold" on:click={() => {}} on:keydown>
					<span class="name mb-0 flex justify-start items-center w-full gap-5">
						<span class="w-24">Maker</span>
						<span class="w-16">Type</span>
						<span class="w-24"> Amount </span>
						<span class="hidden md:block flex-grow max-w-16" />

						<span class="w-24">Price</span>
					</span>
					<div class="w-12">&nbsp;</div>
				</div>
			</div>
		</div>
		{#if loading}
			<div class="w-full min-h-44 flex justify-center items-center">
				<span class="loading text-primary" />
			</div>
		{:else}
			{#each limitOrders.sort((a, b) => b.orderId - a.orderId) as limitOrder}
				{@const arc200TokenAmount = Number(limitOrder.arc200Amount) / limitOrder.arc200Token.unit}
				{@const algoTokenAmouunt = Number(limitOrder.algoAmount) / 1e6}
				<div class="w-full flex flex-col pt-4 p-4 bg-base-300 relative">
					<div class="pool rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px]">
						<div
							class="flex justify-between cursor-pointer select-none"
							on:click={() => (selcetdOrder = selcetdOrder === limitOrder.orderId ? undefined : limitOrder.orderId)}
							on:keydown
						>
							<span class="name mb-0 flex justify-start items-center w-full gap-5">
								<a
									href="https://voi.observer/explorer/account/{limitOrder.maker}"
									target="_blank"
									referrerpolicy="no-referrer"
									class="w-24"
									on:click={(e) => e.stopPropagation()}
								>
									{limitOrder.maker.slice(0, 3)}...{limitOrder.maker.slice(-3)}
								</a>
								<span class="w-16">{limitOrder.isDirectionFromArc200ToAlgo ? 'BUY' : 'SELL'}</span>

								<span class="w-24 text-nowrap">
									{algoTokenAmouunt.toLocaleString('en')} VOI
								</span>
								<span class="hidden md:block flex-grow max-w-16" />
								<span class="text-nowrap">
									{(arc200TokenAmount / algoTokenAmouunt).toLocaleString('en')}
									{limitOrder.arc200Token.ticker}
									<span class="text-[0.7rem]">
										<span class="hidden md:inline-block">/ VOI</span>
									</span>
								</span>
							</span>
							<div class="w-12">
								{#if limitOrder.maker === $connectedAccount}
									<button class="btn btn-sm btn-ghost" on:click={(e) => cancelLimitOrder(e, limitOrder)}>x</button>
								{:else}
									&nbsp;
								{/if}
							</div>
						</div>
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
									{#if limitOrder.isDirectionFromArc200ToAlgo}
										SELL
									{:else}
										BUY
									{/if}
								</button>
							</div>

							{#if isValid(amounts[limitOrder.orderId], limitOrder)}
								<div class="text-right">
									You will receive {amountAfterFee(
										Number(
											amounts[limitOrder.orderId] *
												(limitOrder.isDirectionFromArc200ToAlgo
													? arc200TokenAmount / algoTokenAmouunt
													: algoTokenAmouunt / arc200TokenAmount)
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
		{/if}
	</div>
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
