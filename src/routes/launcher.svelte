<script lang="ts">
	import { goto } from "$app/navigation";

	let boards = 0;
	let guesses = 0;
	let sequential = false;

	const play = async () => {
		const res = await (await fetch("/api/game", {method: "POST", body: JSON.stringify({boards, guesses, sequential})})).json()
		goto('/play?' + new URLSearchParams({id: res.id}))
	}

</script>

<p>
	Play a
	<select class="bg-background border-solid border-2 border-primary rounded-md p-1" bind:value={sequential}>
		{#each [true, false] as s}
			<option value={s}>{s ? 'sequential' : 'non-sequential'}</option>
		{/each}
	</select>
	game with
	<input
		bind:value={boards}
		type="number"
		class="bg-background border-solid border-2 border-primary rounded-md p-1"
	/>
	boards and
	<input
		bind:value={guesses}
		class="bg-background border-solid border-2 border-primary rounded-md p-1"
	/>
	guesses
	<button
		on:click={play}
		class="inline-block rounded-full text-primary font-extrabold"
	>
		{@html '->'}
	</button>
</p>
