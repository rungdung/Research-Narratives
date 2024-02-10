<script>
	import { Card, Textarea, Button } from 'flowbite-svelte';
	import { supabase } from '$lib/supabaseClient';
	import { PenSolid } from 'flowbite-svelte-icons';

	/**
	 * Component to display a section of the writing
	 * @param {any} section - The section to display
	 * @param {boolean} maximise - Whether to maximise the section
	 * @param {number} scrollPosition - The scroll position
	 */
	export let section;
	export let maximise;

	/**
	 * The preview of the section
	 */
	let preview;

	/**
	 * Handles the drag over event for drag and drop functionality
	 * @param {Event} event - The drag over event
	 */
	const onDragOver = (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	/**
	 * Handles the drop event when display obj is dropped into card
	 * @param {Event} event - The drop event
	 */
	const onDrop = (event) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null; // No data transfer, do nothing
		}
		// Parse the display object and annotation from the dropped data
		section.displayObj = JSON.parse(event.dataTransfer.getData('application/svelteflow')).resource;
		section.annotation = JSON.parse(
			event.dataTransfer.getData('application/svelteflow')
		).annotation;

		// if display obj is spatial, delete attributes
		if (section?.displayObj?.type == 'geojson') {
			delete section.displayObj.attributes; // Delete attributes if the display obj is spatial
		}
	};

	/**
	 * Downloads a resource from the specified path
	 * @param {string} path - The path of the resource to download
	 * @returns {Promise<string>} - The URL of the downloaded resource
	 */
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

<Card
	class="node relative bg-secondary-50 p-2 min-h-[20vh] hover:text-gray-500 hover:bg-primary-100"
	padding="none"
	on:click={() => (maximise = true)}
	href="#section-{section.id}"
>
	<div on:dragover={onDragOver} on:drop={onDrop} class="px-3  pb-2 h-full grid grid-rows-auto">
		<div class="row-span-2">
		<h3 class="text-sm pt-3 font-bold h-fit">
			{#if section?.title}
				{section.title}
			{:else}
				There is no title for this section of the narrative
			{/if}
		</h3>
		<p class="text-xs">
			{#if section.bodytext!=''}
				{@html section.bodytext.substring(0,100)+'...'}
			{:else}
				There is no bodytext for this section of the narrative
			{/if}
		</p>
	</div>
		{#if section?.displayObj?.url}
			<div class="relative bg-primary-50 my-2 align-center rounded-lg text-xs row-span-5 text-wrap ">
				{#if ['jpg', 'png', 'jpeg'].includes(section.displayObj.type)}
					{#await preview}
						Loading...
					{:then preview}
						<img src={preview} alt="preview" class="object-contain p-0 rounded-lg" />
					{/await}
				{:else}
					<p class="m-4">`{section?.displayObj?.type}` file type is currently not supported for rendering.</p>
				{/if}
			</div>
		{:else}
			<Textarea
				class="bg-primary-200 row-span-5 flex-col-grow p-1  text-wrap"
				defaultClass="inline text-xs"
				type="text"
				placeholder="Drag and drop a resource from the canvas here"
				name="displayObj"
				bind:value={section.displayObj.title}
			/>
		{/if}
	</div>
</Card>
