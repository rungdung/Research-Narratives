<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		useSvelteFlow,
		type Node
	} from '@xyflow/svelte';
	import Sidebar from './Sidebar.svelte';

	import '@xyflow/svelte/dist/style.css';

	let nodes = writable([]),
		edges = writable([]);

	const { screenToFlowPosition } = useSvelteFlow();

	export let resources;
	export let title;
	export let description;

	// Drag and drop nodes
	const onDragOver = (event: DragEvent) => {
		event.preventDefault();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	// Data transfer from nodes dropped into the pane
	const onDrop = (event: DragEvent) => {
		event.preventDefault();

		if (!event.dataTransfer) {
			return null;
		}

		const data = JSON.parse(event.dataTransfer.getData('application/svelteflow'));

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		});

		const newNode = {
			id: `${Math.random()}`,
			position,
			data: { label: `${data.title} \n ${data.description} ` },
			origin: [0.5, 0.0]
		} satisfies Node;

		$nodes.push(newNode);
		$nodes = $nodes;
	};
</script>

<main class="">
	<section class="grid grid-rows-auto grid-flow-row grid-cols-4 h-full">
		<section id="sidebar" class="col-span-1 bg-primary-100 py-1 px-3 rounded-lg">
			<Sidebar {resources} {title} {description} />
		</section>
		<section id="flow" class="col-span-3">
			<SvelteFlow {nodes} {edges} fitView on:dragover={onDragOver} on:drop={onDrop}>
				<Controls />
				<Background variant={BackgroundVariant.Dots} />
				<MiniMap />
			</SvelteFlow>
		</section>
	</section>
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		color: black;
		flex-direction: column-reverse;
	}
</style>
