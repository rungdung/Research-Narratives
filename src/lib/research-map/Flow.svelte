<script>
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

	import SourceNodes from './node-types/SourceNodes.svelte';
	import TextAnnotateNode from './node-types/TextAnnotateNode.svelte';
	import SpatialAnnotateNode from './node-types/SpatialAnnotateNode.svelte';
	import ContextMenu from './ContextMenu.svelte';

	// Initial state of node to load
	export let nodes, edges;
	export let dbformElement;

	let menu, width, height;

	// Get active nodes and edges from SvelteFlow internal store
	let activeNodes = useNodes(),
		activeEdges = useEdges(),
		activeNodesJSON,
		activeEdgesJSON;

	$: activeNodesJSON = JSON.stringify($activeNodes);
	$: activeEdgesJSON = JSON.stringify($activeEdges);

	// To detect new node creation handle drags
	let connectingNodeId;

	// Register custom nodes
	const nodeTypes = {
		sourceNode: SourceNodes,
		textAnnotateNode: TextAnnotateNode,
		spatialAnnotateNode: SpatialAnnotateNode
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
	}

	// Close the context menu if it's open whenever the window is clicked.
	function handlePaneClick() {
		menu = null;
	}

	// Create a new annotation node when the user drags a node handle
	function handleConnectEnd(event) {
		if (connectingNodeId === null) return;

		// Get data of the dragged node
		const node = $nodes.find((n) => n.id === connectingNodeId);

		// Depending on the resource data type, provide different annotation nodes
		let nodeType = 'textAnnotateNode';
		switch (node.data.resource.type) {
			case 'gpkg':
			case 'geojson':
				nodeType = 'spatialAnnotateNode';
				break;
		}

		// See if connection landed inside the flow pane
		const targetIsPane = event.target?.classList.contains('svelte-flow__pane');
		if (targetIsPane) {
			const id = `${Math.random()}`;
			const newNode = {
				id,
				data: {
					title: node.data.title,
					description: 'test',
					resource: node.data.resource
				},
				type: nodeType,
				// project the screen coordinates to pane coordinates
				position: screenToFlowPosition({
					x: event.clientX,
					y: event.clientY
				}),
				// set the origin of the new node so it is centered
				origin: [0.5, 0.0]
			};
			$nodes.push(newNode);
			$edges.push({
				source: connectingNodeId,
				target: id,
				id: `${connectingNodeId}--${id}`
			});

			$nodes = $nodes;
			$edges = $edges;
		}
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
		fitViewOptions={{ padding: 2 }}
		onconnectstart={(_, { nodeId }) => {
			// Memorize the nodeId you start draggin a connection line from a node
			connectingNodeId = nodeId;
		}}
		onconnectend={handleConnectEnd}
	>
		<Controls position={'top-right'} />
		<Background bgColor={'#f5d0b9'} patternClass={BackgroundVariant.Dots} size={2} />
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

<style>
	:global(.svelte-flow__controls-button) {
		background-color: #f5d0b9;
	}
</style>
