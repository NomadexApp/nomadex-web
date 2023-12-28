<script lang="ts" context="module">
	import { DeflyWalletConnect } from '@blockshake/defly-connect';
	import { get, writable } from 'svelte/store';

	export const deflyWallet = new DeflyWalletConnect({});
	export const connectedAccount = writable<string>();
	export const connectedWallet = writable<'wc' | 'kibisis'>();

	connectedWallet.subscribe((walletType) => {
		if (!browser || !walletType) return;
		localStorage.setItem('defaultWallet', walletType);
	});

	export async function walletDisconnect() {
		await deflyWallet.disconnect();
		connectedAccount.set(<any>undefined);
		connectedWallet.set(<any>undefined);
		localStorage.removeItem('defaultWallet');
	}

	export async function walletConnect(kibisis = false) {
		if (kibisis) {
			if (!window['algorand']?.wallets?.[0]) return;
			const { accounts } = await window['algorand'].enable({
				id: 'kibisis',
				genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
			});
			if (accounts?.[0]?.address) {
				connectedAccount.set(accounts?.[0].address);
				connectedWallet.set('kibisis');
			}
		} else {
			connectedAccount.set((await deflyWallet.connect())[0]);
			connectedWallet.set('wc');
		}
	}

	export async function signTransactions(
		txnGroups: algosdk.Transaction[][],
		kibisis = get(connectedWallet) === 'kibisis'
	) {
		if (kibisis) {
			const signed: Uint8Array[] = [];
			for (const group of txnGroups) {
				const txns: { txn: string }[] = [];
				for (const txn of group) {
					txns.push({ txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64') });
				}
				const { stxns } = await window['algorand'].signTxns({
					txns: txns,
				});
				signed.push(...stxns.map((stxn) => Uint8Array.from(Buffer.from(stxn, 'base64'))));
			}

			return signed;
		} else {
			const signed = await deflyWallet.signTransaction(
				txnGroups.map((group) => {
					return group.map((txn) => ({ txn }));
				})
			);

			return signed;
		}
	}

	export async function signAndSendTransections(
		client: algosdk.Algodv2,
		txnGroups: algosdk.Transaction[][],
		kibisis = get(connectedWallet) === 'kibisis'
	) {
		const signed = await signTransactions(txnGroups, kibisis);

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

	export function getTransactionSignerAccount(kibisis = get(connectedWallet) === 'kibisis') {
		const account = get(connectedAccount);
		if (!account) return;
		const signer: algosdk.TransactionSigner = (txnGroup: algosdk.Transaction[], indexesToSign: number[]) => {
			return signTransactions([txnGroup], kibisis);
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
	import { browser } from '$app/environment';

	onMount(async () => {
		if (!$connectedAccount) {
			const defaultWallet = localStorage.getItem('defaultWallet');
			if (defaultWallet) {
				if (defaultWallet === 'wc') {
					[$connectedAccount] = await deflyWallet.reconnectSession();
					$connectedWallet = 'wc';
				} else if (defaultWallet === 'kibisis') {
					walletConnect(true);
				}
			}
		}
	});

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

{#if $connectedAccount}
	<li>
		<a href={null} tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
				><path
					d="M440-440v-400h80v400h-80Zm40 320q-74 0-139.5-28.5T226-226q-49-49-77.5-114.5T120-480q0-80 33-151t93-123l56 56q-48 40-75 97t-27 121q0 116 82 198t198 82q117 0 198.5-82T760-480q0-64-26.5-121T658-698l56-56q60 52 93 123t33 151q0 74-28.5 139.5t-77 114.5q-48.5 49-114 77.5T480-120Z"
				/></svg
			>
			<span on:click={() => walletDisconnect()} on:keydown>
				Disconnect {$connectedAccount.slice(0, 4)}...{$connectedAccount.slice(-4)}
			</span>
		</a>
	</li>
{:else}
	<li>
		<a href={null} tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
				<path
					d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z"
				/>
			</svg>
			<span on:click={() => walletConnect()} on:keydown={null}>Wallet Connect</span>
		</a>
	</li>
	{#if browser && window['algorand']?.wallets?.[0]}
		<li>
			<a href={null} tabindex="0">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path
						d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z"
					/>
				</svg>
				<span on:click={() => walletConnect(true)} on:keydown={null}>Kibisis Wallet</span>
			</a>
		</li>
	{/if}
{/if}
