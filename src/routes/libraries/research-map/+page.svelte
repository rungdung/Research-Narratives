<script>
	import { SvelteFlowProvider } from '@xyflow/svelte';

	import { writable } from 'svelte/store';
	import { Modal } from 'flowbite-svelte';
	import Flow from './nodes/Flow.svelte';
	import WritingPanel from './nodes/WritingPanel.svelte';

	import Sidebar from './nodes/Sidebar.svelte';
	import { activeDraggableNode, activeDraggableNodeModal } from './nodes/store';

	export let data;

	// Destructure data object and set up reactivity
	let { session, supabase, researchMap, resources } = data;
	$: ({ session, supabase, researchMap, resources } = data);
	let narrativeSections = researchMap.narrative_sections;
	let title = researchMap.title;
	let description = researchMap.description;
	let researchMapSection;

	const onModalLoad = () => {
		//deactivate div
		researchMapSection.style = 'opacity: 0.5; pointer-events: none';
	};

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
		researchMapSection.style = 'opacity: 1; pointer-events: all';
	};

	$: if ($activeDraggableNodeModal == true) {
		onModalLoad();
	}
</script>

<section class="grid grid-flow-row grid-cols-5 h-[70vh]">
	<section id="sidebar" class="col-span-1 bg-primary-100 py-1 px-3 overflow-y-hidden rounded-lg">
		<Sidebar {resources} {title} {description} />
	</section>
	<section class="col-span-3">
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
		<div bind:this={researchMapSection} class="h-full w-full">
			<SvelteFlowProvider>
				<Flow />
			</SvelteFlowProvider>
		</div>
	</section>
	<section class="col-span-1 bg-primary-100 py-1 px-3 overflow-y-hidden rounded-lg">
		<WritingPanel bind:narrativeSections />
	</section>
</section>

<style>
	#dragModal {
		cursor: grab;
	}
</style>
