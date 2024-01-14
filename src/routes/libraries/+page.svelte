<!-- src/routes/libraries/+page.svelte -->
<script>
	import { Card } from 'flowbite-svelte';
	import CreateNewLib from '$lib/CreateNewLib.svelte';
	import Nav from '$lib/Nav.svelte';

	export let data;

	// Destructure data object and set up reactivity
	let { session, supabase, libraries, user, description } = data;
	$: ({ session, supabase, libraries, user, description } = data);
</script>

<main class="w-5/6 mx-auto">
	<section class="">
		<Nav user={user.full_name} />
		<div class="text-black my-10">
			<h2 class="text-4xl">Welcome {user.full_name}!</h2>
			A library hosts many resources and mindmaps. Many people can access a library and edit and upload
			resources.
		</div>
	</section>
	<!-- Main content section -->
	<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 h-full overflow-y-auto">
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
	</section>
</main>
