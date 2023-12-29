<script lang="ts">
	import { type Token, knownTokens } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {
		getArc200Balance,
		getBalance,
		getBoxName,
		getClient,
		getUnnamedResourcesAccessedFromMethod,
		nodeClient,
		viaAppId,
	} from '$lib/_shared';
	import { currentAppId } from '$lib/_deployed';
	import algosdk from 'algosdk';
	import { simulateHowMuch } from '$lib/howMuch';
	import { connectedAccount, signAndSendTransections } from '$lib/UseWallet.svelte';
	import { ChainInterface } from '$lib/utils';
	import { onNumberKeyPress } from '$lib/inputs';

	const { page } = getStores();
	const tokenA = knownTokens.find((token) => token.ticker === $page.params.tokenA);
	const tokenB = knownTokens.find((token) => token.ticker === $page.params.tokenB);
	const slippage = 0.01;

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
			updateRoute(token, tokens[index]);
		}
	}

	function updateRoute(tokenA: Token, tokenB: Token) {
		if (!tokens) return;
		if (tokens[0].ticker !== tokenA.ticker || tokens[1].ticker !== tokenB.ticker) {
			location.href = `/swap/${tokenA.ticker}-${tokenB.ticker}`;
		}
	}

	$: browser && tokens && tokens[0] && tokens[1] && updateRoute(tokens[0], tokens[1]);

	let inputTokenA: number = 0;
	let inputTokenB: number = 0;

	let disabled = true;

	let timeout: NodeJS.Timeout;

	async function onInputTokenA() {
		if (!tokenA || !tokenB) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenB = 0;
		if (!inputTokenA || typeof inputTokenA !== 'number') return;
		let tm: NodeJS.Timeout | undefined;
		await new Promise((r) => {
			timeout = setTimeout(r, 1000);
			tm = timeout;
		});
		const ret = Number(await simulateHowMuch(tokenA, tokenB, BigInt(Math.floor(inputTokenA * 1e6)), false)) / 1e6;
		if (tm && tm === timeout) {
			inputTokenB = ret;
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
			timeout = setTimeout(r, 1000);
			tm = timeout;
		});
		const ret = Number(await simulateHowMuch(tokenA, tokenB, BigInt(Math.floor(inputTokenB * 1e6)), true)) / 1e6;
		if (tm && tm === timeout) {
			inputTokenA = ret;
			disabled = !inputTokenB;
		}
	}

	async function swapVoiToVia(voiAmount: number, minViaAmount: number) {
		const suggestedParams = await nodeClient.getTransactionParams().do();
		const client = getClient(currentAppId);

		let viaAmount = minViaAmount;

		const swapArgs = () => ({
			voiPayTxn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				amount: voiAmount,
				from: $connectedAccount,
				to: algosdk.getApplicationAddress(currentAppId),
				suggestedParams: suggestedParams,
			}),
			minVia: Math.floor(viaAmount - Math.round(viaAmount * slippage)),
		});
		const swapResponse = await client.swapVoiForVia(
			swapArgs(),
			await getUnnamedResourcesAccessedFromMethod(client, 'swapVoiForVia', swapArgs())
		);

		return swapResponse.return;
	}

	async function swapViaToVoi(viaAmount: number, minVoiAmount: number) {
		const client = getClient(currentAppId);

		const approveTxns = await ChainInterface.arc200_approve(
			viaAppId,
			$connectedAccount,
			algosdk.getApplicationAddress(currentAppId),
			BigInt(viaAmount)
		);

		const swapArgs = () => ({
			viaAmount: viaAmount,
			minVoi: Math.floor(minVoiAmount - Math.round(minVoiAmount * slippage)),
		});
		const composer = client.compose();

		const opts = await getUnnamedResourcesAccessedFromMethod(client, 'swapViaForVoi', swapArgs());

		const atc = await composer
			.swapViaForVoi(swapArgs(), {
				...opts,
				boxes: [
					...opts.boxes,
					{
						appId: viaAppId,
						name: getBoxName(algosdk.getApplicationAddress(currentAppId)),
					},
				],
			})
			.atc();

		const swapTxns = atc.buildGroup().map(({ txn }) => txn);

		const swapComplete = await signAndSendTransections(nodeClient, [approveTxns, swapTxns]);
		console.log({ swapComplete });
	}

	async function swap() {
		if (!tokenA || !tokenB) return;
		if (tokenA.ticker === 'VOI' && tokenB.ticker === 'VIA') {
			const resp = await swapVoiToVia(Math.floor(inputTokenA * 1e6), 1);
			console.log({ resp });
			location.reload();
		} else if (tokenA.ticker === 'VIA' && tokenB.ticker === 'VOI') {
			const resp = await swapViaToVoi(Math.floor(inputTokenA * 1e6), 1);
			console.log({ resp });
			location.reload();
		}
	}

	async function balanceString() {
		const appAddress = algosdk.getApplicationAddress(currentAppId);
		const voiBalance = await getBalance(appAddress);
		const viaBalance = await getArc200Balance(viaAppId, appAddress);
		return `${voiBalance / 1e6} VOI / ${viaBalance / 1e6} VIA`;
	}
</script>

{#if tokenA && tokenB && tokens}
	<div class="w-full h-full flex flex-col items-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
			<h4 class="text-left">Swap {tokens[0].ticker} for {tokens[1].ticker}</h4>
			<label for="">
				{tokens[0].ticker}
				{#if tokens[0].type}({tokens[0].type}){/if}
			</label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokens[0].ticker} amount"
					bind:value={inputTokenA}
					step={1 / 1e6}
					on:keypress={onNumberKeyPress}
					on:keyup={onInputTokenA}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				{#await getBalance($connectedAccount) then balance}
					<span
						class="absolute right-0 bottom-full z-10 cursor-pointer"
						on:click={() => {
							inputTokenA = balance / 1e6;
							onInputTokenA();
						}}
						on:keydown={null}>MAX {(balance / 1e6).toFixed(2)}</span
					>
				{/await}
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
					selected={{ name: tokens[0].ticker, value: tokens[0] }}
					onSelect={(value) => setSelectedToken(value, 0)}
				/>
			</div>
			<div
				class="flex justify-center mt-2 px-1 cursor-pointer"
				on:click={() => {
					if (!tokens) return;
					updateRoute(tokens[1], tokens[0]);
				}}
				on:keydown={null}
			>
				&lang;&rang;
			</div>
			<label for=""
				>{tokens[1].ticker}
				{#if tokens[1].type}({tokens[1].type}){/if}</label
			>
			<div class="flex items-center">
				<input
					type="number"
					placeholder="{tokens[1].ticker} amount"
					bind:value={inputTokenB}
					step={1 / 1e6}
					on:keypress={onNumberKeyPress}
					on:keyup={onInputTokenB}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
					selected={{ name: tokens[1].ticker, value: tokens[1] }}
					onSelect={(value) => setSelectedToken(value, 1)}
				/>
			</div>

			Min Received = {inputTokenB - inputTokenB * slippage}
			{tokenB.ticker}

			{#await balanceString() then balance}
				<br />
				Liq. {balance}
			{/await}
			<!-- <br />
			Fee: {0.5}% -->

			<div class="flex justify-center mt-2 pr-0">
				<button
					class="btn btn-primary w-full box-border"
					class:disabled={tokens[0].ticker === tokens[1].ticker || disabled}
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
</style>
