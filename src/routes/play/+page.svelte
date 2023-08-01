<script lang="ts">
	import type { PageServerData } from './$types';
	import Game from './game.svelte';
	import { settings } from './stores';

	export let data: PageServerData;
	settings.set(data.settings);
</script>

<svelte:head>
	<title>Game</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col py-8">
	<div class="flex items-center justify-center flex-grow">
		{#if data.settings}
			<Game />
		{:else}
			<p>Invalid game.</p>
		{/if}
	</div>
	<footer class="mb-4 flex flex-col items-center justify-center w-full">
		<p class="mt-4 text-center text-base">
			Made with 💖 by <a class=" underline" href="https://arulandu.com">Alvan Caleb Arulandu</a>
		</p>
		<a class="mt-2 block w-fit" href="https://github.com/Claeb101/wordy">
			<img
				class="h-full"
				src="https://img.shields.io/github/last-commit/claeb101/wordy"
				alt="commit tag"
			/>
		</a>
	</footer>
</div>
