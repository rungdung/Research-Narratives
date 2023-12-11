<!-- src/routes/libraries/+Layout.svelte -->
<script>
	import Nav from '$lib/Nav.svelte';

	export let data;

	// Destructure data object and set up reactivity
	let { title, description, user, page } = data;
	$: ({ title, description, user, page } = data);
</script>

<!-- Main content section -->
<section class="max-w-screen-lg lg:mx-auto md:mx-5 mx-10">
	<!-- Navigation component with the user's full name -->
	<Nav user={user.full_name} />

	<!-- Content section -->
	<section class="">
		<!-- Title section with conditional rendering based on the page type -->
		<h2 id="title">
			{#if page == 'profile'}
				Welcome {user.full_name}!
			{:else}
				{title}
			{/if}
		</h2>

		<!-- Subtitle section with conditional rendering based on the page type -->
		<p id="subtitle">
			{#if page == 'profile'}
				A library hosts many resources and mindmaps. Many people can access a library and edit and
				upload resources.
			{:else}
				{description}
			{/if}
		</p>
	</section>
</section>

<!-- Main content area -->
<main class="my-10 mx-auto w-5/6">
	<slot />
</main>

<style>
	#title {
		font-size: 2em;
	}
	#title,
	#subtitle {
		color: black;
	}
</style>
