<!-- src/routes/libraries/view/+page.svelte -->
<script>
	import { Card, Badge, Button, Tabs, TabItem } from 'flowbite-svelte';
	import { PenSolid } from 'flowbite-svelte-icons';
	import UploadNew from '$lib/UploadNewResource.svelte';
	import EditResource from '$lib/EditResource.svelte';
	import CreateNewResearchMap from '$lib/CreateNewResearchMap.svelte';

	export let data;

	// Destructure data object
	let { session, supabase, profile, library, narratives } = data;
	$: ({ session, supabase, profile, library, narratives } = data);

	// Local state for resource URL and modal visibility
	let url = '';
	let formModal = false;
	let newNarrativeModal = false;
	let editModal = false;
</script>

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
			{#if library.resources}
				{#each library.resources.files as resource}
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
							<Button
								size="xs"
								class="text-white px-2 absolute right-0 py-0 mx-5 rounded-none"
								color="transparent"
								on:click={() => (editModal = true)}
							>
								<PenSolid color="black" />
							</Button>
						</section>
					</Card>
					<!-- EditResource component for editing the resource -->
					<EditResource bind:editModal resources={library.resources} resourceId={resource.id} />
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

	<!-- Placeholder tab for Mindmaps (currently empty) -->
	<TabItem title="Narratives">
		<main
			class="mx-auto items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 content-stretch"
		>
			{#each narratives as narrative}
				<Card
					href="/libraries/narratives/?map_id={narrative.id}"
					class="bg-primary-100 drop-shadow-md opacity-80"
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
