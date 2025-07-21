<script lang="ts">
	import algosdk, { AtomicTransactionComposer, makeEmptyTransactionSigner } from 'algosdk';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { nodeClient } from '$lib/_shared';
	import { PoolFactoryClient } from '../../../contracts/clients/PoolFactoryClient';
	import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
	import { contracts, knownTokens } from '$lib';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { onMount } from 'svelte';
	import { convertDecimals } from '$lib/utils/numbers';
	import { MySmartAsset, TokenType } from 'nomadex-client';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';

	let appId = contracts[PUBLIC_NETWORK].poolFcatory;
	let feePercent = 1;
	let owner = '';
	let nextOwner = '';
	const SCALE = 100_000_000_000_000;

	let feeTokenId = 0;
	let feeAmount = 0;
	let feeWithdrawTo = '';

	onMount(async () => {
		if (!appId) {
			owner = $connectedAccount;
			return;
		}
		const client = new PoolFactoryClient(
			{
				resolveBy: 'id',
				id: appId,
			},
			nodeClient
		);
		const state = await client.getGlobalState();
		const pubkey = state.warden?.asByteArray();
		if (!pubkey) return;
		owner = algosdk.encodeAddress(pubkey);
		nextOwner = owner;
		feeWithdrawTo = feeWithdrawTo || owner;
	});

	async function deployFactory() {
		const signer = getTransactionSignerAccount();

		const client = new PoolFactoryClient(
			{
				resolveBy: 'id',
				id: appId,
				sender: signer,
			},
			nodeClient
		);

		if (appId) {
			console.log('updating...');
			await client.update.updateApplication({});
			console.log('updated');
		} else {
			const appCreateResponse = await client.create.createApplication({
				owner: owner,
				fee: Math.floor((feePercent / 100) * SCALE),
			});
			const appId = Number(appCreateResponse.confirmation?.applicationIndex);
			console.log('Created App:', { appId });

			const appAddress = algosdk.getApplicationAddress(appId);
			console.log('App Address:', appAddress);

			const newClient = new PoolFactoryClient(
				{
					resolveBy: 'id',
					id: appId,
					sender: signer,
				},
				nodeClient
			);

			await newClient.appClient.fundAppAccount(new AlgoAmount({ algos: 0.2 }));

			console.log('');
		}
	}

	async function grant() {
		if (!nextOwner) return;
		if (!algosdk.isValidAddress(nextOwner)) return;

		const signer = getTransactionSignerAccount();

		const client = new PoolFactoryClient(
			{
				resolveBy: 'id',
				id: appId,
				sender: signer,
			},
			nodeClient
		);

		const resp = await client.grant({
			manager: nextOwner,
		});
		console.log(resp);
		await new Promise((r) => setTimeout(r, 5000));
		window.location.reload();
	}

	async function withdrawFee() {
		const token = $knownTokens.find((t) => t.id === feeTokenId);
		if (!token) return;
		const amount = convertDecimals(feeAmount * 1e6, 6, token.decimals);
		console.log('Withdraw:', amount);
		const signer = getTransactionSignerAccount();
		const client = new PoolFactoryClient(
			{
				resolveBy: 'id',
				id: appId,
				sender: signer,
			},
			nodeClient
		);

		const id: [number, number] =
			token.type === TokenType.ASA ? [token.id, 0] : token.type === TokenType.SMART ? [0, token.id] : [0, 0];
		console.log(id);
		const resp = await client.withdraw(
			{
				id: id,
				amount,
				to: feeWithdrawTo,
			},
			{ sendParams: { populateAppCallResources: true } }
		);
		console.log(resp);
	}

	async function withdrawAll() {
		const factoryAddress = algosdk.getApplicationAddress(appId);
		const info = await nodeClient.accountInformation(factoryAddress).do();
		const txns: algosdk.Transaction[] = [];
		console.log(info);

		const signer = getTransactionSignerAccount();
		const client = new PoolFactoryClient(
			{
				resolveBy: 'id',
				id: appId,
				sender: signer,
			},
			nodeClient
		);

		for (const token of $knownTokens) {
			if (txns.length >= 16) continue;
			if (token.type === 0) {
				const available = Number(info.amount) - Number(info['min-balance']) - 100_000_000;
				if (available <= 0) continue;
				console.log(token.symbol, available / 10 ** token.decimals);
				const atc = await client
					.compose()
					.withdraw({
						id: [0, 0],
						amount: available,
						to: feeWithdrawTo,
					})
					.atc();
				txns.push(
					...atc.buildGroup().map((t) => {
						t.txn.group = undefined;
						return t.txn;
					})
				);
			} else if (token.type === 1) {
				const asset = info.assets.find((asset) => asset['asset-id'] === token.id);
				if (!asset) continue;
				const available = Number(asset['amount']);
				if (available <= 0) continue;
				console.log(token.symbol, available / 10 ** token.decimals);
				const atc = await client
					.compose()
					.withdraw({
						id: [token.id, 0],
						amount: available,
						to: feeWithdrawTo,
					})
					.atc();
				txns.push(
					...atc.buildGroup().map((t) => {
						t.txn.group = undefined;
						return t.txn;
					})
				);
			} else if (token.type === 2) {
				const asset = MySmartAsset.from(token.id, nodeClient);
				const available = await asset.arc200BalanceOf(factoryAddress);
				if (available <= 0n) continue;
				const amount = convertDecimals(available, token.decimals, 6);
				console.log(token.symbol, Number(amount) / 10 ** 6);
				const atc = await client
					.compose()
					.withdraw({
						id: [0, token.id],
						amount: available,
						to: feeWithdrawTo,
					})
					.atc();
				txns.push(
					...atc.buildGroup().map((t) => {
						t.txn.group = undefined;
						return t.txn;
					})
				);
			}
		}

		let atc = new AtomicTransactionComposer();
		for (const txn of txns.slice(0, 16)) {
			txn.group = undefined;
			atc.addTransaction({ txn, signer: makeEmptyTransactionSigner() });
		}
		atc = await populateAppCallResources(atc, nodeClient);
		const signedTxns = await signer.signer(
			atc.buildGroup().map((t) => t.txn),
			txns.map((_, i) => i)
		);

		const resp = await nodeClient.sendRawTransaction(signedTxns).do();
		await algosdk.waitForConfirmation(nodeClient, resp.txId, 4);
		console.log(resp.txId);
		window.location.reload();
	}
