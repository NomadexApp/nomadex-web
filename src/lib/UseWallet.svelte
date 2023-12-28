<script lang="ts" context="module">
	import { DeflyWalletConnect } from '@blockshake/defly-connect';

	export const deflyWallet = new DeflyWalletConnect({});
	export const connectedAccount = writable<string>();

	export async function walletConnect() {
		connectedAccount.set((await deflyWallet.connect())[0]);
	}

	export async function signTransactions(txnGroups: algosdk.Transaction[][]) {
		const signed = await deflyWallet.signTransaction(
			txnGroups.map((group) => {
				return group.map((txn) => ({ txn }));
			})
		);

		return signed;
	}

	export async function signAndSendTransections(client: algosdk.Algodv2, txnGroups: algosdk.Transaction[][]) {
		const signed = await signTransactions(txnGroups);

		const groups = txnGroups.map((group) => {
			return <Uint8Array[]>group
				.map((txn) => {
					const txId = txn.txID();
					const matchedTxn = signed.find((signedTxn) => {
						if (!signedTxn) return;
						try {
							return algosdk.decodeSignedTransaction(signedTxn).txn.txID() === txId;
						} catch (err) {}
					});
					return matchedTxn;
				})
				.filter(Boolean);
		});

		for (const group of groups) {
			const { txId } = await client.sendRawTransaction(group).do();
			try {
				await algosdk.waitForConfirmation(client, txId, 1);
			} catch (error) {
				console.warn((<Error>error).message);
			}
		}

		return true;
	}

	export function getTransactionSignerAccount() {
		const account = get(connectedAccount);
		if (!account) return;
		const signer: algosdk.TransactionSigner = (txnGroup: algosdk.Transaction[], indexesToSign: number[]) => {
			return signTransactions([txnGroup]);
		};
		return {
			addr: account as Readonly<string>,
			signer,
		};
	}
</script>

<script lang="ts">
	import algosdk from 'algosdk';
	import { onMount } from 'svelte';
	import { nodeClient } from './_shared';
	import { get, writable } from 'svelte/store';

	onMount(async () => {
		[$connectedAccount] = await deflyWallet.reconnectSession();
	});

	async function walletDisconnect() {
		await deflyWallet.disconnect();
		$connectedAccount = '';
	}

	async function test() {
		const suggestedParams = await nodeClient.getTransactionParams().do();
		const success = await signAndSendTransections(nodeClient, [
			[
				algosdk.makePaymentTxnWithSuggestedParamsFromObject({
					from: $connectedAccount,
					to: $connectedAccount,
					amount: 0,
					suggestedParams,
				}),
			],
		]);

		console.log({ success });
		console.log('confirmed');
	}
</script>

<a href={null} tabindex="0">
	{#if $connectedAccount}
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
			><path
				d="M440-440v-400h80v400h-80Zm40 320q-74 0-139.5-28.5T226-226q-49-49-77.5-114.5T120-480q0-80 33-151t93-123l56 56q-48 40-75 97t-27 121q0 116 82 198t198 82q117 0 198.5-82T760-480q0-64-26.5-121T658-698l56-56q60 52 93 123t33 151q0 74-28.5 139.5t-77 114.5q-48.5 49-114 77.5T480-120Z"
			/></svg
		>
		<span on:click={() => walletDisconnect()} on:keydown>
			Disconnect {$connectedAccount.slice(0, 4)}...{$connectedAccount.slice(-4)}
		</span>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
			<path
				d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z"
			/>
		</svg>
		<span on:click={walletConnect} on:keydown={null}>Wallet Connect</span>
	{/if}
</a>
