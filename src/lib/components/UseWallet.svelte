<script lang="ts" context="module">
	import { get, writable } from 'svelte/store';
	import { NetworkId, WalletManager, WalletId } from '@txnlab/use-wallet';

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
			baseServer: 'https://voimain-api.nomadex.app',
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

				if (resp) signed.push(...(<Uint8Array[]>resp));
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
	import { PUBLIC_WALLET_CONNECT_PROJECT_ID } from '$env/static/public';

	onMount(async () => {
		await walletConnect(true);
	});
</script>
