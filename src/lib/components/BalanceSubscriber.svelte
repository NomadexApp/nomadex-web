<script lang="ts" module>
	export const globalBalanceIndex = $state<Record<string, { balance: bigint; timestamp: number }>>({});
	export const globalAccountIndex = $state<Record<string, { info: Record<string, any>; timestamp: number }>>({});
</script>

<script lang="ts">
	import { TokenType } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { onMount, type Snippet } from 'svelte';
	import { writable } from 'svelte/store';
	import { SmartAssetClient } from '$lib/../contracts/clients/SmartAssetClient';
	import algosdk from 'algosdk';

	let {
		balance_result,
		subscriptions = {},
		duration = 30,
	}: {
		balance_result: Snippet<[Record<string, bigint>, () => void]>;
		subscriptions: Record<string, { id: number; type: TokenType }>;
		duration?: number;
	} = $props();

	let result = $state(Object.fromEntries(Object.entries(subscriptions).map(([key, _]) => [key, 0n])));

	const trigger = writable(0);

	onMount(() => {
		const unsubs: NodeJS.Timeout[] = [];
		const unsubsCalls: Function[] = [];

		for (const key in subscriptions) {
			const token = subscriptions[key];
			const addr = key.split(':')[0];
			if (!addr || addr === 'undefined') continue;

			const unsub = setInterval(fetchBalance, duration * 1000);
			fetchBalance();
			unsubsCalls.push(trigger.subscribe(() => fetchBalance(true)));

			async function fetchBalance(force = false) {
				try {
					let info: Record<string, any>;
					let timestamp = Date.now();
					switch (token.type) {
						case TokenType.ALGO: {
							if (
								!globalAccountIndex[key] ||
								Date.now() - globalAccountIndex[key].timestamp > duration * 1000 ||
								force
							) {
								info = await nodeClient.accountInformation(addr).do();
							} else {
								info = globalAccountIndex[key].info;
								timestamp = globalAccountIndex[key].timestamp;
							}
							const state = Object.freeze({
								balance: BigInt(info.amount - info['min-balance']),
								timestamp: timestamp,
							});
							globalAccountIndex[key] = { info, timestamp: state.timestamp };
							globalBalanceIndex[key] = state;
							result[key] = state.balance;
							break;
						}
						case TokenType.ASA: {
							if (
								!globalAccountIndex[key] ||
								Date.now() - globalAccountIndex[key].timestamp > duration * 1000 ||
								force
							) {
								info = await nodeClient.accountInformation(addr).do();
							} else {
								info = globalAccountIndex[key].info;
								timestamp = globalAccountIndex[key].timestamp;
							}

							const asset = info.assets?.find((asset) => asset['asset-id'] === token.id);

							const state = Object.freeze({
								balance: BigInt(asset?.amount ?? 0),
								timestamp: timestamp,
							});
							globalAccountIndex[key] = { info, timestamp: state.timestamp };
							globalBalanceIndex[key] = state;
							result[key] = state.balance;
							break;
						}
						case TokenType.SMART: {
							if (
								globalBalanceIndex[key] &&
								Date.now() - globalBalanceIndex[key].timestamp <= duration * 1000 &&
								!force
							) {
								result[key] = globalBalanceIndex[key].balance;
								return;
							}

							const smartAssetClient = new SmartAssetClient(
								{
									id: token.id,
									resolveBy: 'id',
									sender: {
										addr: 'DYX2V5XF4IKOHE55Z63XAHVBJTMYM723HK5WJZ72BDZ5AFEFKJ5YP4DOQQ',
										signer: algosdk.makeEmptyTransactionSigner(),
									},
								},
								nodeClient
							);
							const resp = await smartAssetClient
								.compose()
								.arc200BalanceOf({ owner: addr })
								.simulate({ allowEmptySignatures: true, allowMoreLogging: true, allowUnnamedResources: true });

							const state = Object.freeze({
								balance: BigInt(resp.returns?.[0] ?? 0),
								timestamp: timestamp,
							});
							globalBalanceIndex[key] = state;
							result[key] = state.balance;
							break;
						}
					}
				} catch (e) {
					console.error((e as Error)?.message);
				}
			}

			unsubs.push(unsub);
		}

		return () => {
			for (const unsub of unsubs) {
				clearInterval(unsub);
			}
			for (const unsub of unsubsCalls) {
				unsub();
			}
		};
	});
</script>

{@render balance_result(result, () => trigger.set(Math.floor(Math.random() * 1000)))}
