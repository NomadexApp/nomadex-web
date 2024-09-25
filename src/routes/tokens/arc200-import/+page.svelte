<script lang="ts">
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { goto } from '$app/navigation';
	import { TokenType, knownTokens, saveArc200TokenToList } from '$lib';
	import { Arc200Interface } from '$lib/utils';

	let appId = 0;

	$: appId = Math.max(0, Math.min(1e10, Math.floor(appId)));

	$: isValid = appId && Number.isInteger(appId);

	async function importArc200Token() {
		let remove = () => {};

		try {
			const symbol = await Arc200Interface.arc200_symbol(appId);
			const decimals = await Arc200Interface.arc200_decimals(appId);
			if (typeof symbol === 'string' && symbol.length && Number.isInteger(Number(decimals))) {
				await saveArc200TokenToList(symbol, appId, Number(decimals));
				$knownTokens = [
					...$knownTokens,
					{
						id: appId,
						type: TokenType.ARC200,
						decimals: Number(decimals),
						symbol: symbol,
						unit: 10 ** Number(decimals),
					},
				];
				goto(`/tokens/arc200-${appId}`);
			} else {
				console.error('Invalid token symbol:', symbol);
			}
		} catch (e) {
			console.error((<Error>e).message);
			remove();
		}
	}
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
		<div class="br" />
		<div class="br" />
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<div>ARC200 Token ID:</div>
			<input
				class="input input-secondary bg-[#00000040]"
				type="number"
				max={1e10}
				min={0}
				step={1}
				bind:value={appId}
			/>
		</div>
		<div class="w-full max-w-[610px] flex flex-col justify-center">
			<button
				class="btn {isValid && $connectedAccount ? 'btn-primary' : 'btn-ghost'}"
				on:click={isValid && $connectedAccount ? importArc200Token : () => {}}>Import Token</button
			>
		</div>
	</div>
</section>

<style>
</style>
