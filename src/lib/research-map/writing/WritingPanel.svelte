<script>
	import { Button, CloseButton } from 'flowbite-svelte';
	import { CloseSolid, ShareNodesSolid } from 'flowbite-svelte-icons';

	import { page } from '$app/stores';

	import WritingNode from './WritingNode.svelte';
	import WritingNodeMaximised from './WritingNodeMaximised.svelte';

	export let narrativeSections;
	export let title;
	export let description;

	let narrativeSectionsJSON;
	$: narrativeSections = narrativeSections;
	$: narrativeSectionsJSON = JSON.stringify(narrativeSections);

	// Maximise the entire writing panel
	let maximise = false;

	// Append new section
	async function createNewSection() {
		if (narrativeSections == null) {
			narrativeSections = [];
		}

		let newSection = {
			id: narrativeSections.length + 1 || 1,
			title: '',
			bodytext: '',
			displayObj: {
				title: ''
			}
		};

		narrativeSections = [...narrativeSections, newSection];
	}

	const onClose = () => {
		maximise = false;
		return true;
	};
</script>

<div class="text-black rounded-lg h-full flex flex-col py-3">
	<!-- Conditional rendering based on the value of 'maximise' -->
	{#if maximise}
		<!-- Overlay div to cover the entire screen when maximised -->
		<div
			class="z-50 bg-primary-50 bg-opacity-90 fixed top-0 left-0 w-screen h-screen grid grid-cols-1 mx-auto max-w-none transition duration-500 overflow-scroll snap-proximity snap-y"
		>
			<!-- Close button to exit maximised mode -->
			<a
				on:click={onClose}
				href="#"
				class="absolute z-50 p-3 rounded-lg right-0 top-0 m-10 bg-slate-600"
			>
				<CloseSolid />
			</a>
			<!-- Container for content with vertical scrolling -->
			<div class="overflow-y-auto snap-y">
				<!-- Centered container for title and description -->
				<div class="h-screen snap-center">
					<div class="transform w-1/2 translate-x-1/2 translate-y-96 text-left">
						<!-- Title -->
						<h3 class="text-4xl">
							{title}
						</h3>
						<!-- Description -->
						<p>{description}</p>
					</div>
				</div>
				<!-- Render each section in maximised mode -->
				{#if narrativeSections}
					{#each narrativeSections as section}
						<WritingNodeMaximised {section} />
					{/each}
				{/if}
				<!-- Buttons for adding a new section and sharing the narrative -->
				<div class="my-5 snap-center mx-auto gap-2 h-20 grid grid-cols-2 w-[30vw]">
					<Button color="dark" class="" on:click={createNewSection}>Add section</Button>
					<Button
						color="dark"
						href="/libraries/narratives/view?narrative_id={$page.url.searchParams.get('map_id')}"
						>Share the narrative</Button
					>
				</div>
			</div>
		</div>
	{:else}

		<div class="bg-primary-200 p-4 rounded-lg my-2">
			<!-- Render title and buttons when not in maximised mode -->
			<h3 class="text-xl text-gray-700 mt-2">
				{title}
			</h3>
			<div class="grid grid-rows-2 mt-3">
				<!-- Button to enter maximised mode -->
				<Button class="px-3 py-1 bg-primary-300  my-1 " on:click={() => (maximise = true)}
					>Writing Mode</Button
				>
				<!-- Button to share the nodes -->
				<Button
					class="px-3 py-1 bg-primary-300  my-1 "
					href="/libraries/narratives/view?narrative_id={$page.url.searchParams.get('map_id')}"
					><ShareNodesSolid /></Button
				>
			</div>
			</div>

		<div class="bg-primary-200 p-4 rounded-lg overflow-y-auto">
			<!-- Render each section and add a new section button when not in maximised mode -->
			<div class="grid grid-flow-row-dense gap-2 my-5 grid-cols-1">
				{#if narrativeSections}
					{#each narrativeSections as section}
						<WritingNode bind:section bind:maximise />
					{/each}
				{/if}
			</div>
		</div>
		<Button color="dark" size="sm" class="w-full my-2" on:click={createNewSection}
			>Add section</Button
		>
	{/if}
</div>
