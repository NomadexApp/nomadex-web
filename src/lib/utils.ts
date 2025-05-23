import { goto } from '$app/navigation';
import { writable } from 'svelte/store';

export async function hardGoto(target: string) {
	goto(`/loading?from=${location.pathname}&at=${Date.now()}`, { replaceState: true });
	await new Promise((r) => setTimeout(r, 5));
	goto(target);
}

export const pageContentRefreshPending = writable(false);
export async function pageContentRefresh(ms = 1000) {
	pageContentRefreshPending.set(true);
	await new Promise((r) => setTimeout(r, ms));
	pageContentRefreshPending.set(false);
}

export function fillMissingSeconds(data: { time: number; value: number }[]): { time: number; value: number }[] {
	const filledData: { time: number; value: number }[] = [];

	for (let i = 0; i < data.length; i++) {
		filledData.push(data[i]);

		// Check if there is a missing hour
		if (i < data.length - 1 && data[i + 1].time - data[i].time > 1) {
			const missingHours = data[i + 1].time - data[i].time - 1;

			// Fill missing hours with the previous hour's value
			for (let j = 1; j <= missingHours; j++) {
				filledData.push({
					time: data[i].time + j,
					value: data[i].value,
				});
			}
		}
	}
	return filledData;
}

export function timeAgo(timestamp: number): string {
	const now = Date.now();
	const seconds = Math.floor((now - timestamp) / 1000);

	if (seconds < 60) {
		return `${seconds}sec${seconds !== 1 ? 's' : ''} ago`;
	} else if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}min${minutes !== 1 ? 's' : ''} ago`;
	} else if (seconds < 86400) {
		const hours = Math.floor(seconds / 3600);
		return `${hours}hr${hours !== 1 ? 's' : ''} ago`;
	} else if (seconds < 2592000) {
		const days = Math.floor(seconds / 86400);
		return `${days}d${days !== 1 ? 's' : ''} ago`;
	} else if (seconds < 31536000) {
		const months = Math.floor(seconds / 2592000);
		return `${months}mon${months !== 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(seconds / 31536000);
		return `${years}yr${years !== 1 ? 's' : ''} ago`;
	}
}