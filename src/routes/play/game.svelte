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
		guess = guess + letter;
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
			guess = guess.slice(0, 4);
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
		boards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	};

	const onViewerScroll = (e: Event) => {
		for (let i = 0; i < boards.length; i++) {
			if (boards[i].offsetTop > viewer.scrollTop) {
				currentBoard = i;
				return;
			}
		}
		currentBoard = 0;
	};
</script>

<svelte:window on:keydown={keydown} />

<div class="relative max-w-2xl flex flex-col items-center justify-center">
	{#if result != 0}
		<div
			class="absolute w-full h-full inset-0 z-50 bg-background bg-opacity-80 backdrop-blur-sm"
			transition:fade
		>
			<div
				class="mx-auto p-6 max-w-lg bg-background border border-accent rounded-md border-solid shadow-lg text-center"
			>
				<h1 class="text-2xl font-semibold">
					{result == 1 ? 'Congratulations!' : 'Better luck next time!'}
				</h1>
				<button
					on:click={() => goto('/')}
					class="mt-4 rounded-lg font-extrabold whitespace-pre p-2 bg-foreground text-secondary"
				>
					Continue
				</button>
			</div>
		</div>
	{/if}
	<div class="text-center">
		<h3 class="mb-4 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
			Wordy #{$settings.day}{$settings.seed ? '.' + $settings.seed : ''}
		</h3>
		<p class="text-2xl font-semibold">
			A {$settings.sequential ? 'sequential' : 'non-sequential'} game with {$settings.boards} boards,
			and
			{$settings.guesses} guesses
		</p>
	</div>
	<div class="mx-4 flex flex-wrap items-center justify-center">
		{#each guesses as g, i}
			<button
				on:click|preventDefault={() => goTo(i)}
				class="m-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-solid {currentBoard ==
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
	<div
		bind:this={viewer}
		on:scroll={onViewerScroll}
		class="relative mt-4 mx-auto h-[32rem] w-fit overflow-y-scroll pretty-scroll space-y-8"
	>
		{#each guesses as g, i (i)}
			<Board
				{guess}
				guesses={g}
				index={i}
				show={!$settings.sequential || i <= closestUnsolvedBoard}
				focused={currentBoard == i}
				bind:solved={solved[i]}
			/>
		{/each}
	</div>
	<div>
		{#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row, r}
			<div class="flex items-center justify-center">
				{#if r == 2}
					<button
						on:click={popChar}
						data-key="backspace"
						class="m-1 p-1 xs:p-3 bg-secondary text-foreground border-opacity-0 hover:border-opacity-25 border border-primary border-solid rounded-md font-semibold text-xl"
						>Back</button
					>
				{/if}

				{#each row as letter}
					<button
						on:click={() => pushChar(letter)}
						data-key={letter}
						class="m-1 p-1 xs:p-3 {keyboardMap[letter] == '_'
							? 'bg-secondary text-foreground'
							: gradeToClass[keyboardMap[letter]] +
							  ' text-background'} border-opacity-0 hover:border-opacity-25 border border-primary border-solid rounded-md font-bold text-xl"
						>{letter.toUpperCase()}</button
					>
				{/each}

				{#if r == 2}
					<button
						on:click={enter}
						data-key="enter"
						class="m-1 p-1 xs:p-3 bg-secondary text-foreground border-opacity-0 hover:border-opacity-25 border border-primary border-solid rounded-md font-semibold text-xl"
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
