<script lang="ts" module>
	import { get, writable } from 'svelte/store';
	import { NetworkId, WalletManager, WalletId } from '@txnlab/use-wallet';
	import { PUBLIC_NETWORK, PUBLIC_WALLET_CONNECT_PROJECT_ID } from '$env/static/public';

	export const connectedAccount = writable<string>();

	export const metadata = {
		name: 'Nomadex',
		url: 'https://voi.nomadex.app',
		description: 'nomadex | decentalized exchange',
		icons: ['https://voi.nomadex.app/favicon.svg'],
	};

	export const walletManager = new WalletManager({
		wallets: [
			WalletId.KIBISIS,
			{
				id: WalletId.LUTE,
				options: { siteName: metadata.name },
			},
			{
				id: WalletId.WALLETCONNECT,
				options: {
					projectId: PUBLIC_WALLET_CONNECT_PROJECT_ID,
					metadata: metadata,
					themeMode: 'light',
				},
			},
		],
		algod: {
			baseServer: `https://${PUBLIC_NETWORK}-api.nomadex.app`,
			port: '',
			token: '',
		},
		network: NetworkId.MAINNET,
	});

	export async function walletConnect(preferReconnect?: boolean, type?: WalletId): Promise<void> {
		if (typeof type === 'undefined') {
			type = walletManager.activeWallet?.id;
		}

		if (!type) return;

		if (preferReconnect) await walletManager.resumeSessions();
		else await walletManager.getWallet(type)?.connect();

		const account = walletManager.activeAccount;
		if (!account) return;

		connectedAccount.set(account.address);
	}

	export async function walletDisconnect() {
		await walletManager.disconnect();
		connectedAccount.set('');
	}

	export async function signTransactions(txnGroups: algosdk.Transaction[][]) {
		try {
			const signed: Uint8Array[] = [];
			for (const group of txnGroups) {
				const txns: { txn: string }[] = [];
				for (const txn of group) {
					txns.push({ txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64') });
				}

				const resp = await walletManager.signTransactions(
					group.map((txn) => txn.toByte()),
					group.map((_, i) => i)
				);

				if (resp) signed.push(...(resp as Uint8Array[]));
			}

			return signed;
		} catch (error) {
			throw error;
		}
	}

	export async function signAndSendTransections(client: algosdk.Algodv2, txnGroups: algosdk.Transaction[][]) {
		console.log('signing and sending txns...');
		const signed = await signTransactions(txnGroups);

		const groups = txnGroups.map((group) => {
			return group
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
				.filter(Boolean) as Uint8Array[];
		});

		for (const group of groups) {
			const { txId } = await client.sendRawTransaction(group).do();
			try {
				await algosdk.waitForConfirmation(client, txId, 1);
			} catch (error) {
				console.warn((error as Error).message);
			}
		}

		console.log('sent txns...');
		return groups;
	}

	export function getTransactionSignerAccount() {
		const account = get(connectedAccount);
		if (!account) {
			return {
				addr: 'DYX2V5XF4IKOHE55Z63XAHVBJTMYM723HK5WJZ72BDZ5AFEFKJ5YP4DOQQ',
				signer: algosdk.makeEmptyTransactionSigner(),
			};
		}
		const signer: algosdk.TransactionSigner = async (txnGroup: algosdk.Transaction[], indexesToSign: number[]) => {
			const remove = addNotification('pending', 'Waiting for transactions approval in your wallet...');
			try {
				const ret = await signTransactions([txnGroup]);
				remove();
				return ret;
			} finally {
				remove();
			}
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
	import { addNotification } from './Notify.svelte';

	onMount(async () => {
		await walletConnect(true);
	});
</script>
