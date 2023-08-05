<script lang="ts">
	import Theme from '../theme.svelte';
import type { PageServerData } from './$types';
	import Game from './game.svelte';
	import { settings } from './stores';

	export let data: PageServerData;
	settings.set(data.settings);
</script>

<div class="relative flex flex-col py-4">
	<Theme/>
	<div class="flex items-center justify-center flex-grow">
		{#if data.settings}
			<Game />
		{:else}
			<p>Invalid game.</p>
		{/if}
	</div>
</div>
