<!-- src/routes/libraries/+Layout.svelte -->
<script>
	import Nav from '$lib/Nav.svelte';

	export let data;

	// Destructure data object and set up reactivity
	let { title, description, user, page } = data;
	$: ({ title, description, user, page } = data);
</script>

{#if page != 'resourceAnnotate'}
	<!-- Main content section -->
	<section class="w-5/6 mx-auto">
		<!-- Navigation component with the user's full name -->
		<Nav user={user.full_name} />

		<!-- Content section -->
		<section class="">
			<!-- Title section with conditional rendering based on the page type -->
			<h2 id="title">
				{#if page == 'profile'}
					Welcome {user.full_name}!
				{:else if page == 'library'}
					{title}
				{/if}
			</h2>

			<!-- Subtitle section with conditional rendering based on the page type -->
			<p id="subtitle">
				{#if page == 'profile'}
					A library hosts many resources and mindmaps. Many people can access a library and edit and
					upload resources.
				{:else if page == 'library'}
					{description}
				{/if}
			</p>
		</section>
	</section>

	<!-- Main content area -->
	<main class="py-8 mx-auto w-5/6">
		<slot />
	</main>
{:else}
	<slot />
{/if}

<style>
	#title {
		font-size: 2em;
	}
	#title,
	#subtitle {
		color: black;
	}
</style>
