<script lang="ts">
	import { goto } from '$app/navigation';
	import { getDay, getNextDayDate } from '@/lib';
	import { time } from './stores';

	let boards = 1,
		guesses = 6,
		sequential = false,
		day = getDay(),
		daily = true;
	$: timeToDaily = getNextDayDate().valueOf() - $time.valueOf();
	$: hoursToDaily = Math.floor((timeToDaily / (1000 * 60 * 60)) % 24);
	$: minsToDaily = Math.floor(timeToDaily / (1000 * 60) / 60);
	$: secondsToDaily = Math.floor((timeToDaily / 1000) % 60);
	const format = (x: number) => {
		return x < 10 ? '0' + x : x;
	};

	const presets = [
		{ name: 'wordle', boards: 1, guesses: 6 },
		{ name: 'quordle', boards: 4, guesses: 9 },
		{ name: 'octordle', boards: 8, guesses: 13 },
		{ name: 'sedecordle', boards: 16, guesses: 21 }
	];
	let presetInd = 0;
	const applyPreset = (i: number) => {
		boards = presets[i].boards ?? boards;
		guesses = presets[i].guesses ?? guesses;
	};
	$: {
		applyPreset(presetInd);
	}

	const play = async () => {
		const res = await (
			await fetch('/api/game', {
				method: 'POST',
				body: JSON.stringify({ boards, guesses, sequential, day, daily })
			})
		).json();
		goto('/play?' + new URLSearchParams({ id: res.id }));
	};
</script>

<div class="mb-2 text-xl flex flex-wrap items-center justify-center">
	<p>Ever wanted to play</p>
	<select
		class="mx-2 block bg-background border-solid border-2 border-primary rounded-md p-1"
		bind:value={presetInd}
	>
		{#each presets as p, i}
			<option value={i}>{p.name}</option>
		{/each}
	</select>
	<p>but a bit different? Join the club.</p>
</div>
<div
	class="mx-auto mt-2 w-fit flex flex-col sm:flex-row items-center justify-center border border-primary border-solid p-2 rounded-md bg-accent bg-opacity-5"
>
	<p>Play {daily ? 'the' : 'a'}</p>
	<select
		class="m-1 block bg-background border-solid border-2 border-primary rounded-md p-1"
		bind:value={daily}
	>
		{#each [true, false] as s}
			<option value={s}>{s ? 'daily' : 'random'}</option>
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
<p class="mt-2">Next daily in {format(hoursToDaily)} hrs {format(minsToDaily)} mins {format(secondsToDaily)}s</p>
