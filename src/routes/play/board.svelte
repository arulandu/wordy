<script lang="ts">
	import { settings } from './stores';

	export let guess: string;
	export let guesses: { guess: string; grade: string }[];
  export let index: number;

	let solved = -1;
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

<div class="border border-primary border-solid text-center">
  <p class="text-xl font-semibold">Board {index+1} {guess}</p>
	<div
		class="border-4 p-2 mx-auto my-2 w-fit {solved >= 0
			? 'border-green-500'
			: 'border-accent'} border-solid"
	>
		{#each { length: $settings.guesses } as _, gi}
			{@const g = guesses[gi]}
			<div class="max-w-2xl flex">
				{#if gi < guesses.length}
					{#each g.guess as c, i}
						<div
							class="block w-16 aspect-square m-1 {gradeToClass[
								g.grade[i]
							]} flex items-center justify-center"
						>
							<p class="text-2xl font-extrabold text-background">{c.toUpperCase()}</p>
						</div>
					{/each}
				{:else if gi == guesses.length}
					{#each guess.slice(0, 5).padEnd(5, ' ') as c, i}
						<div
							class="block w-16 aspect-square m-1 {gradeToClass[
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
							class="block w-16 aspect-square m-1 {gradeToClass[
								g ? g.grade[i] : '_'
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
