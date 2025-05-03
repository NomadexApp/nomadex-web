export function getWellknownAssetIds() {
	return Object.keys(import.meta.glob('../../static/tokens/*'))
		.map((k) => Number(k.replace(/[^\d]+/g, '')))
		.filter((x) => Number.isSafeInteger(x));
}
