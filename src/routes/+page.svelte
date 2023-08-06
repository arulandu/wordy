<script lang="ts">
	import Launcher from './launcher.svelte';
	import Theme from './theme.svelte';
</script>

<div class="relative h-screen flex flex-col">
	<div class="absolute w-full p-4">
		<Theme />
	</div>
	<div class="flex items-center justify-center flex-grow">
		<div class="text-center">
			<h1 class="mb-6 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
				wordy.<span class="text-accent">club</span>
			</h1>
			<Launcher />
		</div>
	</div>
	<footer class="mb-8 flex flex-col items-center justify-center w-full">
		<p class="mt-4 text-center text-base">
			Made with 💖 by <a class=" underline" href="https://arulandu.com">Alvan Caleb Arulandu</a>
		</p>
		<a class="mt-2 block w-fit" href="https://github.com/Claeb101/wordy">
			<img
				class="h-full"
				src="https://img.shields.io/github/last-commit/claeb101/wordy"
				alt="commit tag"
			/>
		</a>
	</footer>
</div>
