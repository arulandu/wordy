<script lang="ts">
	import Carousel from 'svelte-carousel';
	import type { Settings } from '../api/game';
	import Board from './board.svelte';
	import { settings } from './stores';
	import { browser } from '$app/environment';

	const gradePrecedence = '_BYG';
	const gradeToClass: { [key: string]: string } = {
		G: 'bg-green-500',
		Y: 'bg-yellow-500',
		B: 'bg-gray-500',
		_: 'bg-background'
	};

	let guess = '';
	let guesses: { guess: string; grade: string }[][] = [...Array($settings.boards).keys()].map(
		() => []
	);

	let keyboardMap: { [key: string]: string } = 'qwertyuiopasdfghjklzxcvbnm'
		.split('')
		.reduce((obj, c) => {
			return { ...obj, [c]: '_' };
		}, {});

	// #6aaa64, #c9b458, #787c7e, #d3d6da

	const pushChar = (letter: string) => {
		guess = guess + letter;
	};

	const popChar = () => {
		guess = guess.slice(0, guess.length - 1);
	};

	const enter = async () => {
		const res = await (
			await fetch('/api/game/' + $settings!.id, { method: 'PUT', body: JSON.stringify({ guess }) })
		).json();

		if (res.valid) {
			guesses = guesses.map((g, i) => [...g, { guess, grade: res.grades[i] }]);
			// TODO: update keyboard map for currently focused board
			// guess.split('').forEach((c, i) => {
			// 	if (gradePrecedence.indexOf(res.grade[i]) > gradePrecedence.indexOf(keyboardMap[c])) {
			// 		keyboardMap[c] = res.grade[i];
			// 	}
			// });
			guess = '';
		} else {
			guess = guess.slice(0, 4);
		}
	};

	const keydown = (e: KeyboardEvent) => {
		if (e.metaKey) return;
		document
			.querySelector(`[data-key="${e.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	};

	let carousel;
	let loaded = [...Array(20).keys()];
</script>

<svelte:window on:keydown={keydown} />

<div class="w-full flex flex-col items-center justify-center">
	<h3 class="mb-4 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">Wordy</h3>
	<p class="text-2xl font-semibold">
		A {$settings.sequential ? 'sequential' : 'non-sequential'} game with {$settings.boards} boards, and
		{$settings.guesses} guesses
	</p>
	<!-- <div class="my-8 flex flex-row"> -->
	{#if browser}
		<Carousel let:loaded bind:this={carousel} particlesToScroll={1} particlesToShow={3}>
			<!-- <div>1</div>
			<div>2</div>
			<div>3</div> -->
			{#each { length: $settings.boards } as _, i (i)}
				<Board {guess} guesses={guesses[i]} index={i} />
			{/each}
		</Carousel>
	{/if}
	<!-- </div> -->
	<div>
		<button on:click={popChar} data-key="backspace">{@html '<-'}</button>
		<button on:click={enter} data-key="enter">{@html '->'}</button>
		{#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row}
			<div class="flex items-center justify-center">
				{#each row as letter}
					<button
						on:click={() => pushChar(letter)}
						data-key={letter}
						class="m-1 p-3 {keyboardMap[letter] == '_'
							? 'bg-secondary text-foreground'
							: gradeToClass[keyboardMap[letter]] +
							  ' text-background'} border-opacity-0 hover:border-opacity-25 border border-primary border-solid rounded-md font-bold text-xl"
						>{letter.toUpperCase()}</button
					>
				{/each}
			</div>
		{/each}
	</div>
</div>
