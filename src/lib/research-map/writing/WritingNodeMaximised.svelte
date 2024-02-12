<script>
	import { Label, Textarea, Input } from 'flowbite-svelte';
	import TextEditor from './TextEditor.svelte';
	import SpatialAnnotate from '$lib/research-map/spatial-annotate/SpatialAnnotate.svelte';

	/**
	 * Component to display a section of the writing
	 * @param {any} section - The section to display
	 */
	export let section;

</script>

<div
	class="w-full relative snap-center mx-auto my-auto h-screen grid grid-cols-4"
	id="section-{section.id}"
>
	<section class="col-span-2 relative my-auto">
		{#if section?.displayObj?.url}
			{#if ['jpg', 'png', 'jpeg'].includes(section.displayObj.type) && section.preview}
				<img src={section.preview} alt="preview" class="w-full object-contain" />
				{#if section.annotation}
					<p class="text-grey-200">
						{section.annotation}
					</p>
				{/if}
			{:else if ['geojson'].includes(section?.displayObj?.type)}
				<section class="h-[100vh] w-[50vw]">
					<SpatialAnnotate bind:resource={section.displayObj} />
				</section>
			{:else}
				Previewing this file type is not yet supported
			{/if}
		{:else}
			<div class="w-50 text-center text-wrap">
				You have not selected a resource to display here yet
			</div>
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
