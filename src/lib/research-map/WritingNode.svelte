<script>
	import { Card, Input, Textarea, CloseButton, Label, Modal, Button } from 'flowbite-svelte';
	import { supabase } from '$lib/supabaseClient';

	export let section;
	let preview;

	// Drag and drop nodes
	const onDragOver = (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	// When display obj is dropped into card
	const onDrop = (event) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null;
		}
		section.displayObj = JSON.parse(event.dataTransfer.getData('application/svelteflow')).resource;
		section.annotation = JSON.parse(
			event.dataTransfer.getData('application/svelteflow')
		).annotation;

		// if display obj is spatial, delete attributes
		if (section?.displayObj?.type == 'geojson') {
			delete section.displayObj.attributes;
		}
	};

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

	// Load the preview url into a var
	$: if (section?.displayObj?.url) {
		preview = downloadResource(section.displayObj.url);
	}
</script>

<Card class="node relative bg-secondary-50 gap-y-2 p-2 min-h-[20vh]" padding="none">
	<div on:dragover={onDragOver} on:drop={onDrop} class="px-3 pb-2 h-full grid grid-cols-2">
		{#if section?.displayObj?.url}
			{#if ['jpg', 'png', 'jpeg'].includes(section.displayObj.type)}
				{#await preview}
					Loading...
				{:then preview}
					<img src={preview} alt="preview" class="h-full object-contain p-1" />
				{/await}
			{:else}
				<div class=" m-auto p-1 text-sm text-wrap">
					{section?.displayObj?.type} file type is currently not supported for rendering
				</div>
			{/if}
		{:else}
			<Textarea
				class="bg-primary-200 p-1 text-wrap"
				defaultClass="inline"
				type="text"
				placeholder="Drag and drop an annotated obj here"
				name="displayObj"
				bind:value={section.displayObj.title}
			/>
		{/if}
		<Textarea
			id="title"
			type="text"
			class="text-black"
			placeholder="What is the title of this section"
			bind:value={section.title}
		/>
	</div>
</Card>
