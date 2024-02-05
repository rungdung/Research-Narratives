<script lang="ts">
	import { Card, Badge } from 'flowbite-svelte';
	export let resources;

	// When box is dragged
	const onDragStart = (event: DragEvent, nodeData: any) => {
		if (!event.dataTransfer) {
			return null;
		}
		event.dataTransfer.setData('application/svelteflow', JSON.stringify(nodeData));
		event.dataTransfer.effectAllowed = 'move';
	};
</script>

<div class="grid grid-flow-row-dense gap-0 grid-cols-1 p-0">
	{#if resources}
		{#each resources as resource}
			<Card class="node col-span-1 p-0 m-1  bg-primary-300	">
				<div class="node" on:dragstart={(event) => onDragStart(event, resource)} draggable={true}>
					<h5 class="mb-2">{resource.title}</h5>
					<p class="text-sm text-normal">{resource.description}</p>
					<Badge size="xs" class="m-2">{resource.type}</Badge>
				</div>
			</Card>
		{/each}
	{/if}
</div>

<style>
	.node {
		color: black;
		border-radius: 3px;
		cursor: grab;
		height: fit-content;
	}
</style>
