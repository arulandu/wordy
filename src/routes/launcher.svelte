<script lang="ts">
	import { goto } from '$app/navigation';
	import { getDay } from '@/lib';

	let boards = 1;
	let guesses = 6;
	let sequential = false;
	let day = getDay();
	let daily = true;

	const play = async () => {
		const res = await (
			await fetch('/api/game', {
				method: 'POST',
				body: JSON.stringify({
					boards,
					guesses,
					sequential,
					day,
					daily
				})
			})
		).json();
		goto('/play?' + new URLSearchParams({ id: res.id }));
	};
</script>

<div class="mx-auto mt-2 w-fit flex flex-col sm:flex-row items-center justify-center border border-primary border-solid p-2 rounded-md bg-accent bg-opacity-5">
	<p>Play {daily ? 'the' : 'a'}</p>
	<select
		class="m-1 block bg-background border-solid border-2 border-primary rounded-md p-1"
		bind:value={daily}
	>
		{#each [true, false] as s}
			<option value={s}>{s ? 'daily' : 'non-daily'}</option>
		{/each}
	</select>
	<select
		class="m-1 block bg-background border-solid border-2 border-primary rounded-md p-1"
		bind:value={sequential}
	>
		{#each [true, false] as s}
			<option value={s}>{s ? 'sequential' : 'non-sequential'}</option>
		{/each}
	</select>
	<p>game with</p>
	<input
		bind:value={boards}
		class="m-1 max-w-[3rem] bg-background border-solid border-2 border-primary rounded-md p-1"
	/>
	<p>{boards > 1 ? 'boards' : 'board'} and</p>
	<input
		bind:value={guesses}
		class="m-1 max-w-[3rem] bg-background border-solid border-2 border-primary rounded-md p-1"
	/>
	<p>{guesses > 1 ? 'guesses' : 'guess'}</p>
	<button on:click={play} class="m-1 rounded-full text-primary font-extrabold whitespace-pre">
		{@html '->'}
	</button>
</div>
