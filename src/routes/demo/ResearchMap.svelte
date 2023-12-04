<script>

	import { Background, Svelvet, Node, Group } from 'svelvet';

	import MarkupNode from './nodes/MarkupNode.svelte';
	import NarrativeNode from './nodes/NarrativeNode.svelte';
	import AnnotationNode from './nodes/AnnotationNode.svelte';

	import ShareModal from './ShareModal.svelte';
	import { Button, SpeedDial, SpeedDialButton } from 'flowbite-svelte';
	import { CloseCircleSolid, PenNibSolid, DownloadSolid } from 'flowbite-svelte-icons';
	import { addNewNarrativeNode, addNewAnnotationNode } from '$lib/utils/addNewNodes.mjs';

	import { onDestroy, onMount } from 'svelte';

	import {connections, uploadedSources, markupNodes, annotationNodes, narrativeNodes} from '../../stores';
	
	export let supabase;	

	let mnodesCopy = [],
		anodesCopy = [];

	let width, height;

	async function handleConnection(e) {
		let sourceNodeId =
			e.detail.sourceNode.id.split('-')[1] + '-' + e.detail.sourceNode.id.split('-')[2];
		let sourceAnchorId = e.detail.sourceAnchor.id.replace('A-', '').split('/')[0];
		let targetNodeId =
			e.detail.targetNode.id.split('-')[1] + '-' + e.detail.targetNode.id.split('-')[2];
		let targetAnchorId = e.detail.targetAnchor.id.replace('A-', '').split('/')[0];

		// For Sets to deep compare objects, they need to be stringified
		connections.add(
			JSON.stringify({
				sourceNodeId,
				sourceAnchorId,
				targetNodeId,
				targetAnchorId
			})
		);
	}

	async function saveConnections() {
		// go through markup nodes, search for sourceId and append to conenctions

		try {
			// https://stackoverflow.com/a/51537887
			$connections.forEach((connection) => {
				let index;
				connection = JSON.parse(connection);
				anodesCopy = annotationNodes;
				mnodesCopy = markupNodes;

				if (connection.sourceNodeId.split('-')[0] == 'annotationNode') {
					index = $annotationNodes.findIndex((node) => node.id == connection.sourceNodeId);
					let connectionToPush = [connection.targetNodeId, connection.targetAnchorId];
					if (connection.sourceAnchorId == 'images') {
						anodesCopy[index].dataConnections.push(connectionToPush);
					} else {
						anodesCopy[index].connections.push(connectionToPush);
					}
				}

				if (connection.sourceNodeId.split('-')[0] == 'markupNode') {
					index = $markupNodes.findIndex((node) => node.id == connection.sourceNodeId);
					let connectionToPush = [connection.targetNodeId, connection.targetAnchorId];
					if (connection.sourceAnchorId == 'data') {
						mnodesCopy[index].dataConnections.push([
							connection.targetNodeId,
							connection.targetAnchorId
						]);
					} else {
						mnodesCopy[index].connections.push(connectionToPush);
					}
				}
			});
		} catch (err) {
			console.log(err);
		}
	}

	onDestroy(() => {
		saveConnections();
	});

	onMount(() => {
		if (mnodesCopy.length > 0) {
			$markupNodes.set(mnodesCopy);
		}
		if (anodesCopy.length > 0) {
			$annotationNodes.set(anodesCopy);
		}
	});
</script>

<section id="research-map" bind:clientHeight={height} bind:clientWidth={width}>
	<Svelvet
		edgeStyle="bezier"
		raiseEdgesOnSelect
		{height}
		{width}
		zoom={0.6}
		on:connection={handleConnection}
	>
		<Background bgColor="#faebd7" slot="background" />
		{#each $markupNodes as markupNode (markupNode.id)}
			<MarkupNode {markupNode} />
		{/each}
		{#each $narrativeNodes as narrativeNode (narrativeNode.id)}
			<NarrativeNode node={narrativeNode} />
		{/each}
		{#each $annotationNodes as annotationNode (annotationNode.id)}
			<AnnotationNode {annotationNode} />
		{/each}
	</Svelvet>

	<SpeedDial
		color="dark"
		class="absolute bottom-0 left-2 "
		placement="top"
		tooltip="none"
		popperDefaultClass="flex items-left gap-2"
	>
		<PenNibSolid
			slot="icon"
			fill="currentColor"
			class="w-8 h-8"
			viewBox="0 0 20 20"
			svgClass="text-white"
			size="10"
		/>
		<SpeedDialButton
			name="Add new section for the data story"
			on:click={addNewNarrativeNode}
			class="ml-3 w-40"
		/>
		<SpeedDialButton on:click={addNewAnnotationNode} class="ml-3 w-40" name="Add new media" />
	</SpeedDial>
</section>

<section id="research-map-menu" class="text-center">
	<Button
		size="xs"
		class="px-2 py-1 rounded-md"
		color="dark"
		on:click={() => {
			$markupNodes.set([]);
			$narrativeNodes.set([]);
		}}
	>
		<CloseCircleSolid svgClass="dark mx-1" />
		Clear all data
	</Button>
	<!-- <Button
    color="dark"
    size="xs"
    class="px-2 py-1 rounded-md"
    on:click={saveConnections}
    ><DownloadSolid svgClass="dark mx-1" />
    Save changes locally
  </Button> -->
	<ShareModal {supabase} />
</section>

<style>
	#research-map {
		height: 80%;
		width: 100%;
	}
</style>
