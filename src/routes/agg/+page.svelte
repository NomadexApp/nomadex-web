<script lang="ts">
	import { knownPools, knownTokens, loadTokensAndPools, type Pool, type Token } from '$lib';
	import { MyPool } from 'nomadex-client';
	import { sha512_256 } from 'js-sha512';
	import { calculateOutTokens } from '$lib/utils/howMuch';
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import { nodeClient } from '$lib/_shared';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';
	import { pageContentRefresh } from '$lib/utils';

	const {} = $props();

	type ArbNode = {
		pool: Pool;
		fromAsset: number;
		children: ArbNode[];
	};

	// function log(node: ArbNode, pre = '') {
	// 	if (!node) return;
	// 	console.log(`${pre}${node.pool.assets.map((a) => a.symbol).join('/')}`);
	// 	for (const child of node.children) {
	// 		log(child, `${pre}\t`);
	// 	}
	// }

	function buildPaths(node: ArbNode, filteredPools: Pool[], rootAsset: Token) {
		const assets = [node.pool.assets[node.fromAsset], node.pool.assets[(node.fromAsset + 1) % 2]];
		for (const pool of filteredPools) {
			if (pool.id === node.pool.id) continue;
			const fromAssetIndex = pool.assets.findIndex((poolAsset) => poolAsset.id === assets[1].id);
			if (fromAssetIndex < 0) continue;
			const nextNode: ArbNode = { pool: pool, fromAsset: fromAssetIndex, children: [] };
			if (pool.assets[(fromAssetIndex + 1) % 2].id !== rootAsset.id) {
				buildPaths(
					nextNode,
					filteredPools.filter((p) => p.id !== pool.id),
					rootAsset
				);
			}
			node.children.push(nextNode);
		}
		return node;
	}
	let trees: ArbNode[][] = $state([]);

	function buildTrees() {
		const pools = $knownPools.slice(0, 25);
		for (const pool of pools) {
			if (pool.assets[0].id !== 0) continue;
			const tree = buildPaths(
				{ pool: { ...pool, balances: [...pool.balances] }, fromAsset: 0, children: [] },
				pools,
				$knownTokens[0]
			);
			if (tree.children.length) trees.push(...treeToPaths(tree, []));
		}
	}

	function treeToPaths(node: ArbNode, context: ArbNode[]) {
		context = [...context, node];
		const branches: ArbNode[][] = [];
		if (!node.children.length) {
			branches.push(context);
		}
		for (const child of node.children) {
			const branch = [...context];
			for (const childBranch of treeToPaths(child, branch)) {
				if (childBranch.length) branches.push(childBranch);
			}
		}
		return branches;
	}

	function processTrees(trees: ArbNode[][]) {
		const paths: Record<string, { path: string[]; nodes: ArbNode[]; minTvl: number }> = {};
		for (const nodes of trees) {
			const path = nodes.map((node) => node.pool.assets[node.fromAsset].symbol);
			const sig = sha512_256([...path].join('->')).slice(0, 8);
			if (paths[sig]) continue;
			paths[sig] = {
				path,
				nodes,
				minTvl: nodes.reduce((tvl, node) => Math.min(tvl, node.pool.tvl), Number.MAX_SAFE_INTEGER),
			};
		}
		return Object.entries(paths).map(([id, v]) => ({ id, ...v }));
	}

	let amountInput = $state(1);
	let amount = $derived(BigInt(Math.floor(amountInput * 1e6)));

	$effect.root(() => {
		const unsub = knownPools.subscribe(() => {
			buildTrees();
			amountInput = 1;
		});
		const interval = setInterval(() => loadTokensAndPools, 10000);
		return () => {
			unsub();
			clearInterval(interval);
			console.log('unsub');
		};
	});

	function simulate(amount: bigint, tree: ReturnType<typeof processTrees>[0]) {
		for (const node of tree.nodes) {
			const fromIndex = node.fromAsset;
			const toIndex = (node.fromAsset + 1) % 2;
			const out = calculateOutTokens(
				amount,
				BigInt(node.pool.balances[fromIndex]),
				BigInt(node.pool.balances[toIndex]),
				(BigInt(node.pool.swapFee) * 27n) / 10n
			);
			amount = out;
		}
		return amount;
	}

	async function build(amount: bigint, tree: ReturnType<typeof processTrees>[0]) {
		const remove = addNotification('pending', 'txns pending...');
		try {
			const signer = getTransactionSignerAccount();
			const transactions: algosdk.Transaction[] = [];
			const info = await nodeClient.accountInformation($connectedAccount).do();
			const available = Math.min(Number(amount), info.amount - info['min-balance'] - 10_000_000);
			let remainingAmount = Number(amount);
			while (remainingAmount > 0) {
				const useAmount = Math.min(remainingAmount, available);
				remainingAmount = remainingAmount - useAmount;
				amount = BigInt(useAmount);
				console.log(`Invest: ${(useAmount / 1e6).toLocaleString()} Voi`);
				let batchLength = 0;
				for (const node of tree.nodes) {
					const fromIndex = node.fromAsset;
					const toIndex = (node.fromAsset + 1) % 2;
					const out = calculateOutTokens(
						amount,
						BigInt(node.pool.balances[fromIndex]),
						BigInt(node.pool.balances[toIndex]),
						(BigInt(node.pool.swapFee) * 27n) / 10n
					);
					node.pool.balances[fromIndex] = (BigInt(node.pool.balances[fromIndex]) + amount).toString();
					node.pool.balances[toIndex] = (BigInt(node.pool.balances[toIndex]) - out).toString();
					const contract = new MyPool(node.pool.id, PUBLIC_NETWORK as any, nodeClient, signer);
					const txns = await contract.buildSwapTxns(
						node.pool.assets[fromIndex],
						node.pool.assets[toIndex],
						amount,
						out,
						fromIndex === 0,
						false
					);
					batchLength += txns.length;
					transactions.push(...txns);
					amount = out;
				}
				console.log(`Outcome: ${(Number(amount) / 1e6).toLocaleString()} Voi`);
				if (transactions.length + batchLength > 16) break;
			}
			console.log('Transactions:', transactions.length);
			let atc = new algosdk.AtomicTransactionComposer();
			const mpt = algosdk.makeEmptyTransactionSigner();
			for (const txn of transactions) {
				txn.group = undefined;
				atc.addTransaction({ txn, signer: mpt });
			}
			atc = await populateAppCallResources(atc, nodeClient);
			const txns = atc.buildGroup().map((tx) => tx.txn);
			const resp = await nodeClient
				.sendRawTransaction(
					await signer.signer(
						txns,
						txns.map((_, i) => i)
					)
				)
				.do();
			console.log('Sent:', resp);
			await new Promise((r) => setTimeout(r, 9_000));
			await loadTokensAndPools();
			remove?.();
			// pageContentRefresh();
		} catch (e) {
			console.error(e);
			remove?.();
		}
	}

	function getPoints(amtInput: number, trees: ArbNode[][]) {
		const amount = BigInt(Math.floor(amtInput * 1e6));
		return processTrees(trees)
			.filter((a) => simulate(amount, a) > amount)
			.filter((a) => a.path.length > 2)
			.sort((a, b) => (simulate(amount, b) < simulate(amount, a) ? -1 : 1));
	}

	let points = $derived(getPoints(amountInput, trees));

	function calc(trees: ArbNode[][]) {
		let maxProfit = 0n;
		let maxProfitableAmount = 0;
		for (let i = 1; i <= 5000; i += 100) {
			const points = getPoints(i, trees);
			if (!points.length) break;
			const amt = BigInt(Math.floor(i * 1e6));
			const out = simulate(amt, points[0]);
			if (out > amt) {
				const profit = out - amt;
				if (profit > maxProfit) {
					maxProfit = profit;
					maxProfitableAmount = i;
				}
			}
			if (i === 1) {
				i -= 1;
			}
		}
		amountInput = maxProfitableAmount;
	}

	$effect(() => {
		if (amountInput === 1) {
			calc(trees);
		}
	});
</script>

<div class="max-w-[600px] mx-auto">
	<TokenInput bind:value={amountInput} token={$knownTokens[0].symbol} />
	<br />

	{#each points as tree}
		{@const outAmount = simulate(amount, tree)}
		<div class="tree">
			<div class="flex justify-between">
				{tree.path.join(' ==> ')} ==> VOI
			</div>
			<div>
				<div class="text-gray-300">
					MIN_TVL: {(tree.minTvl / 1e6).toLocaleString()} VOI
				</div>
				<div class="text-gray-300">
					OUT: {(Number(outAmount) / 1e6).toLocaleString()} VOI
				</div>
				<div class="flex justify-end">
					<button class="btn btn-ghost" onclick={() => build(amount, tree)}>Submit</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.tree {
		padding: 1rem 1rem;
		background: #00000020;
		margin-bottom: 0.25rem;
		display: flex;
		flex-direction: column;
	}
</style>
