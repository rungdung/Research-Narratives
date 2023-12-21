<script>
	import { Card, Input, Textarea, Label } from 'flowbite-svelte';
	export let section;

	console.log(section);
	// Drag and drop nodes
	const onDragOver = (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	// placeholder if there is no display obj attached
	if (!section.displayObj) {
		section.displayObj = {
			title: ''
		};
	}

	// When display obj is dropped into card
	const onDrop = (event) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null;
		}
		section.displayObj = JSON.parse(event.dataTransfer.getData('application/svelteflow'));
	};
</script>

<Card class="node bg-secondary-50 gap-y-2">
	<div on:dragover={onDragOver} on:drop={onDrop}>
		<Input type="text" bind:value={section.title} />
		<Textarea type="text" bind:value={section.bodytext} />
		<Input
			class="bg-primary-200 p-1"
			type="text"
			placeholder="Drag and drop an annotated obj here"
			name="displayObj"
			bind:value={section.displayObj.title}
		/>
	</div>
</Card>
