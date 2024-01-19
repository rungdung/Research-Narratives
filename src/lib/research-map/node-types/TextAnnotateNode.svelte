<script lang="ts">
	import { Handle, Position, useSvelteFlow } from '@xyflow/svelte';
	import { Card, Button, Input, Textarea } from 'flowbite-svelte';

	import { activeDraggableNode, activeDraggableNodeModal } from '../store';

	export let data;
	export let id;
	export let isConnectable;
	const { updateNodeData } = useSvelteFlow();
</script>

<div>
	<Card class="w-40 p-0 text-black gap-2 bg-secondary-50">
		<Handle type="target" position={Position.Left} style="background: #555;" {isConnectable} />
		<h5 class="max-w-prose leading-tight z-30" />
		<Textarea
			class="max-w- leading-tight z-30"
			bind:value={data.title}
			on:input={(evt) => updateNodeData(id, { text: evt.currentTarget.value })}
			placeholder={'Quote a section to annotate'}
		/>
		<Textarea
			class="max-w-prose leading-tight z-30"
			bind:value={data.description}
			on:input={(evt) => updateNodeData(id, { text: evt.currentTarget.value })}
		/>
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
		<div class="">
			<Button
				size="xs"
				color="dark"
				class="transform translate-x-1/2 p-1 px-0 "
				on:click={() => (
					($activeDraggableNodeModal = true),
					($activeDraggableNode = {
						title: data.title,
						annotation: data.description,
						resource: data.resource
					})
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
