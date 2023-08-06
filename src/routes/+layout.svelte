<script>
	import '@/app.css';
	import {theme} from "./stores"
	import { browser } from '$app/environment';
	$: {
		if(browser) document.documentElement.style.setProperty("--color-hue", $theme.hue+"")
	}
</script>

<div class="app min-h-screen bg-background text-foreground transition-all {$theme.mode}">
	<main>
		<slot />
	</main>
</div>
