<script>
	import Scroller from '@sveltejs/svelte-scroller';

	import { fly, blur } from 'svelte/transition';
	import SpatialView from '$lib/research-map/spatial-annotate/SpatialView.svelte';
	import { onMount } from 'svelte';

	export let data;
	let supabase = data.supabase;
	$: supabase = data.supabase;

	// Variables for the Scrolly
	let index = 0; // int index of currently active foreground DOM element
	let offset; // float offset of currently active foreground DOM element - 0 to 1 value
	let progress; // float how far along the whole scrolly we currently are - 0 to 1 value
	let count; // int total num steps (=DOM elements) of the foreground

	let top = 0; // The vertical position that the top of the foreground must scroll past before the background becomes fixed, as a proportion of window height
	let bottom = 1; // Once the bottom of the foreground passes this point, the background becomes unfixed
	let threshold = 0.4; // Once a foreground step is this much visible in viewport, it becomes 'active'

	let spatialPreview,
		spatialEnabled = false,
		mediaEnabled = false,
		preview;

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

	/**
	 * Load data for the given index
	 * @param {number} index - The index of the data to load
	 */
	const loadData = async (index) => {
		// If spatial data
		// enable display and set spatialPreview
		if (data.narrative.narrative_sections[index].displayObj.type == 'geojson') {
			spatialPreview = data.narrative.narrative_sections[index].preview;
			spatialEnabled = true;
			mediaEnabled = false;
		} else if (
			['jpg', 'png', 'jpeg'].includes(data.narrative.narrative_sections[index].displayObj.type)
		) {
			preview = data.narrative.narrative_sections[index].preview;
			spatialEnabled = false;
			mediaEnabled = true;
		} else {
			spatialEnabled = false;
			mediaEnabled = false;
		}
	};

	/**
	 * Extract previews for all narrative sections
	 */
	const extractPreviews = async () => {
		await Promise.all(
			data.narrative.narrative_sections.map(async (section) => {
				if (section.displayObj.url) {
					section.preview = await downloadResource(section.displayObj.url);
				}
			})
		);
	};

	onMount(async () => {
		await extractPreviews();
		await loadData(0);
	});

	$: if (data) {
		loadData(index);
	}
</script>

<div class="text-black h-screen overflow-y-auto grid place-items-center mb-10">
	<div class="w-3/4">
		<h1>{data.narrative.title}</h1>
		{@html data.narrative.description}
	</div>
</div>

<Scroller {top} {bottom} {threshold} bind:index bind:offset bind:progress bind:count>
	<div slot="background">
		{#if mediaEnabled}
			<div transition:blur={{ duration: 200 }}>
				<img src={preview} alt="preview" class="h-screen object-contain ml-auto" />
				{#if data.narrative.narrative_sections[index].annotation}
					<p class="text-grey-200">
						{data.narrative.narrative_sections[index].annotation}
					</p>
				{/if}
			</div>
		{/if}
		<section
			transition:blur={{ duration: 200 }}
			class="h-[100vh] w-[100vw] {spatialEnabled ? '' : 'hidden'}"
		>
			<SpatialView
				bind:resource={data.narrative.narrative_sections[index].displayObj}
				bind:resourceBlob={data.narrative.narrative_sections[index].preview}
				bind:spatialEnabled
			/>
		</section>
	</div>
	<div class="snap-y snap-mandatory" slot="foreground">
		{#each data.narrative.narrative_sections as section}
			<div
				class="snap-center bg-opacity-70 ml-10 py-10 min-h-screen w-1/3 text-black bg-primary-50 rounded-lg"
			>
				<section class="p-3 my-auto">
					<h2 class="text-3xl">{section.title}</h2>
					{@html section.bodytext}
				</section>
			</div>
		{/each}
	</div>
</Scroller>
<footer
	class="bg-transparent text-yellow-900 text-left py-40 px-2 sm:px-10 md:w-3/4 md:mx-auto grid grid-cols-1 sm:grid-cols-2"
>
	<div>
		This data-narrative has been developed using <a
			class="text-left md:mx-0 font-semibold pt-4 text-yellow-500 hover:text-yellow-400"
			href=""
		>
			<h2 class="text-3xl">Kaagada</h2>
		</a>
		<p class="pt-2 text-yellow-500 w-3/4">
			Write, annotate, draw and share, all in one place. Kaagadha emerged from a vision to promote
			responsible data use in research and communication. It's a collaborative tool for
			multidisciplinary writing or research projects that convey data patterns.
			<br />
		</p>
	</div>
	<div id="links" class="py-2 sm:py-0 sm:text-right">
		Email at adhavan[dot]sivaraj16[at]gmail[dot]com
		<div id="roadmap" class="py-5">
			<button
				href="https://github.com/rungdung/research-narratives"
				class="bg-gray-900 text-white py-2 px-2 rounded-lg hover:bg-gray-300 hover:text-black transition duration-300"
				>Github
			</button>
		</div>
	</div>
</footer>

<svelte:head>
	<title>Story: {data.narrative.title}</title>
</svelte:head>
