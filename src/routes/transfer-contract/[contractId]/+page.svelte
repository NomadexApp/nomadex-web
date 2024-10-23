<script lang="ts">
	import { page } from '$app/stores';
	import { nodeClient } from '$lib/_shared';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';
	import algosdk from 'algosdk';
	import { sha512_256 } from 'js-sha512';

	const contractId = Number($page.params.contractId);

	let target = $state<string>('');

	async function transfer() {
		const signature = 'transfer(address)void';
		const hash = sha512_256(signature);
		const selHex = hash.slice(0, 8);
		const selector = Buffer.from(selHex, 'hex').toString('hex');
		console.log(signature, selector);

		let composer = new algosdk.AtomicTransactionComposer();
		composer.addMethodCall({
			appID: contractId,
			method: algosdk.ABIMethod.fromSignature(signature),
            methodArgs: [target],
			sender: $connectedAccount,
			signer: getTransactionSignerAccount().signer,
			suggestedParams: await nodeClient.getTransactionParams().do(),
		});

		composer = await populateAppCallResources(composer, nodeClient);
		const { txIDs } = await composer.execute(nodeClient, 3);
		console.log('TxnId:', txIDs.toString());
	}

	$effect(() => {
		// loadData();
	});
</script>

<form onsubmit={(e) => e.preventDefault()} class="max-w-[500px] w-full mx-auto">
	<TextInput placeholder="Transfer To" bind:value={target} />
	<br />
	<button class="btn btn-sm {target ? 'btn-primary' : 'btn-ghost'} w-full" onclick={transfer}>Transfer</button>
</form>
