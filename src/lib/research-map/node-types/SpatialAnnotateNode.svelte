<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import { Card, Button, Input, Textarea } from 'flowbite-svelte';

	import { activeDraggableNode, activeDraggableNodeModal } from '../store';

	export let data;

	let quote;

	// Destructure data object and set up reactivity
	let { title, description, resource } = data;
	$: ({ title, description, resource } = data);
</script>

<div>
	<Card class="w-40 p-0 text-black gap-2 bg-secondary-50">
		<Handle type="target" position={Position.Left} style="background: #555;" />
		<h5 class="max-w-prose leading-tight z-30">Annotates {title}</h5>

		<Textarea class="max-w-prose leading-tight z-30" bind:value={description} />
		<Handle
			type="source"
			position={Position.Right}
			id="a"
			style="top: 10px; background: #555; size:10px;"
		/>

		<Handle
			type="source"
			position={Position.Right}
			id="b"
			style="bottom: 10px; top: auto; background: #555;"
		/>
		<div class="">
			<Button
				size="xs"
				color="dark"
				class="transform translate-x-1/2 p-1 px-0 "
				href="/libraries/narratives/spatial-annotate/?resource_id={resource.id}"
				>Spatial filter and annotate</Button
			>
			<Button
				size="xs"
				color="dark"
				class="transform translate-x-1/2 p-1 px-0 "
				on:click={() => (
					($activeDraggableNodeModal = true),
					($activeDraggableNode = { title: title, quote: quote, description: description })
				)}>Add to writing section</Button
			>
		</div>
	</Card>
</div>

<style>
	:global(.svelte-flow .svelte-flow__edge path, .svelte-flow__connectionline path) {
		stroke-width: 4;
	}

	:global(.svelte-flow .svelte-flow__handle) {
		width: 15px;
		height: 14px;
		border-radius: 3px;
		background-color: #784be8;
	}
</style>
