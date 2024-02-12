<script>
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';

	import { SvelteFlowProvider } from '@xyflow/svelte';

	import Flow from '$lib/research-map/Flow.svelte';
	import WritingPanel from '$lib/research-map/writing/WritingPanel.svelte';
	import Sidebar from '$lib/research-map/Sidebar.svelte';

	import { Button, AccordionItem, Accordion } from 'flowbite-svelte';
	import { DownloadSolid, HomeSolid } from 'flowbite-svelte-icons';

	import { activeDraggableNode, activeDraggableNodeModal } from '$lib/research-map/store';

	export let data;

	// Destructure data object and set up reactivity
	let { session, supabase, narrative, resources } = data;
	$: ({ session, supabase, narrative, resources } = data);

	// Destructure from narrative
	let narrativeSections = narrative.narrative_sections;
	let nodes, edges;
	let narrativeSectionsJSON, activeNodesJSON, activeEdgesJSON;

	// Container to control style of research map
	let researchMapElement;

	// Form element to control saving to DB
	let dbformElement;

	/**
	 * Load nodes and edges from the database
	 */
	function loadNodesAndEdgesFromDB() {
		nodes = writable(narrative.nodes || []);
		edges = writable(narrative.edges || []);
	}

	/**
	 * Event handler for when a box is dragged
	 * @param {Event} event - The drag event
	 * @param {any} nodeData - The data associated with the dragged node
	 */
	const onDragStart = (event, nodeData) => {
		if (!event.dataTransfer) {
			return null;
		}
		event.dataTransfer.setData('application/svelteflow', JSON.stringify(nodeData));
		event.dataTransfer.effectAllowed = 'move';
	};

	/**
	 * Event handler for when a box is is dropped
	 * @param {Event} event - The drop event
	 */
	const onDragEnd = (event) => {
		$activeDraggableNodeModal = false;
		researchMapElement.style = 'opacity: 1; pointer-events: all';
	};

	/**
	 * Set the style of the drag modal based on the active state
	 */
	function setDragModalStyle() {
		if ($activeDraggableNodeModal == true) {
			researchMapElement.style = 'opacity: 0.5; pointer-events: none';
		}
	}

	/**
	 * Save data to the database
	 */
	async function saveToDB() {
		activeNodesJSON = await JSON.stringify($nodes);
		activeEdgesJSON = await JSON.stringify($edges);
		narrativeSectionsJSON = await JSON.stringify(narrativeSections);
		if (await narrativeSectionsJSON) {
			dbformElement.requestSubmit();
		}
	}


	loadNodesAndEdgesFromDB();
	$: setDragModalStyle();
</script>

<section class="grid grid-flow-row grid-cols-5 h-screen overflow-hidden">
	<section class="col-span-4 relative h-screen">
		<!-- Button on the side -->
		<section class="absolute h-screen top-0 left-0 z-50 m-5 w-1/6">
			<a href="/libraries" class=" ">
				<h2 class="text-2xl mt-5 mb-3 text-left md:mx-0 font-semibold text-yellow-500">Kaagada</h2>
			</a>
			<section class="w-full grid grid-cols-2 gap-x-1">
				<Button class="bg-primary-300 w-full my-1" type="submit" on:click={() => saveToDB()}
					><DownloadSolid /></Button
				>
				<Button
					class="bg-primary-300 w-full my-1  "
					type="submit"
					href="/libraries/view/?id={narrative.library_id}"><HomeSolid /></Button
				>

				<Accordion defaultClass="bg-primary-100 w-full max-h-[80vh] overflow-y-auto col-span-2">
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
		<div bind:this={researchMapElement} class="h-full w-full px-0 mb-2 rounded-lg">
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
	<section class="col-span-1 bg-primary-100 pt-4 py-1 px-5 overflow-y-hidden rounded-lg">
		<WritingPanel
			bind:narrativeSections
			bind:title={narrative.title}
			bind:description={narrative.description}
		/>
	</section>
</section>

<svelte:head>
	<title>{narrative.title}</title>
</svelte:head>

<style>
	#dragModal {
		cursor: grab;
	}
</style>
