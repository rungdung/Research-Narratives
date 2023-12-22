<script lang="ts">
	import { Card, Badge } from 'flowbite-svelte';
	export let resources;
	export let title;
	export let description;

	// When box is dragged
	const onDragStart = (event: DragEvent, nodeData: any) => {
		if (!event.dataTransfer) {
			return null;
		}
		event.dataTransfer.setData('application/svelteflow', JSON.stringify(nodeData));
		event.dataTransfer.effectAllowed = 'move';
	};
</script>

<section class="h-full">
	<div class="label py-3 text-black">
		<h3 class="text-2xl">{title}</h3>
		<p>{description}</p>
		You can drag these nodes to the pane on the side.
	</div>
	<div class="grid grid-flow-row-dense gap-0 grid-cols-1 h-4/6 overflow-y-scroll">
		{#if resources}
			{#each resources.resources.files as resource}
				<Card class="node col-span-1 p-0 m-1 bg-primary-300	">
					<div class="node" on:dragstart={(event) => onDragStart(event, resource)} draggable={true}>
						<h5>{resource.title}</h5>
						<p>{resource.description}</p>
						<Badge size="xs" class="m-2">{resource.type}</Badge>
					</div>
				</Card>
			{/each}
		{/if}
	</div>
</section>

<style>
	.node {
		color: black;
		font-weight: 700;
		border-radius: 3px;
		cursor: grab;
		width: auto;
		height: fit-content;
	}
</style>
