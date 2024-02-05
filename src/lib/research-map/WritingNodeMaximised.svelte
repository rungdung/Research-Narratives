<script>
	import { Label, Textarea, Input } from 'flowbite-svelte';
	import TextEditor from './TextEditor.svelte';

	import { supabase } from '$lib/supabaseClient';

	import StandAloneSpatialAnnotate from './spatial-annotate/StandAloneSpatialAnnotate.svelte';

	export let section;
	let preview

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
	$: if (section?.displayObj?.url && !preview) {
		preview = downloadResource(section.displayObj.url);
	}
</script>

<div class="w-full relative  snap-center mx-auto my-auto h-screen grid grid-cols-4 py-10">
	<section class="col-span-2 relative my-auto">
		{#if section?.displayObj?.url}
			{#if ['jpg', 'png', 'jpeg'].includes(section.displayObj.type)}
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
			{:else if ['geojson'].includes(section?.displayObj?.type)}
				<section class="h-[100vh] w-[50vw]">
					<StandAloneSpatialAnnotate bind:resource={section.displayObj} />
				</section>
			{:else}
				Previewing this file type is not yet supported
			{/if}
		{:else}
			You have not selected a resource to display here yet
		{/if}
	</section>
	<section class="col-span-2 p-3 w-[70%] mx-auto my-auto">
		<Label for="title" class="text-grey-200 mb-1 z-20">Title</Label>
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
