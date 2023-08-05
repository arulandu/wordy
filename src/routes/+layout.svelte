<script>
	import '@/app.css';
	import {theme} from "./stores"
</script>

<div class="app bg-background text-foreground transition-all {$theme}">
	<main>
		<slot />
	</main>
</div>
