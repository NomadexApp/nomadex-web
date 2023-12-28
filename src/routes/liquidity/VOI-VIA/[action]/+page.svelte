<script lang="ts">
	import { type Token, knownTokens } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';
	import { getStores } from '$app/stores';
	import { browser } from '$app/environment';
	import {
		getASABalance,
		getArc200Balance,
		getBalance,
		getBoxName,
		getClient,
		getUnnamedResourcesAccessedFromMethod,
		nodeClient,
		viaAppId,
	} from '$lib/_shared';
	import { currentAppId, currentLptAssetId } from '$lib/_deployed';
	import algosdk from 'algosdk';
	import { connectedAccount, signAndSendTransections } from '$lib/UseWallet.svelte';
	import { ChainInterface } from '$lib/utils';

	const { page } = getStores();

	$: action = $page.params.action;

	const slippage = 0.01;

	let tokens: [Token, Token] = [knownTokens[0], knownTokens[1]];

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

	let inputTokenLpt: number = 0;
	let inputTokenA: number = 0;
	let inputTokenB: number = 0;

	let disabled = true;

	let timeout: NodeJS.Timeout;

	async function getRatio() {
		const app = await nodeClient.getApplicationByID(currentAppId).do();

		const ratio = app.params['global-state'].find((key: { key: string }) => key.key === btoa('r'));
		if (ratio) {
			return ratio.value.uint / 1000;
		}
	}

	async function onInputTokenLpt() {
		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		inputTokenB = 0;
		if (!inputTokenLpt) return;
		await new Promise((r) => (timeout = setTimeout(r, 1000)));
		const appLptBalance = await getASABalance(currentLptAssetId, algosdk.getApplicationAddress(currentAppId));

		const issued = BigInt(10_000_000_000) * BigInt(1e6) - BigInt(appLptBalance);

		const ratio = (BigInt(inputTokenLpt * 1e6) * BigInt(1e6)) / issued;
		const voiBalance = await getBalance(algosdk.getApplicationAddress(currentAppId));
		const viaBalance = await getArc200Balance(viaAppId, algosdk.getApplicationAddress(currentAppId));

		inputTokenA = Number((BigInt(voiBalance) * ratio) / BigInt(1e6)) / 1e6;
		inputTokenB = Number((BigInt(viaBalance) * ratio) / BigInt(1e6)) / 1e6;

		disabled = !inputTokenB;
	}

	async function onInputTokenA() {
		clearTimeout(timeout);
		disabled = true;
		inputTokenB = 0;
		if (!inputTokenA) return;
		await new Promise((r) => (timeout = setTimeout(r, 1000)));
		const voiBalance = await getBalance(algosdk.getApplicationAddress(currentAppId));
		const viaBalance = await getArc200Balance(viaAppId, algosdk.getApplicationAddress(currentAppId));

		const ratio = viaBalance / voiBalance;
		if (ratio) {
			inputTokenB = Math.floor(inputTokenA * 1e6 * ratio) / 1e6;
			disabled = !inputTokenB;
		}
	}

	async function onInputTokenB() {
		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		if (!inputTokenB) return;
		await new Promise((r) => (timeout = setTimeout(r, 1000)));
		const voiBalance = await getBalance(algosdk.getApplicationAddress(currentAppId));
		const viaBalance = await getArc200Balance(viaAppId, algosdk.getApplicationAddress(currentAppId));

		const ratio = voiBalance / viaBalance;

		if (ratio) {
			inputTokenA = Math.floor(inputTokenB * 1e6 * ratio) / 1e6;
			disabled = !inputTokenA;
		}
	}

	async function mint() {
		const suggestedParams = await nodeClient.getTransactionParams().do();
		const client = getClient(currentAppId);
		const voiAmount = Math.floor(inputTokenA * 1e6);
		const viaAmount = Math.floor(inputTokenB * 1e6);

		const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
			from: $connectedAccount,
			to: $connectedAccount,
			amount: 0,
			assetIndex: currentLptAssetId,
			suggestedParams,
		});

		const approveTxns = await ChainInterface.arc200_approve(
			viaAppId,
			$connectedAccount,
			algosdk.getApplicationAddress(currentAppId),
			BigInt(viaAmount)
		);

		const mintArgs = () => ({
			voiPayTxn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				amount: voiAmount,
				from: $connectedAccount,
				to: algosdk.getApplicationAddress(currentAppId),
				suggestedParams: suggestedParams,
			}),
			viaAmount,
			poolAsset: currentLptAssetId,
		});
		const composer = client.compose();

		const opts = await getUnnamedResourcesAccessedFromMethod(client, 'mint', mintArgs());

		const atc = await composer
			.mint(mintArgs(), {
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

		const mintTxns = atc.buildGroup().map(({ txn }) => txn);

		const liquidityAded = await signAndSendTransections(nodeClient, [[optInTxn], approveTxns, mintTxns]);
		console.log({ liquidityAded });
	}

	async function burn() {
		const suggestedParams = await nodeClient.getTransactionParams().do();
		const client = getClient(currentAppId);

		const lptAmount = Math.floor(inputTokenLpt * 1e6);

		const removeLiqArgs = () => ({
			poolXfer: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
				assetIndex: currentLptAssetId,
				amount: lptAmount,
				from: $connectedAccount,
				to: algosdk.getApplicationAddress(currentAppId),
				suggestedParams: suggestedParams,
			}),
			poolAsset: currentLptAssetId,
		});

		const res = await client.burn(
			removeLiqArgs(),
			await getUnnamedResourcesAccessedFromMethod(client, 'burn', removeLiqArgs())
		);

		console.log('Burned:', { res });
	}

	async function changeLiquidity() {
		if (action === 'add') {
			await mint();
			window.location.reload();
		} else if (action === 'remove') {
			await burn();
			window.location.reload();
		}
	}

	async function balanceString() {
		const appAddress = algosdk.getApplicationAddress(currentAppId);
		const voiBalance = await getBalance(appAddress);
		const viaBalance = await getArc200Balance(viaAppId, appAddress);
		return `${voiBalance / 1e6} VOI / ${viaBalance / 1e6} VIA`;
	}
