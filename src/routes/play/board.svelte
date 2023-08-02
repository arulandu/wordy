<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { settings } from './stores';

	export let guess: string;
	export let guesses: { guess: string; grade: string }[];
	export let index: number;
	export let focused: boolean;
	export let show = true;

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
		_: 'bg-background'
	};
</script>

<div id="board-{index}" class="board min-h-full w-full text-center">
	<p class="text-xl font-semibold">Board {index + 1}</p>
	<div
		class="border-4 p-2 mx-auto my-2 w-fit {solved >= 0
			? 'border-green-500'
			: 'border-accent'} {focused
			? 'border-opacity-100'
			: 'border-opacity-0'} transition-all duration-150 border-solid"
	>
		{#each { length: $settings.guesses } as _, gi}
			{@const g = guesses[gi]}
			{@const boxSize = "w-12 xs:w-16 aspect-square m-1"}
			<div class="max-w-2xl flex">
				{#if show && gi < guesses.length && (solved < 0 || gi <= solved)}
					{#each g.guess as c, i}
						<div
							class="{boxSize} {gradeToClass[
								g.grade[i]
							]} flex items-center justify-center"
						>
							<p class="text-2xl font-extrabold text-background">{c.toUpperCase()}</p>
						</div>
					{/each}
				{:else if show && gi == guesses.length && solved < 0}
					{#each guess.slice(0, 5).padEnd(5, ' ') as c, i}
						<div
							class="{boxSize} {gradeToClass[
								g ? g.grade[i] : '_'
							]} flex items-center justify-center border-2 border-solid border-accent {c === ' '
								? ''
								: 'border-foreground'}"
						>
							<p class="text-2xl font-extrabold text-foreground">{c.toUpperCase()}</p>
						</div>
					{/each}
				{:else}
					{#each ''.padEnd(5, ' ') as c, i}
						<div
							class="{boxSize} {gradeToClass[
								'_'
							]} flex items-center justify-center border-2 border-solid border-accent"
						>
							<p class="text-2xl font-extrabold text-foreground">{c.toUpperCase()}</p>
						</div>
					{/each}
				{/if}
			</div>
		{/each}
	</div>
</div>
