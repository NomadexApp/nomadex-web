<script lang="ts">
	import { connectedAccount, getTransactionSignerAccount, signAndSendTransections } from '$lib/components/UseWallet.svelte';
	import { nodeClient } from '$lib/_shared';
	import algosdk from 'algosdk';
	import { SmartAssetClient } from '../../../../contracts/clients/SmartAssetClient';
	import { goto } from '$app/navigation';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { knownTokens } from '$lib';

	let name = '';
	let symbol = '';
	let decimals = 6;
	let totalSupply = 10_000_000_000;
	let manager = $connectedAccount;
	let reserve = $connectedAccount;
	let clawback = '';
	let freeze = '';
	let assetURL = '';
	let assetMetadataHash = '';

	async function createArc200Token() {
		manager = $connectedAccount;
		const tokenInfo = {
			manager,
			name: name,
			symbol: symbol,
			decimals,
			totalSupply: BigInt(totalSupply) * 10n ** BigInt(decimals),
			reserve: reserve || undefined,
			clawback: clawback || undefined,
			freeze: freeze || undefined,
			assetURL: assetURL || undefined,
			assetMetadataHash: assetMetadataHash || undefined,
		};

		let appId = 0;
		let remove = () => {};

		try {
			const signer = getTransactionSignerAccount();
			const params = await nodeClient.getTransactionParams().do();
			const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
				from: signer.addr,
				assetName: tokenInfo.name,
				unitName: tokenInfo.symbol,
				decimals: tokenInfo.decimals,
				total: tokenInfo.totalSupply,
				manager: tokenInfo.manager,
				reserve: tokenInfo.reserve,
				clawback: tokenInfo.clawback,
				freeze: tokenInfo.freeze,
				assetURL: tokenInfo.assetURL,
				assetMetadataHash: tokenInfo.assetMetadataHash,
				defaultFrozen: false,
				suggestedParams: params,
			});

			remove = addNotification('pending', 'Deploying token contract');

			await nodeClient.sendRawTransaction(await signer.signer([txn], [0])).do();
			console.log('Txn:', txn.txID());
			const resp = await algosdk.waitForConfirmation(nodeClient, txn.txID(), 3);
			appId = resp['asset-index'];

			remove();
			addNotification('success', `Created token ${appId}`, 10000);
			goto(`/tokens/${appId}/asa`);
		} catch (e) {
			console.error((e as Error).message);
			remove();
		}
	}

	$: decimals = Math.max(0, Math.min(18, Math.floor(decimals)));
	$: totalSupply = Math.max(0, Math.min(2 ** 64, Math.floor(totalSupply)));

	$: isValid =
		algosdk.isValidAddress(manager) &&
		name.length >= 1 &&
		name.length < 33 &&
		name.match(/^\w[\s\w_-]*$/) &&
		symbol.length >= 1 &&
		symbol.length < 9 &&
		symbol.match(/^[\w]+$/) &&
		!$knownTokens.find((tok) => tok.symbol.toLowerCase() === symbol.toLowerCase());
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Manager Adress:</div>
			<input
				class="input input-secondary bg-[#00000040]"
				type="text"
				on:keypress|preventDefault
				on:paste|preventDefault
				bind:value={$connectedAccount}
			/>
		</div>
		{#if !algosdk.isValidAddress(manager)}
			<div class="w-full max-w-[610px] flex flex-col justify-center">
				<button class="btn btn-primary btn-sm" on:click={() => (manager = $connectedAccount)}>Set to My Address</button>
			</div>
		{/if}
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Token Name ({name.length}/32):</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={name} />
		</div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Token Symbol ({symbol.length}/8):</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={symbol} />
		</div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Decimals:</div>
			<input
				class="input input-secondary bg-[#00000040]"
				type="number"
				max={18}
				min={0}
				step={1}
				bind:value={decimals}
			/>
		</div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Total Supply</div>
			<input
				class="input input-secondary bg-[#00000040]"
				type="number"
				min={0}
				max={2 ** 64}
				step={1}
				bind:value={totalSupply}
			/>
		</div>
		<div>
			Total Supply: {totalSupply.toLocaleString('en')}{decimals ? '.' : ''}{Array(decimals).fill('0').join('')}
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Manager:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={manager} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Reserve:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={reserve} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Clawback:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={clawback} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Freeze:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={freeze} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>AssetURL:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={assetURL} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>Asset Metadata Hash:</div>
			<input class="input input-secondary bg-[#00000040]" type="text" bind:value={assetMetadataHash} />
		</div>

		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<button
				class="btn {isValid && $connectedAccount ? 'btn-primary' : 'btn-ghost'}"
				on:click={isValid && $connectedAccount ? createArc200Token : () => {}}>Create ASA</button
			>
		</div>
	</div>
</section>

<style>
</style>
