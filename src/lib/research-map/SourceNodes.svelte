<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import { Card, Button } from 'flowbite-svelte';

	import { activeDraggableNode, activeDraggableNodeModal } from './store';

	export let data;
	export let isConnectable;

	// Destructure data object and set up reactivity
	let { title, description, resource } = data;
	$: ({ title, description, resource } = data);
</script>

<div>
	<Card class="w-40 p-0 text-black bg-primary-300">
		<Handle type="target" position={Position.Left} style="background: #555;" {isConnectable} />
		<h5 class="max-w- leading-tight z-30">{title}</h5>
		<p class="text-xs pt-2">{description}</p>
		<Handle
			type="source"
			position={Position.Right}
			id="a"
			style="top: 10px; background: #555; size:10px;"
			{isConnectable}
		/>

		<Handle
			type="source"
			position={Position.Right}
			id="b"
			style="bottom: 10px; top: auto; background: #555;"
			{isConnectable}
		/>
		<Button
			size="xs"
			color="dark"
			class="transform translate-x-1/2 p-1 px-0 m-"
			on:click={() => (($activeDraggableNodeModal = true), ($activeDraggableNode = resource))}
			>Add to writing section</Button
		>
	</Card>
</div>

<style>
	:global(.svelte-flow__node-selectorNode) {
		font-size: 12px;
		background: #eee;
		border: 1px solid #555;
		border-radius: 5px;
		text-align: center;
	}

	.dragger {
		color: black;
		font-weight: 700;
		border-radius: 3px;
		cursor: grab;
		width: auto;
		height: fit-content;
	}
</style>
