<script>
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';

	import { SvelteFlowProvider } from '@xyflow/svelte';

	import Flow from '$lib/research-map/Flow.svelte';
	import WritingPanel from '$lib/research-map/WritingPanel.svelte';
	import Sidebar from '$lib/research-map/Sidebar.svelte';

	import { Button, AccordionItem, Accordion } from 'flowbite-svelte';
	import { DownloadSolid, HomeSolid } from 'flowbite-svelte-icons';

	import { activeDraggableNode, activeDraggableNodeModal } from '$lib/research-map/store';
	import Nav from '$lib/Nav.svelte';

	export let data;

	// Destructure data object and set up reactivity
	let { session, supabase, narrative, resources } = data;
	$: ({ session, supabase, narrative, resources } = data);

	// Destructure from narrative
	let narrativeSections = narrative.narrative_sections;
	let title = narrative.title;
	let description = narrative.description;
	let nodes, edges;

	// Container to control style of research map
	let narrativeSection;

	// Form element to control saving to DB
	let dbformElement;

	// Load nodes and edges from DB
	if (narrative.nodes == null) {
		nodes = writable([]);
	} else {
		nodes = writable(narrative.nodes);
	}
	if (narrative.edges == null) {
		edges = writable([]);
	} else {
		edges = writable(narrative.edges);
	}

	// When box is dragged
	const onDragStart = (event, nodeData) => {
		if (!event.dataTransfer) {
			return null;
		}
		event.dataTransfer.setData('application/svelteflow', JSON.stringify(nodeData));
		event.dataTransfer.effectAllowed = 'move';
	};

	// When box is dropped
	const onDragEnd = (event) => {
		$activeDraggableNodeModal = false;
		narrativeSection.style = 'opacity: 1; pointer-events: all';
	};

	// When drag Modal is triggered by button click from a node
	// Deactivate narrative section and activate drag modal
	$: if ($activeDraggableNodeModal == true) {
		narrativeSection.style = 'opacity: 0.5; pointer-events: none';
	}

	// nodes json for saving
	$: activeNodesJSON = JSON.stringify($nodes);
	$: activeEdgesJSON = JSON.stringify($edges);
	
	let narrativeSectionsJSON;
	// save to DB
	async function saveToDB() {
		narrativeSectionsJSON = await JSON.stringify(narrativeSections)
		if (await narrativeSectionsJSON){
			dbformElement.requestSubmit();
		}
	}
</script>

<section class="grid grid-flow-row grid-cols-5 h-screen overflow-hidden">
	<section class="col-span-4 relative h-screen">
		<!-- Button on the side -->
		<section class="absolute h-screen top-0 left-0 z-50 m-5 w-1/6">
			<a href="/libraries" class=" ">
				<h2 class="text-2xl mt-5 mb-3 text-left md:mx-0 font-semibold text-yellow-500">
					Kaagada
				</h2>
			</a>
			<section class="w-full grid grid-cols-2 gap-x-1">
				<Button class="bg-primary-300 w-full my-1" type="submit" on:click={() => saveToDB()}
					><DownloadSolid /></Button
				>
				<Button class="bg-primary-300 w-full my-1  " type="submit" href="/libraries/view/?id={narrative.library_id}"
					><HomeSolid /></Button
				>

				<Accordion defaultClass="bg-primary-100 w-full max-h-screen overflow-y-auto col-span-2">
					<AccordionItem defaultClass="bg-primary-300 h-20 w-full" paddingDefault="p-0">
						<span slot="header">Add resources</span>
						<Sidebar {resources} />
					</AccordionItem>
				</Accordion>
			</section>
			<section />
		</section>
		<!-- Modal to drag and drop into narrative section-->
		{#if $activeDraggableNodeModal}
			<!-- Overlay -->
			<div
				class="h-100 w-1/6 items-center z-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-200 text-black"
			>
				Drag and drop onto the narrative section
				<div
					id="dragModal"
					class="bg-primary-300 w- p-3 rounded-lg"
					on:dragstart={(event) => onDragStart(event, $activeDraggableNode)}
					on:dragend={onDragEnd}
					draggable={true}
				>
					{$activeDraggableNode.title}
				</div>
			</div>
		{/if}
		<!-- Research Map -->
		<div bind:this={narrativeSection} class="h-full w-full px-0 mb-2 rounded-lg">
			<SvelteFlowProvider>
				<Flow bind:nodes bind:edges />
			</SvelteFlowProvider>
			<!-- Form Request Submit to update nodes and edges in database -->
			<form bind:this={dbformElement} use:enhance action="?/updateResearchMap" method="post">
				<input type="hidden" id="nodes" name="nodes" bind:value={activeNodesJSON} />
				<input type="hidden" id="edges" name="edges" bind:value={activeEdgesJSON} />
				<input
					type="hidden"
					id="narrativeSections"
					name="narrativeSections"
					bind:value={narrativeSectionsJSON}
				/>
			</form>
		</div>
	</section>
	<section class="col-span-1 bg-primary-100 py-1 px-3 overflow-y-hidden rounded-lg">
		<WritingPanel bind:narrativeSections bind:title bind:description />
	</section>
</section>

<style>
	#dragModal {
		cursor: grab;
	}
</style>
