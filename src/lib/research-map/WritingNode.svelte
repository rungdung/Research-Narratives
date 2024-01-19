<script>
	import { Card, Input, Textarea, CloseButton, Label, Modal, Button } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { supabase } from '$lib/supabaseClient';

	import TextEditor from '$lib/research-map/TextEditor.svelte';
	import WritingNodeMaximised from '$lib/research-map/WritingNodeMaximised.svelte';

	export let section;

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
	// to avoid rerendering when other properties of the object
	let previewUrl = section.displayObj.url;
	$: previewUrl = section.displayObj.url;
	let preview;

	$: preview = downloadResource(previewUrl);
</script>

<Card class="node relative bg-secondary-50 gap-y-2 p-2 " padding="none">
	<div on:dragover={onDragOver} on:drop={onDrop} class="px-3 pb-2 h-full grid grid-cols-2">
		{#if ['jpg', 'png', 'jpeg'].includes(section.displayObj.type) && section.displayObj.url}
			{#if section.displayObj.url}
				{#await preview}
					Loading...
				{:then preview}
					<img src={preview} alt="preview" class="h-full object-contain p-1" />
				{/await}
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
		{:else}
			<div class=" m-auto p-1 text-sm text-wrap">
				{section.displayObj.type} file type is currently not supported for rendering
			</div>
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
