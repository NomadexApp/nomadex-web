<script lang="ts">
	import algosdk from 'algosdk';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { nodeClient } from '$lib/_shared';
	import { PoolFactoryClient } from '../../../contracts/clients/PoolFactoryClient';
	import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
	import { contracts } from '$lib';
	import { PUBLIC_NETWORK } from '$env/static/public';

	let appId = contracts[PUBLIC_NETWORK].poolFcatory;
	let feePercent = 1;
	let owner = 'DYX2V5XF4IKOHE55Z63XAHVBJTMYM723HK5WJZ72BDZ5AFEFKJ5YP4DOQQ';
	const SCALE = 100_000_000_000_000;

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
				<div class="br" />
				<div class="w-full max-w-[610px] flex flex-col justify-center">
					<button class="btn btn-primary btn-sm" on:click={deployFactory}>Update Contract</button>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
</style>
