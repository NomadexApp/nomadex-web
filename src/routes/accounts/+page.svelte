<script lang="ts">
	import { indexerClient, viaAppId } from '$lib/_shared';
	import algosdk from 'algosdk';
	import { onMount } from 'svelte';

	let millionars: { address: string; amount: number; viaAmount: number }[] = [];
	let loading = false;

	onMount(async () => {
		try {
			loading = true;
			const holdersResp = await fetch('https://api.nomadex.app/holders');
			const holders = await holdersResp.json();
			millionars = holders;
		} catch (e) {
			console.error(e);
		}
		loading = false;
	});
	const filteredAddresess = [
		'VIAGCPULN6FUTHUNPQZDRQIHBT7IUVT264B3XDXLZNX7OZCJP6MEF7JFQU',
		'SDLCDDT7GAREOI5TJAZGIMXKPYYCPQVY4DXY75GHWHLKU7SZYVXVL5VIDY',
		'6HZGVRXNG6LR7FW5CVCISC4P2VY7HSKCVRFPZXNHMZZUUNL3KX4SHM2VOI',
		'6XW62HD3E564FITISBJNA7KKW3SSJV7WI67XBJOUVPL6LGLWDWB3HO2VOI',
		'GZ44UHLUBOH5YG52H4NUMEDSP7XKTSFEG4PZA2W6MY4QSKPSCCHJH72VOI',
		'JIJ2QKPZU3D3MFQUAVZUWBXJTYMNEMHSD7CO6Z3OCRLZQB2AHYQSEE2VOI',
		'OUJQM64LXOA3HN7HWNU5KEXI3YTUZHXLH5IY3L63KCZRQFUVBBON6I2VOI',
		'P5KTY72V3EK2IFVGRS66ZWRTNTEAI4HKS3F63EFHDE6P7IMC2PIYJN2VOI',
		'T6LZ5ROKXFSA4EUM6YLS3XWKCSY5GFM7GH3BEPTHAKVV5OGQL5L7OO2VOI',
		'XOYL4FQ6JXXA25JG3G5QVBPWG6S5MRQNT24ZUQ3CP5HGCISI2P53YH2VOI',
		'ZGHF6BNEXIFI3VXFWQMACB2TY63QGV4DEJXNFSLEMDY4CUISRR53FQ2VOI',

		'DIT3MNSV4QU7SMB7XBLTYWKOZTI3F5LT45FDSN63VTVBU7KGZDFLOZPRPI',
		'EQBOT7R5PA7KELBQNDL2UWRC6YL3OX7ZEPG7IFVDUWXQEFWQEWA7JQ5DIQ',
		'EQBOTUQ2VY2VT6RCQGYPXOAQUPB65PLRYTACD4AG6BAHU6SLXSS6NRC75A',
		'GOVFU2FZZ2IURHNZZFEKRDHHRKTUHA5FWXRTDMHU4ZV6L46JND43XREYKA',

		'OO2VQ53ELOU2QRKFF6NMTEOOXVHPABSBRN3QVKSTEJOJHTU2DNSHCAOJIY',
		// maybe bot
		'C46D7INVWU4U2CPOE5NVZT6ZB5NWOLU57U6BDTRFGEDWRKHTT7SPG3JTCA',
		'AGW4ZRWDAVSX46ODGH6WCWYGV33QOO6LDRGON4AD3MD4T5TUSK56M256OU',
	];

	const namedWallets = {
		// VIAGCPULN6FUTHUNPQZDRQIHBT7IUVT264B3XDXLZNX7OZCJP6MEF7JFQU: 'Governance Related',
		// BWHDXT6H4EP54IE3ETYXR3YATEXNI7ABWYTX3LQVBGTFQZ3OK4QAQWFLLM: 'Benedict',
		// XQBFLQHVKRCPVGDBVPMW5GKVSTH4B32UCGTAWYPXEBGNPLIFXO5RFSYVOI: 'Wilder',
		// VOIUK3B5KQXVMVMYMLZOELHNABRKV27BP3CZRIK2ZCF7HEFP4F6APX76NM: 'Wilder',
		// DYX2V5XF4IKOHE55Z63XAHVBJTMYM723HK5WJZ72BDZ5AFEFKJ5YP4DOQQ: 'Webdev.Algo 1',
		// '2ZYADP2OQYPS623NMHMRRTJ46IQ5F6UC3GTLLDC4IY3MAUSRSRU3OCF7HA': 'Webdev.Algo 2',
		// C5NZ5SNL5EMOEVKFW3DS3DBG3FNMIYJAJY3U4I5SRCOXHGY33ML3TGHD24: 'Chris',
		// NVZ4JBXBFOVR3R5XSKYGAUNXHEJ5V6TAYYFDGCMMV6RINWSQBJ5WSGEOMA: 'Chris',
		// NGQDBWCPJIG7GEH5VOLMB4SHZMSVJAA5VXYAJV35QCRT5LSRYAIGVTAWRI: 'Chris',
		// SLUOTPZ3QT4AWTV7GDVXPWU6CL2ST6FCCTU3JFTW64LPGG5GJU4GAQBMPM: 'Nomadex Limit Orders',
		// JNWUE4WAJEIL2NH3LLD2TLYGAQH6QZENLLNFZKWM454DANQQC6ZBTTA2HQ: 'Nomadex Pool VOI-VIA',
		// '2RMPWZ6VDF5FKNIWLQQRJFMIXRCOML5NWB2XBLIUOVPQCW56F7VTUQCMAU': 'gov.voi.algo',
		// '7V2WR2NL2POCFGMQBQ5Y375ABLUCMMU6DTMDQK22D4CLR3PBO25D6R55CA': 'Lobo',
		// UD5LOVE643WWV7CFQVMAYW6L5J6OW2ST3TTYYIKGDSRC3AEMFKV2RC667U: 'Boeieruurd',
		// Z4BQF2QNZYLDTOKCMLWRM6MOIZDQRL56QSN6CO7742KM5DYZQQXYUCUKEU: 'Boeieruurd',
		// CASINOMGNY6WUX7XANB5YRLUUGHC73GSAPM5SMCDROWECHZ4OFO6AX6QVY: 'Boeieruurd',
		// GLOSSYXX5RTAPRAKN4VOMO3BWPKDXMRQ4FJO6DNEIF7BZC6W324VDMR5CY: 'Glossy',
		// NORVOI324M6ME7ECXBOXAHWIYKV5EM335OGA7S6KVHBQFXXZ7FYVWIB2T4: 'Glossy',
		// NOOBCIJETEMWKOKEHA6M25KJFHIZDHAKSLWHKQEL7BUJ573E6FY33JDU2A: 'Dragmz.voi.algo',
		// AUSTSGSNXEGTUD3TIO7ORZADRB5BPAMHKMHQXGLWONMSJNZEP42XCHMVOI: 'Aust.voi.algo',
		// MUTS5EI5IYSNNM2QDLNPBJ2NNRSRRMUC4S6OTCXM3JZMHUAJOSJT6YUKRA: 'Mut.Voi.Algo',
		// SS5CMWWAJOXEFNN5O6X675VSHK56ZHFDBOWGRRG3E4RI7V3IHICEYNMONE: 'Rocket.voi.algo',
		// VDEVK22RGTKEE4EVKRTWVBPBPBB3IOFGO25RQCKDZCLZMRBKFBNNECRDLI: 'TacoCoin.Voi.Algo',
		// DTHIRTEENUHXDHS7IZZBUPHXYWNT5TSSAAUX6NKTLJBR5ABOPTHNEA4DCU: 'D13',
		// WEAKNODEZXOBMGNQ56UIBFSGYHJLFPBTGQ7LJJYQFFYCZTDZ4AMRUYYFLU: 'D13',
		// BSVFQL2I7YZWVRQ5THOPTXZXPUYOMYPXUGJUQLVZGQEEPJ27EUZCPEANDI: 'Cody',
		// '2TCUW2NCFV3K6INURZPLB5FEUB4CUBGQPJLC6II7PXEUTB7IKS4YEEBDH4': 'Django',
		// HPLHCJNXJCTIOYABZ2LQA4D2WIJXRNVPLS3FYR5LTAUYZ4MHY2QHYWFPGE: 'EasyTiger',
		// PEACET4BV4AIUMZT2EHXPI5PR6NT6HKPA2FNLOMS2NILIUKRPTYAGVG7IQ: 'EasyTiger',
		// DOCKYAXXGEFWIHV5LMRA6QZ5J4PMWVQ2GWVIIADC7FPM2NAJIZCSCZ4KPU: 'Scotty',
		// VINY6VJDHYYSKTRE54XHOUMS5ISV6A5XHOV3HMMLBNJNHNLIMYFRMLLXOI: 'Aramid VoiAlgo Bridge',
		// '2LA6B6WD3TCVLP7CKG2FK6FOHMJPYAXFJB2RZKXNJZSIAYREZWSRJT376M': 'boganmeister.dragonfi.algo',
		// XM4ZODSANMIBBY6P6QJO65BCRLNTFTLMLI7UTDO7OLS4N2ABB72WJXI3NE: 'dracarys.dragonfi.algo',
	};
	let filter = true;
	let voiValue = 0;
	let voiValues = [1, 2.2];
	let sortBy = 'total';

	$: filtededHolders = (filter ? millionars.filter((mil) => !filteredAddresess.includes(mil.address)) : millionars).map(
		(h) => ({ ...h, amount: h.amount * voiValues[voiValue % voiValues.length] })
	);
