<script>
	import db from '/static/data/db.json';
	import content from '/static/data/content.json';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={() => console.log(db)}>Show DB</button>
<button on:click={() => console.log(content)}>Show Content</button>
