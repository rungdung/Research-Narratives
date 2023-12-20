<script>
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		useNodes,
		useEdges,
		useSvelteFlow
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';

	import SourceNodes from './SourceNodes.svelte';
	import ContextMenu from './ContextMenu.svelte';

	// Initial state of node to load
	export let nodes = writable([]),
		edges = writable([]);
	export let dbformElement;

	let menu, width, height;

	// Get active nodes and edges from SvelteFlow internal store
	let activeNodes = useNodes(),
		activeEdges = useEdges(),
		activeNodesJSON,
		activeEdgesJSON;

	$: activeNodesJSON = JSON.stringify($activeNodes);
	$: activeEdgesJSON = JSON.stringify($activeEdges);

	// Register custom nodes
	const nodeTypes = {
		sourceNode: SourceNodes
	};

	// Drag and drop nodes
	const onDragOver = (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	// Data transfer from nodes dropped into the pane
	const onDrop = (event) => {
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
			type: 'sourceNode',
			position,
			data: { title: `${data.title}`, description: `${data.description}`, resource: data },
			origin: [0.5, 0.0]
		};

		$nodes.push(newNode);
		$nodes = $nodes;
	};

	// Drag and Drop position conversion
	const { screenToFlowPosition } = useSvelteFlow();

	// Context menu
	function handleContextMenu({ detail: { event, node } }) {
		// Prevent native context menu from showing
		event.preventDefault();

		// Calculate position of the context menu. We want to make sure it
		// doesn't get positioned off-screen.
		menu = {
			id: node.id,
			top: event.clientY < height - 200 ? event.clientY : undefined,
			left: event.clientX < width - 200 ? event.clientX : undefined,
			right: event.clientX >= width - 200 ? width - event.clientX : undefined,
			bottom: event.clientY >= height - 200 ? height - event.clientY : undefined
		};

		console.log(menu, event.clientX, event.clientY, width, height);
	}

	// Close the context menu if it's open whenever the window is clicked.
	function handlePaneClick() {
		menu = null;
	}
</script>

<section id="flow" class="h-full" bind:clientWidth={width} bind:clientHeight={height}>
	<SvelteFlow
		bind:nodes
		bind:edges
		{nodeTypes}
		fitView
		nodesDraggable={true}
		on:dragover={onDragOver}
		on:drop={onDrop}
		on:nodecontextmenu={handleContextMenu}
		on:paneclick={handlePaneClick}
	>
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		{#if menu}
			<ContextMenu
				onClick={handlePaneClick}
				id={menu.id}
				top={menu.top}
				left={menu.left}
				right={menu.right}
				bottom={menu.bottom}
			/>
		{/if}
		<MiniMap />
		<form bind:this={dbformElement} use:enhance action="?/updateResearchMap" method="post">
			<input type="hidden" id="nodes" name="nodes" bind:value={activeNodesJSON} />
			<input type="hidden" id="edges" name="edges" bind:value={activeEdgesJSON} />
		</form>
	</SvelteFlow>
</section>