</script>

{#if owner === $connectedAccount}
	<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
		<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>App Id:</div>
				<input class="input bg-gray-200 bg-opacity-5" type="number" bind:value={appId} />
			</div>
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<div>Owner:</div>
				<input class="input bg-gray-200 bg-opacity-5" type="text" bind:value={owner} />
			</div>
			{#if !appId}
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" on:click={deployFactory}>DEPLOY</button>
				</div>
			{:else}
				<div class="br"></div>
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" on:click={deployFactory}>Update Contract</button>
				</div>

				<br />

				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<div>New Owner:</div>
					<input class="input bg-gray-200 bg-opacity-5" type="text" bind:value={nextOwner} />
				</div>
				{#if owner != nextOwner}
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<button class="btn btn-primary btn-sm" on:click={grant}>Grant</button>
					</div>
				{/if}

				<br />

				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<div>Fee Token ID:</div>
					<input class="input bg-gray-200 bg-opacity-5" type="number" bind:value={feeTokenId} />
				</div>
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<div>Fee Token Amount:</div>
					<input class="input bg-gray-200 bg-opacity-5" type="number" bind:value={feeAmount} />
				</div>
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<div>Fee Withdraw To:</div>
					<input class="input bg-gray-200 bg-opacity-5" type="text" bind:value={feeWithdrawTo} />
				</div>
				{#if feeAmount}
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<button class="btn btn-primary btn-sm" on:click={withdrawFee}>Withdraw Fee</button>
					</div>
				{/if}
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" on:click={withdrawAll}>Withdraw All</button>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
</style>
