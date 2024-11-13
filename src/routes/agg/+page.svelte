<script lang="ts">
	import { knownPools, knownTokens, type Pool, type Token } from '$lib';
	import { MyPool } from 'nomadex-client';
	import { sha512_256 } from 'js-sha512';
	import Arb from './Arb.svelte';
	import { calculateOutTokens } from '$lib/utils/howMuch';
	import CurrencyNumber from '$lib/components/CurrencyNumber.svelte';
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import { nodeClient } from '$lib/_shared';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';

	const {} = $props();

	let arbs: { pool: Pool; arbWith: Pool[] }[] = $state([]);

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
		for (const pool of $knownPools) {
			if (pool.assets[0].id !== 0) continue;
			const tree = buildPaths({ pool: pool, fromAsset: 0, children: [] }, $knownPools, $knownTokens[0]);
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

	$effect.root(() => buildTrees());

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
		const remove = addNotification('pending', 'building txns');
		try {
			const inAmount = amount;
			const signer = getTransactionSignerAccount();
			const transactions: algosdk.Transaction[] = [];
			for (const node of tree.nodes) {
				const fromIndex = node.fromAsset;
				const toIndex = (node.fromAsset + 1) % 2;
				const out = calculateOutTokens(
					amount,
					BigInt(node.pool.balances[fromIndex]),
					BigInt(node.pool.balances[toIndex]),
					(BigInt(node.pool.swapFee) * 27n) / 10n
				);
				const contract = new MyPool(node.pool.id, PUBLIC_NETWORK as any, nodeClient, signer);
				const txns = await contract.buildSwapTxns(
					node.pool.assets[fromIndex],
					node.pool.assets[toIndex],
					amount,
					out,
					fromIndex === 0,
					false
				);
				transactions.push(...txns);
				amount = out;
			}
			let atc = new algosdk.AtomicTransactionComposer();
			const mpt = algosdk.makeEmptyTransactionSigner();
			for (const txn of transactions) {
				txn.group = undefined;
				atc.addTransaction({ txn, signer: mpt });
			}
			atc = await populateAppCallResources(atc, nodeClient);
			const txns = atc.buildGroup().map((tx) => tx.txn);
			remove?.();
			const resp = await nodeClient
				.sendRawTransaction(
					await signer.signer(
						txns,
						txns.map((_, i) => i)
					)
				)
				.do();
			console.log('Sent:', resp);
		} catch (e) {
			console.error(e);
			remove?.();
		}
	}
	let amountInput = $state(1);
	let amount = $derived(BigInt(Math.floor(amountInput * 1e6)));
</script>

<div class="max-w-[600px] mx-auto">
	<TokenInput bind:value={amountInput} token={$knownTokens[0].symbol} />
	<br />

	{#each processTrees(trees)
		.sort((a, b) => (simulate(amount, b) < simulate(amount, a) ? -1 : 1))
		.filter((a) => simulate(amount, a) > amount) as tree}
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
