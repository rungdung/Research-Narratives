<!-- src/routes/libraries/+page.svelte -->
<script>
	import { Card } from 'flowbite-svelte';
	import CreateNewLib from '$lib/CreateNewLib.svelte';

	export let data;

	// Destructure data object and set up reactivity
	let { session, supabase, libraries } = data;
	$: ({ session, supabase, libraries } = data);
</script>

<!-- Main content section -->
<main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
	<!-- Check if there are libraries to display -->
	{#if libraries}
		{#each libraries as library}
			<!-- Display a card for each library with a link to view details -->
			<Card
				href="/libraries/view/?id={library.id}"
				class="bg-primary-100 h-full drop-shadow-md opacity-80"
			>
				<!-- Library name -->
				<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{library.name}
				</h5>
				<!-- Library description -->
				<p class="font-normal text-gray-700 dark:text-gray-400">
					{library.description}
				</p>
			</Card>
		{/each}
		<!-- Display the component for creating a new library -->
		<CreateNewLib />
	{:else}
		<!-- Display the component for creating a new library with a custom text -->
		<CreateNewLib text={'Create your first library'} />
	{/if}
</main>
