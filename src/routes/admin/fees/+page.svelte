<script lang="ts">
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { contracts, knownTokens } from '$lib';
	import { indexerClient } from '$lib/_shared';
	import algosdk from 'algosdk';

	let round = $state(0);
	let pending = $state(false);
	let feesTotalRoot: Record<string, bigint> = $state({});
	let feesCollectedRoot: Record<string, bigint> = $state({});

	async function load() {
		const factoryId = contracts[PUBLIC_NETWORK].poolFcatory;
		const factoryAddress = algosdk.getApplicationAddress(factoryId);
		console.log('load', factoryAddress);
		const feesTotal: Record<string, bigint> = {};
		const feesRoot: Record<string, bigint> = {};
		let next = '';
		do {
			const request = indexerClient.searchForTransactions().address(factoryAddress).limit(1000);
			if (next) {
				request.nextToken(next);
			}
			const response = await request.do();
			next = response['next-token'];
			// In
			pending = true;
			for (const rootTxn of response.transactions) {
				round = rootTxn['confirmed-round'];
				for (const innerTxn of rootTxn['inner-txns'] ?? []) {
					const sender = innerTxn['sender'];
					const payTransfer = innerTxn['payment-transaction'];
					const assetTransfer = innerTxn['asset-transfer-transaction'];
					const appTxn = innerTxn['application-transaction'];
					if (payTransfer) {
						const receiver = payTransfer['receiver'];
						const amount = payTransfer['amount'];
						if (receiver === factoryAddress) {
							feesTotal[0] = (feesTotal[0] ?? 0n) + BigInt(amount);
						} else if (sender === factoryAddress) {
							feesRoot[0] = (feesRoot[0] ?? 0n) + BigInt(amount);
						}
					} else if (assetTransfer) {
						const receiver = assetTransfer['receiver'];
						const amount = assetTransfer['amount'];
						const assetId = Number(assetTransfer['asset-id']);
						if (receiver === factoryAddress) {
							feesTotal[assetId] = (feesTotal[assetId] ?? 0n) + BigInt(amount);
						} else if (sender === factoryAddress) {
							feesRoot[assetId] = (feesRoot[assetId] ?? 0n) + BigInt(amount);
						}
					} else if (appTxn) {
						const arc200Transfer = 'da7025b9';
						const args = appTxn['application-args']?.map((str) => Buffer.from(str, 'base64').toString('hex'));
						if (args[0] === arc200Transfer) {
							const pk = Uint8Array.from(Buffer.from(args[1], 'hex'));
							const receiver = algosdk.encodeAddress(pk);
							const amount = BigInt(`0x${args[2]}`);
							const appId = Number(appTxn['application-id']);
							if (receiver === factoryAddress) {
								feesTotal[appId] = (feesTotal[appId] ?? 0n) + BigInt(amount);
							} else if (sender === factoryAddress) {
								feesRoot[appId] = (feesRoot[appId] ?? 0n) + BigInt(amount);
							}
						}
					}
				}
				feesTotalRoot = feesTotal;
				feesCollectedRoot = feesRoot;
			}
		} while (next);
		pending = false;
	}

	$effect.root(() => {
		load();
	});
</script>

<div style="text-align: center;">
	Round: {round}
	Pending: {pending ? 'Yes' : 'No'}
</div>

<div class="sects">
	<div class="sect">
		{#each Object.entries(feesTotalRoot) as fee}
			{@const token = $knownTokens.find((token) => BigInt(token.id) === BigInt(fee[0]))}
			<div class="asset">
				<div>{(Number(fee[1]) / 10 ** (token?.decimals ?? 0)).toFixed(8)} {token?.symbol || fee[0]}</div>
			</div>
		{/each}
	</div>

	<div class="sect">
		{#each Object.entries(feesCollectedRoot) as fee}
			{@const token = $knownTokens.find((token) => BigInt(token.id) === BigInt(fee[0]))}
			<div class="asset">
				<div>{(Number(fee[1]) / 10 ** (token?.decimals ?? 0)).toFixed(8)} {token?.symbol || fee[0]}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.asset {
		display: flex;
		background-color: #ffffff20;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 0.1rem;
		padding: 1rem;
		gap: 2rem;
		max-width: 400px;
		width: 100%;
	}
	.sects {
		display: flex;
		gap: 1rem;
		margin-left: auto;
		margin-right: auto;
	}
</style>
