<script lang="ts">
	import type { Settings } from '../api/game';
	import Board from './board.svelte';
	import { settings } from './stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	const gradePrecedence = '_BYG';
	const gradeToClass: { [key: string]: string } = {
		G: 'bg-green-500',
		Y: 'bg-yellow-500',
		B: 'bg-gray-500',
		_: 'bg-background'
	};
	// #6aaa64, #c9b458, #787c7e, #d3d6da

	let guess = '';
	let guesses: { guess: string; grade: string }[][] = [...Array($settings.boards).keys()].map(
		() => []
	);
	let invalid = false;

	// TODO: svelte is high. how do i trigger an animation from event??
	const alertInvalid = () => {
		invalid = true;
		setTimeout(() => { console.log("clear"); invalid = false; }, 600)
	}
	
	let solved = Array($settings.boards).fill(-1);
	$: result =
		solved.filter((x) => x >= 0).length == $settings.boards
			? 1
			: guesses[0].length >= $settings.guesses
			? -1
			: 0;
	$: closestUnsolvedBoard = solved.indexOf(-1) >= 0 ? solved.indexOf(-1) : solved.length;

	const updateKeyboardMap = (
		guesses: { guess: string; grade: string }[][],
		currentBoard: number
	) => {
		const keyboard: { [key: string]: string } = 'qwertyuiopasdfghjklzxcvbnm'
			.split('')
			.reduce((obj, c) => {
				return { ...obj, [c]: '_' };
			}, {});

		guesses[currentBoard]
			.slice(0, solved[currentBoard] >= 0 ? solved[currentBoard] + 1 : undefined)
			.forEach((g) => {
				g.guess.split('').forEach((c, i) => {
					if (gradePrecedence.indexOf(g.grade[i]) > gradePrecedence.indexOf(keyboard[c])) {
						keyboard[c] = g.grade[i];
					}
				});
			});

		return keyboard;
	};

	$: keyboardMap = updateKeyboardMap(guesses, currentBoard);

	// TODO: update keyboard map for currently focused board

	const pushChar = (letter: string) => {
		if(guess.length < 5) guess += letter;
	};

	const popChar = () => {
		guess = guess.slice(0, guess.length - 1);
	};

	const enter = async () => {
		const res = await (
			await fetch('/api/game/' + encodeURIComponent($settings!.id), {
				method: 'PUT',
				body: JSON.stringify({ guess })
			})
		).json();

		if (res.valid) {
			guesses = guesses.map((g, i) => [...g, { guess, grade: res.grades[i] }]);

			guess = '';
		} else {
			alertInvalid()
		}
	};

	const keydown = (e: KeyboardEvent) => {
		if (e.metaKey) return;
		document
			.querySelector(`[data-key="${e.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	};

	let viewer: HTMLElement;
	let boards: HTMLElement[];

	onMount(() => {
		boards = [...document.getElementsByClassName('board')] as HTMLElement[];
	});

	let currentBoard = 0;
	const goTo = (i: number) => {
		viewer.scroll({ top: boards[i].offsetTop, behavior: 'smooth' });
	};

	const onViewerScroll = (e: Event) => {
		for (let i = 0; i < boards.length; i++) {
			if (boards[i].offsetTop + boards[i].offsetHeight > viewer.scrollTop) {
				currentBoard = i;
				return;
			}
		}
		// currentBoard = 0;
	};
</script>

<svelte:window on:keydown={keydown} />

<div class="relative max-w-2xl flex flex-col items-center justify-center">
	{#if result != 0}
		<div
			class="absolute w-full h-full inset-0 z-50 bg-background bg-opacity-80 backdrop-blur-sm"
			transition:fade={{delay: 500}}
		>
			<div
				class="mx-auto p-6 max-w-lg bg-background border border-accent rounded-md border-solid shadow-lg text-center"
			>
				<h1 class="text-2xl font-semibold">
					{result == 1 ? 'Congratulations!' : 'Better luck next time!'}
				</h1>
				<button
					on:click={() => goto('/')}
					class="mt-4 rounded-lg font-extrabold whitespace-pre p-2 bg-accent text-background text-lg"
				>
					Continue
				</button>
			</div>
		</div>
	{/if}
	<div class="text-center">
		<h3 class="mb-4 scroll-m-20 text-3xl font-bold tracking-tight">
			Wordy #{$settings.day}{$settings.seed ? '.' + $settings.seed : ''}
		</h3>
		<!-- <p class="text-2xl font-semibold">
			A {$settings.sequential ? 'sequential' : 'non-sequential'} game with {$settings.boards} boards,
			and
			{$settings.guesses} guesses
		</p> -->
	</div>
	<div class="mx-4 flex flex-wrap items-center justify-center">
		{#each guesses as g, i}
			<button
				on:click|preventDefault={() => goTo(i)}
				class="m-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-solid {currentBoard ==
				i
					? 'border-primary'
					: 'border-secondary'} {solved[i] >= 0 &&
				(!$settings.sequential || i <= closestUnsolvedBoard)
					? 'bg-green-500'
					: ''}"
			>
				<p class="text-foreground font-semibold">{i + 1}</p>
			</button>
		{/each}
	</div>
	<div class="mt-4 bg-secondary p-4 rounded-lg shadow-sm">
		<div
			bind:this={viewer}
			on:scroll={onViewerScroll}
			class="relative mx-auto h-[32rem] w-fit overflow-y-scroll pretty-scroll space-y-8 transition-all"
		>
			{#each guesses as g, i (i)}
				<Board
					{guess}
					guesses={g}
					index={i}
					show={!$settings.sequential || i <= closestUnsolvedBoard}
					focused={currentBoard == i}
					invalid={invalid}
					bind:solved={solved[i]}
				/>
			{/each}
		</div>
	</div>
	<div class="mt-2">
		{#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row, r}
			{@const keyStyle =
				'm-1 p-1 xs:p-3 border-opacity-0 hover:border-opacity-25 border border-primary border-solid rounded-md font-bold text-xl'}
			<div class="flex items-center justify-center">
				{#if r == 2}
					<button
						on:click={popChar}
						data-key="backspace"
						class="bg-secondary text-foreground {keyStyle}"
						>Back</button
					>
				{/if}

				{#each row as letter}
					<button
						on:click={() => pushChar(letter)}
						data-key={letter}
						class="{keyboardMap[letter] == '_'
							? 'bg-secondary text-foreground'
							: gradeToClass[keyboardMap[letter]] + ' text-background'} {keyStyle}"
						>{letter.toUpperCase()}</button
					>
				{/each}

				{#if r == 2}
					<button
						on:click={enter}
						data-key="enter"
						class="bg-secondary text-foreground {keyStyle}"
						>Enter</button
					>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.pretty-scroll::-webkit-scrollbar {
		width: 0px;
	}

	.pretty-scroll::-webkit-scrollbar-track {
		background-color: transparent;
	}

	.pretty-scroll::-webkit-scrollbar-thumb {
		background-color: rgb(var(--color-accent));
		border-radius: 0px;
		border: 0px solid transparent;
		background-clip: content-box;
	}

	.pretty-scroll::-webkit-scrollbar-thumb:hover {
		background-color: rgb(var(--color-foreground));
	}

	.pretty-scroll::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>