</script>

{#if loading}
	<div class="h-full flex justify-center items-center">
		<span class="loading" />
	</div>
{:else}
	<div class="w-full h-full flex flex-col items-center justify-center p-12">
		<div class="flex justify-between w-full max-w-[600px]">
			<button on:click={() => (filter = !filter)}>{filter ? 'Filtered' : 'Unfiltered'}</button>
			<button on:click={() => voiValue++}>1 VOI = {voiValues[voiValue % voiValues.length]} VIA</button>
		</div>
		<br />
		<table>
			<tr class="cursor-pointer">
				<th>Rank</th>
				<th>Address</th>
				<th class="hidden min-[500px]:table-cell" on:click={() => (sortBy = 'amount')}>Voi Balance</th>
				<th class="hidden min-[500px]:table-cell" on:click={() => (sortBy = 'viaAmount')}>Via Balance</th>
				<th on:click={() => (sortBy = 'total')}>Total</th>
			</tr>
			{#each [...filtededHolders]
				.map( (mil) => ({ address: mil.address, amount: mil.amount, viaAmount: mil.viaAmount, total: mil.amount + mil.viaAmount }) )
				.sort((a, b) => b[sortBy] - a[sortBy]) as millionar, index (millionar.address)}
				<tr>
					<td>
						{`${index + 1}`.padStart(2, '0')}
					</td>
					<td>
						<a
							href="https://voi.observer/explorer/account/{millionar.address}"
							referrerpolicy="no-referrer"
							target="_blank"
						>
							{#if namedWallets[millionar.address]}
								{namedWallets[millionar.address]}
							{:else}
								{millionar.address.slice(0, 3)}...{millionar.address.slice(-3)}
							{/if}
						</a>
					</td>
					<td class="hidden min-[500px]:table-cell">{Math.floor(millionar.amount / 1e6).toLocaleString('en')}</td>
					<td class="hidden min-[500px]:table-cell">{Math.floor(millionar.viaAmount / 1e6).toLocaleString('en')}</td>
					<td>{Math.floor(millionar.total / 1e6).toLocaleString('en')}</td>
				</tr>
			{/each}
		</table>
	</div>
{/if}

<style>
	table {
		width: 100%;
		max-width: 600px;
	}
	th {
		text-align: left;
	}
	th,
	td {
		border-bottom: 2px solid #ffffff11;
	}
</style>
