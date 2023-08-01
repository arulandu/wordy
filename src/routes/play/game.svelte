<script lang="ts">
	import type { Settings } from '../api/game';
	import Board from './board.svelte';
	import { settings } from './stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

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

	let solved = Array($settings.boards).fill(-1)
	$: win = solved.filter(x => x >= 0).length == $settings.boards;

	const updateKeyboardMap = (
		guesses: { guess: string; grade: string }[][],
		currentBoard: number
	) => {
		const keyboard: { [key: string]: string } = 'qwertyuiopasdfghjklzxcvbnm'
			.split('')
			.reduce((obj, c) => {
				return { ...obj, [c]: '_' };
			}, {});

		guesses[currentBoard].slice(0, solved[currentBoard] >= 0 ? solved[currentBoard]+1 : undefined).forEach((g) => {
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
			await fetch('/api/game/' + encodeURIComponent($settings!.id), { method: 'PUT', body: JSON.stringify({ guess }) })
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

<div class="max-w-2xl flex flex-col items-center justify-center">
	<h3 class="mb-4 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl {win ? "text-green-500 animate-bounce":""}">{win ? "Wordy!!" : "Wordy"}</h3>
	<p class="text-2xl font-semibold">
		A {$settings.sequential ? 'sequential' : 'non-sequential'} game with {$settings.boards} boards, and
		{$settings.guesses} guesses
	</p>
	<div class="my-4">
		<div class="mx-4 flex flex-wrap items-center justify-center">
			{#each guesses as g, i}
				<button
					on:click|preventDefault={() => goTo(i)}
					class="m-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-solid {currentBoard ==
					i
						? 'border-primary'
						: 'border-secondary'} {solved[i] >= 0 ? "bg-green-500" : ""}"
				>
					<p class="text-foreground font-semibold">{i + 1}</p>
				</button>
			{/each}
		</div>
		<div
			bind:this={viewer}
			on:scroll={onViewerScroll}
			class="mt-4 h-[32rem] overflow-y-scroll pretty-scroll space-y-8"
		>
			{#each guesses as g, i (i)}
				<Board {guess} guesses={g} index={i} focused={currentBoard == i} bind:solved={solved[i]} />
			{/each}
		</div>
	</div>
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
