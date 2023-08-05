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
	$: minsToDaily = Math.floor((timeToDaily / (1000 * 60)) % 60);
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
	class="mx-auto mt-2 w-fit flex flex-col sm:flex-row items-center justify-center border border-accent border-solid p-2 rounded-md bg-accent bg-opacity-5"
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
	<button on:click={play} class="m-1 w-5 rounded-full text-accent font-extrabold whitespace-pre ">
		<svg class="w-full h-full " fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" viewBox="0 0 31.143 31.143" xml:space="preserve">
			<g>
				<g id="c100_arrow">
					<path d="M0,15.571c0.001,1.702,1.383,3.081,3.085,3.083l17.528-0.002l-4.738,4.739c-1.283,1.284-1.349,3.301-0.145,4.507    c1.205,1.201,3.222,1.138,4.507-0.146l9.896-9.898c1.287-1.283,1.352-3.301,0.146-4.506c-0.033-0.029-0.068-0.051-0.1-0.08    c-0.041-0.043-0.07-0.094-0.113-0.139l-9.764-9.762c-1.268-1.266-3.27-1.316-4.474-0.111c-1.205,1.205-1.153,3.208,0.111,4.476    l4.755,4.754H3.085C1.381,12.485,0,13.865,0,15.571z"/>
				</g>
				<g id="Capa_1_46_">
				</g>
			</g>
			</svg>
	</button>
</div>
<p class="mt-2">Next daily in {format(hoursToDaily)} hrs {format(minsToDaily)} mins {format(secondsToDaily)}s</p>
