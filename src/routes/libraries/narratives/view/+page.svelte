<script>
	import { supabase } from '$lib/supabaseClient';
	import Scroller from '@sveltejs/svelte-scroller';

	import { fly, blur } from 'svelte/transition';
	import SpatialView from '$lib/research-map/spatial-annotate/SpatialView.svelte';

	export let data;
	let preview;

	let index = 1; // int index of currently active foreground DOM element
	let offset; // float offset of currently active foreground DOM element - 0 to 1 value
	let progress; // float how far along the whole scrolly we currently are - 0 to 1 value
	let count; // int total num steps (=DOM elements) of the foreground

	let top = 0; // The vertical position that the top of the foreground must scroll past before the background becomes fixed, as a proportion of window height
	let bottom = 1; // Once the bottom of the foreground passes this point, the background becomes unfixed
	let threshold = 0.5; // Once a foreground step is this much visible in viewport, it becomes 'active'

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
</script>

<div class="text-black h-screen overflow-y-auto grid place-items-center py-3">
	<div class="w-3/4">
		<h1>{data.narrative.title}</h1>
		{@html data.narrative.description}
	</div>
</div>
<Scroller {top} {bottom} {threshold} bind:index bind:offset bind:progress bind:count>
	<div slot="background">
		{#if data.narrative.narrative_sections[index]}
			{#if ['jpg', 'png', 'jpeg'].includes(data.narrative.narrative_sections[index].displayObj.type)}
				{#await (preview = downloadResource(data.narrative.narrative_sections[index].displayObj.url))}
					Loading...
				{:then preview}
					<div transition:blur={{ duration: 200 }}>
						<img src={preview} alt="preview" class="h-screen object-contain ml-auto" />

						{#if data.narrative.narrative_sections[index].annotation}
							<p class="text-grey-200">
								{data.narrative.narrative_sections[index].annotation}
							</p>
						{/if}
					</div>
				{/await}
			{:else if ['geojson'].includes(data.narrative.narrative_sections[index].displayObj.type)}
				<section class="h-[100vh] w-[100vw]">
					<SpatialView bind:resource={data.narrative.narrative_sections[index].displayObj} />
				</section>
			{/if}
		{/if}
	</div>
	<div class="snap-y snap-mandatory" slot="foreground">
		{#each data.narrative.narrative_sections as section}
			<div
				class="snap-top bg-opacity-70 ml-10 py-10 min-h-screen w-1/3 text-black bg-primary-50 rounded-lg"
			>
				<section class="p-3 my-auto">
					<h2 class="text-3xl">{section.title}</h2>
					{@html section.bodytext}
				</section>
			</div>
		{/each}
	</div>
</Scroller>
