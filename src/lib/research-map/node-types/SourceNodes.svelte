<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import { Card, Button, Badge } from 'flowbite-svelte';
	import { supabase } from '$lib/supabaseClient.js';

	import { activeDraggableNode, activeDraggableNodeModal } from '../store';

	export let data;

	let preview;

	// Get preview
	const downloadResource = async (path) => {
		try {
			const { data, error } = await supabase.storage.from('resources').download(path);

			if (error) {
				throw error;
			}

			return URL.createObjectURL(data);
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}
	};
</script>

<div>
	<Card class="w-60 p-0 text-black bg-primary-300">
		<Handle type="target" position={Position.Left} style="background: #555;" />
		<h5 class="max-w-prose leading-tight z-30">{data.title}</h5>
		<p class="text-xs pt-2">{data.description}</p>
		{#if ['jpg', 'png', 'jpeg'].includes(data.resource.type)}
			{#await (preview = downloadResource(data.resource.url))}
				Loading...
			{:then preview}
				<img src={preview} alt="preview" class="w-60 object-contain" />
			{/await}
		{/if}
		<Badge size="xs" class="m-2">{data.resource.type}</Badge>
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
