<script>
	import { Card, Input, Textarea } from 'flowbite-svelte';
	export let section;

	// Drag and drop nodes
	const onDragOver = (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	// Data transfer from nodes dropped into the pane
	let dataTransferred;
	let title;

	const onDrop = (event) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null;
		}
		dataTransferred = JSON.parse(event.dataTransfer.getData('application/svelteflow'));
		title = dataTransferred.title;
	};
</script>

<Card class="node bg-secondary-50 gap-y-2">
	<div on:dragover={onDragOver} on:drop={onDrop}>
		<Input type="text" bind:value={section.title} />
		<Textarea type="text" bind:value={section.bodytext} />
		<Input type="text" bind:value={title} />
	</div>
</Card>