</script>

{#if tokens}
	<div class="w-full h-full flex flex-col items-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
			<h4 class="text-left">
				{action === 'remove' ? 'Remove' : 'Add'} Liquidity {tokens[0].ticker} for {tokens[1].ticker}
			</h4>
			{#if action === 'remove'}
				<div class="flex items-center relative">
					<input
						type="number"
						placeholder="{tokens[0].ticker} amount"
						bind:value={inputTokenLpt}
						step={1 / 1e6}
						on:keyup={onInputTokenLpt}
						class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
					/>
					{#await getASABalance(currentLptAssetId, $connectedAccount) then balance}
						<span
							class="absolute right-0 bottom-full z-10 cursor-pointer"
							on:click={() => {
								inputTokenLpt = balance / 1e6;
								onInputTokenLpt();
							}}
							on:keydown={null}>MAX {(balance / 1e6).toFixed(2)}</span
						>
					{/await}
					<Dropdown
						class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
						options={[{ name: 'LPT', value: 'LPT' }]}
						selected={{ name: 'LPT', value: 'LPT' }}
						onSelect={(value) => setSelectedToken(value, 0)}
					/>
				</div>
			{/if}
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
					on:keyup={onInputTokenA}
					disabled={action === 'remove'}
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				{#if action === 'add'}
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
				{/if}
				{#if action === 'add'}
					<Dropdown
						class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
						options={[{ name: tokens[0].ticker, value: tokens[0] }]}
						selected={{ name: tokens[0].ticker, value: tokens[0] }}
						onSelect={(value) => setSelectedToken(value, 0)}
					/>
				{/if}
			</div>
			<label for=""
				>{tokens[1].ticker}
				{#if tokens[1].type}({tokens[1].type}){/if}</label
			>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokens[1].ticker} amount"
					bind:value={inputTokenB}
					step={1 / 1e6}
					on:keyup={onInputTokenB}
					disabled={action === 'remove'}
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				{#if action === 'add'}
					{#await getArc200Balance(viaAppId, $connectedAccount) then balance}
						<span
							class="absolute right-0 bottom-full z-10 cursor-pointer"
							on:click={() => {
								inputTokenB = balance / 1e6;
								onInputTokenB();
							}}
							on:keydown={null}>MAX {(balance / 1e6).toFixed(2)}</span
						>
					{/await}
				{/if}
				{#if action === 'add'}
					<Dropdown
						class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
						options={[{ name: tokens[1].ticker, value: tokens[1] }]}
						selected={{ name: tokens[1].ticker, value: tokens[1] }}
						onSelect={(value) => setSelectedToken(value, 1)}
					/>
				{/if}
			</div>

			<!-- Min Received = {inputTokenB - inputTokenB * slippage}
			{tokenB.ticker} -->

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
					on:click={changeLiquidity}
				>
					{action === 'remove' ? 'Remove' : 'Add'} Liquidity
				</button>
			</div>
			<div class="flex justify-center mt-2 pr-0">
				<a
					href="/liquidity/VOI-VIA/{action === 'remove' ? 'add' : 'remove'}"
					target="_self"
					class="btn btn-ghost w-full box-border"
				>
					{action === 'remove' ? 'Add' : 'Remove'} Liquidity
				</a>
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
