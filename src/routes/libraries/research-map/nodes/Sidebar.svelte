<script lang="ts">
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

<h3>{title}</h3>
<p>{description}</p>
<div class="label">You can drag these nodes to the pane below.</div>
<div class="grid grid-flow-row-dense gap-0 grid-cols-1">
	{#if resources}
		{#each resources.resources.files as resource}
			<div
				class="input-node node col-span-1"
				on:dragstart={(event) => onDragStart(event, resource)}
				draggable={true}
			>
				<h5>{resource.title}</h5>
				<p>{resource.description}</p>
			</div>
		{/each}
	{/if}
</div>

<style>
	.label {
		margin: 1rem 0;
		font-size: 0.9rem;
		color: black;
	}

	.node {
		margin: 0.5rem;
		border: 1px solid #111;
		padding: 0.5rem 1rem;
		color: black;
		font-weight: 700;
		border-radius: 3px;
		cursor: grab;
		width: auto;
		height: fit-content;
	}
</style>
