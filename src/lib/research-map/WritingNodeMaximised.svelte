<script>
	import { Label, Textarea, Input } from 'flowbite-svelte';
	import TextEditor from './TextEditor.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let section;

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

<div class="w-4/6 snap-center mx-auto my-auto h-screen grid grid-cols-4 py-10">
	<section class="col-span-2 my-auto">
		{#await preview}
			Loading...
		{:then preview}
			<img src={preview} alt="preview" class="w-full object-contain" />

			{#if section.annotation}
				<p class="text-grey-200">
					{section.annotation}
				</p>
			{/if}
		{/await}
	</section>
	<section class="col-span-2 p-3 my-auto">
		<Label for="title" class="text-grey-200 mb-1">Title</Label>
		<Input
			id="title"
			type="text"
			class="text-black"
			placeholder="What is the title of this section"
			bind:value={section.title}
		/>
		<TextEditor bind:content={section.bodytext} />
	</section>
</div>
