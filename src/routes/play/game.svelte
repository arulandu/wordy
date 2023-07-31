<script lang="ts">
	import type { Settings } from '../api/game';

	export let settings: { id: number } & Settings;

	let guess = '';
	let guesses: { guess: string; grade: string }[] = [];

	let keyboardMap: { [key: string]: string } = 'qwertyuiopasdfghjklzxcvbnm'
		.split('')
		.reduce((obj, c) => {
			return { ...obj, [c]: '_' };
		}, {});

	const gradePrecedence = '_BYG';
	const gradeToClass: { [key: string]: string } = {
		G: 'bg-green-500',
		Y: 'bg-yellow-500',
		B: 'bg-gray-500',
		_: 'bg-background'
	};
	// #6aaa64, #c9b458, #787c7e, #d3d6da

	const pushChar = (letter: string) => {
		guess = guess + letter;
	};

	const popChar = () => {
		guess = guess.slice(0, guess.length - 1);
	};

	const enter = async () => {
		const res = await (
			await fetch('/api/game/' + settings.id, { method: 'PUT', body: JSON.stringify({ guess }) })
		).json();

		if (res.valid) {
			guesses = [...guesses, { guess, grade: res.grade }];

			guess.split('').forEach((c, i) => {
				if (gradePrecedence.indexOf(res.grade[i]) > gradePrecedence.indexOf(keyboardMap[c])) {
					keyboardMap[c] = res.grade[i];
				}
			});
			guess = ""
		} else {
			guess = guess.slice(0, 4)
		}
	};

	const keydown = (e: KeyboardEvent) => {
		if (e.metaKey) return;
		document
			.querySelector(`[data-key="${e.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	};
</script>

<svelte:window on:keydown={keydown} />

<div class="flex flex-col items-center justify-center">
	<h3 class="mb-4 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">Wordy</h3>
	<p class="text-2xl font-semibold">
		A {settings.sequential ? 'sequential' : 'non-sequential'} game with {settings.boards} boards, and
		{settings.guesses} guesses
	</p>
	<div class="my-8">
		{#each [...Array(settings.guesses).keys()] as gi}
			{@const g = guesses[gi]}
			<div class="flex">
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
