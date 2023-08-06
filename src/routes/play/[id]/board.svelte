<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { game } from './stores';

	export let guess: string;
	export let guesses: { guess: string; grade: string }[];
	export let index: number;
	export let focused: boolean;
	export let show = true;
	export let invalid = false;

	export let solved = -1;
	$: {
		if (guesses.length > 0 && guesses[guesses.length - 1].grade === ''.padEnd(5, 'G')) {
			solved = guesses.length - 1;
		}
	}

	const gradePrecedence = '_BYG';
	const gradeToClass: { [key: string]: string } = {
		G: 'bg-green-500',
		Y: 'bg-yellow-500',
		B: 'bg-gray-500',
		_: 'bg-secondary'
	};
</script>

<div id="board-{index}" class="board min-h-full w-full text-center">
	<p class="text-xl font-semibold">Board {index + 1}</p>
	<div
		class="border-4 p-2 mx-auto my-2 w-fit {solved >= 0
			? 'border-green-500'
			: 'border-foreground'} {focused
			? 'border-opacity-100'
			: 'border-opacity-0'} transition-all duration-150 border-solid rounded-sm"
	>
		{#each { length: $game.settings.guesses } as _, gi}
			{@const g = guesses[gi]}
			{@const boxStyle = `w-12 xs:w-16 aspect-square m-1 rounded-sm flex items-center justify-center`}
			<div class="max-w-2xl flex">
				{#if show && gi < guesses.length && (solved < 0 || gi <= solved)}
					{#each g.guess as c, i}
						<div class="{boxStyle} {gradeToClass[g.grade[i]]} animate-[flip_300ms_ease-out_1]">
							<p class="text-2xl font-extrabold text-background">{c.toUpperCase()}</p>
						</div>
					{/each}
				{:else if show && gi == guesses.length && solved < 0}
					{#each guess.slice(0, 5).padEnd(5, ' ') as c, i}
						<div class={invalid ? 'animate-[shake_600ms_ease-in-out_1]' : ''}>
							<div
								class="
							{boxStyle} 
							{gradeToClass[g ? g.grade[i] : '_']} 
							 border-2 border-solid
							{c === ' ' ? 'border-foreground' : 'border-foreground'} 
							{c === ' ' ? '' : 'animate-[pop_150ms_ease-out_1]'}"
							>
								<p class="text-2xl font-extrabold text-foreground">{c.toUpperCase()}</p>
							</div>
						</div>
					{/each}
				{:else}
					{#each ''.padEnd(5, ' ') as c, i}
						<div class="{boxStyle} {gradeToClass['_']} border-2 border-solid border-foreground">
							<p class="text-2xl font-extrabold text-foreground">{c.toUpperCase()}</p>
						</div>
					{/each}
				{/if}
			</div>
		{/each}
	</div>
</div>
