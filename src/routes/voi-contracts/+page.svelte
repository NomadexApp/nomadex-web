<script lang="ts">
	import { page } from '$app/stores';
	import { nodeClient } from '$lib/_shared';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { getAccountBalance } from '$lib/stores/onchain';
	import { pageContentRefresh } from '$lib/utils';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';
	import algosdk from 'algosdk';
	import { sha512_256 } from 'js-sha512';

	let target = $state<string>('');

	type Contract = {
		contractAddress: string;
		contractId: number;
		createRound: number;
		creator: string;
		deleted: 0 | 1;
		global_deadline: number;
		global_delegate: string;
		global_deployer: string;
		global_distribution_count: number;
		global_distribution_seconds: number;
		global_funder: string;
		global_funding: null;
		global_initial: string;
		global_lockup_delay: number;
		global_messenger_id: number;
		global_owner: string;
		global_parent_id: number;
		global_period: number;
		global_period_limit: number;
		global_period_seconds: number;
		global_total: string;
		global_vesting_delay: number;
		lastSyncRound: number;
		part_sel_k: string | null;
		part_sp_key: string | null;
		part_vote_fst: string | null;
		part_vote_k: string | null;
		part_vote_kd: string | null;
		part_vote_lst: string | null;
	};

	let contracts: Contract[] = $state([]);
	let selectedContract: number = $state(0);

	async function loadContracts() {
		if (!$connectedAccount) return;
		const response = await fetch(
			`https://mainnet-idx.nautilus.sh/v1/scs/accounts?owner=${$connectedAccount}&deleted=0`
		);
		const jsonResponse = await response.json();
		contracts = jsonResponse.accounts;
	}

	$effect(() => {
		loadContracts();
	});

	async function transfer(id: number) {
		const signature = 'transfer(address)void';
		const hash = sha512_256(signature);
		const selHex = hash.slice(0, 8);
		const selector = Buffer.from(selHex, 'hex').toString('hex');
		console.log(signature, selector);

		let composer = new algosdk.AtomicTransactionComposer();
		composer.addMethodCall({
			appID: id,
			method: algosdk.ABIMethod.fromSignature(signature),
			methodArgs: [target],
			sender: $connectedAccount,
			signer: getTransactionSignerAccount().signer,
			suggestedParams: await nodeClient.getTransactionParams().do(),
		});

		composer = await populateAppCallResources(composer, nodeClient);
		const { txIDs } = await composer.execute(nodeClient, 3);
		console.log('TxnId:', txIDs.toString());
		if (txIDs) {
			await pageContentRefresh(10_000);
		}
	}

	$effect(() => {
		// loadData();
	});
</script>

<form onsubmit={(e) => e.preventDefault()} class="max-w-[500px] w-full mx-auto">
	{#each contracts ?? [] as contract}
		<button
			class="p-4 bg-[#22222244] mb-2 rounded-lg w-full text-left text-gray-300"
			onclick={() => (selectedContract = selectedContract === contract.contractId ? 0 : contract.contractId)}
		>
			<div class="id">
				ID: {contract.contractId}
			</div>
			<div>
				Balance:
				{#await getAccountBalance(contract.contractAddress)}
					0
				{:then b}
					{(Number(b) / 1e6).toLocaleString()}
				{/await}
				Voi
			</div>
			{#if true}
				<div>
					Owner: <a
						href="https://explorer.voi.network/explorer/account/{contract.global_owner}/transactions"
						target="_blank"
					>
						{contract.global_owner.slice(0, 4)}...{contract.global_owner.slice(-4)}
					</a>
				</div>
			{/if}
		</button>
		{#if selectedContract === contract.contractId}
			<div class="mb-6">
				<TextInput placeholder="Transfer To" bind:value={target} />
				<button class="mt-2 btn btn-md btn-ghost bg-[#22222244] backdrop-blur-md w-full" onclick={() => transfer(contract.contractId)}
					>Transfer</button
				>
			</div>
		{/if}
	{/each}
</form>
