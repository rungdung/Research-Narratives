<!-- src/routes/libraries/view/+page.svelte -->
<script>
	import { Card, Badge, Button, Tabs, TabItem } from 'flowbite-svelte';
	import { PenSolid } from 'flowbite-svelte-icons';
	import UploadNew from '$lib/UploadNewResource.svelte';
	import EditResource from '$lib/EditResource.svelte';
	import CreateNewResearchMap from '$lib/CreateNewResearchMap.svelte';
	import Nav from '$lib/Nav.svelte';

	export let data;

	// Destructure data object
	let { session, supabase, profile, library, narratives, resources, user, description, title } = data;
	$: ({ session, supabase, profile, library, narratives, resources, user, description, title } = data);

	// Local state for resource URL and modal visibility
	let url = '';
	let formModal = false;
	let newNarrativeModal = false;
</script>

<main class="w-5/6 mx-auto">
	<section class="">
		<Nav user={user.full_name} />
		<div class="text-black my-10">
			<h2 class="text-4xl">{title}</h2>
			{description}
		</div>
	</section>
	<!-- Tabs component for organizing content -->
	<Tabs class="" contentClass="bg-transparent p-5">
		<!-- Divider between tabs -->
		<hr slot="divider" class="my-2 mx-auto bg-yellow-500 h-1" />

		<!-- Resources tab -->
		<TabItem open title="Resources">
			<!-- Main content grid for displaying resources -->
			<main
				class="mx-auto items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 content-stretch"
			>
				{#if resources}
					{#each resources as resource}
						<!-- Card for displaying resource information -->
						<Card target="_blank" class="bg-primary-100 drop-shadow-md opacity-80 h-full">
							<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{resource.title}
							</h5>
							<p class="font-normal text-gray-700 dark:text-gray-400">
								{resource.description}
							</p>
							<small class="text-gray-500 dark:text-gray-400">{resource.source}</small>
							<section id="meta">
								<!-- Badge for displaying resource type -->
								<Badge color="purple">{resource.type}</Badge>
								<!-- Button for opening the edit modal -->
								<EditResource editModal={true} {resource} />
							</section>
						</Card>
						<!-- EditResource component for editing the resource -->
					{/each}

					<!-- Card for creating a new resource -->
					<Card class="bg-primary-100 drop-shadow-md h-full opacity-80">
						<Button class="text-white h-full bg-yellow-800" on:click={() => (formModal = true)}>
							Create a new resource
						</Button>
					</Card>

					<!-- UploadNew component for handling resource upload -->
					<UploadNew {supabase} bind:url bind:formModal />
				{:else}
					<!-- Card for creating a new resource when no resources are available -->
					<Card class="bg-primary-100 drop-shadow-md h-full opacity-80">
						<Button class="text-white" color="dark" on:click={() => (formModal = true)}>
							Create a new resource
						</Button>
					</Card>

					<!-- UploadNew component for handling resource upload -->
					<UploadNew {supabase} bind:url bind:formModal />
				{/if}
			</main>
		</TabItem>

		<!-- Placeholder tab for Mindmaps  -->
		<TabItem title="Narratives">
			<main
				class="mx-auto items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 content-stretch"
			>
				{#each narratives as narrative}
					<Card
						href="/libraries/narratives/?map_id={narrative.id}"
						class="bg-primary-100 drop-shadow-md h-full  opacity-80"
					>
						<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{narrative.title}
						</h5>
						<p class="font-normal text-gray-700 dark:text-gray-400">
							{narrative.description}
						</p>
					</Card>
				{/each}

				<!-- Card for creating a new research map when no resources are available -->
				<Card class="bg-primary-100 drop-shadow-md h-full opacity-80">
					<Button class="text-white" color="dark" on:click={() => (newNarrativeModal = true)}>
						Create a new Research Map
					</Button>
				</Card>

				<CreateNewResearchMap bind:newNarrativeModal />
			</main>
		</TabItem>
	</Tabs>
</main>
