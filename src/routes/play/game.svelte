<script lang="ts">
	import type { Settings } from '../api/game';

	export let settings: { id: number } & Settings;

	let guess = '';
	let guesses: { guess: string; grade: string }[] = [];
	
	let keyboardMap:any = "qwertyuiopasdfghjklzxcvbnm".split("").reduce((obj, c) => {return {...obj, [c]: "⬜"}}, {})

	const gradePrecedence = "⬜⬛🟨🟩"
	const gradeToClass = {
		"🟩": "bg-green-400",
		"🟨": "bg-yellow-400",
		"⬛": "bg-gray-400",
		"⬜": "bg-secondary"
	}
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
			
			guess.split("").forEach((c, i) => gradePrecedence[res.grade[i]] > gradePrecedence[keyboardMap[c]] ? keyboardMap[c] = res.grad[i] : null)
			keyboardMap = keyboardMap  // force refresh

			guess = '';
		}
		console.log(res);
	};

	const keydown = (e: KeyboardEvent) => {
		if (e.metaKey) return;
		document
			.querySelector(`[data-key="${e.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	};
</script>

<svelte:window on:keydown={keydown} />

<div>
	<p>Game: {JSON.stringify(settings)}</p>
	<p>Guess: {guess}</p>
	{#each guesses as g}
		<p>{g.guess} {g.grade}</p>
	{/each}
	<div>
		<button on:click={popChar} data-key="backspace">{@html '<-'}</button>
		<button on:click={enter} data-key="enter">{@html '->'}</button>
		{#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row}
			<div class="flex items-center justify-center">
				{#each row as letter}
					<button
						on:click={() => pushChar(letter)}
						data-key={letter}
						class="m-2 px-2 {gradeToClass[keyboardMap[letter]]} border border-primary border-solid">{letter}</button
					>
				{/each}
			</div>
		{/each}
	</div>
</div>
