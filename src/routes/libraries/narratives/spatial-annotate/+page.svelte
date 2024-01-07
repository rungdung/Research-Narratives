<script>
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';
	import { PUBLIC_MAPTILER_KEY } from '$env/static/public';
	import { supabase } from '$lib/supabaseClient.js';

	export let data;
	let resource;
	let map;
	$: ({ resource } = data);

	let mapContainer;

	onMount(() => {
		map = new maplibre.Map({
			container: mapContainer,
			style:
				'https://api.maptiler.com/maps/47780736-e784-40ca-9f2e-6da4248ada51/style.json?key=' +
				PUBLIC_MAPTILER_KEY,
			center: [78.398438, 21.616579],
			pitch: 0, // pitch in degrees
			bearing: 0, // bearing in degrees
			zoom: 1,
			maxZoom: 14,
			minZoom: 3
		});

		map.on('load', async () => {
			let blob = await downloadResource(resource.url);
			let data = JSON.parse(await blob.text());
			map.addSource('resource', {
				type: 'geojson',
				data: data
			});
			map.addLayer({
				id: 'resource',
				type: 'fill',
				source: 'resource'
			});
		});
	});

	const downloadResource = async (path) => {
		try {
			const { data, error } = await supabase.storage.from('resources').download(path);

			if (error) {
				throw error;
			}
			console.log(data);

			return data;
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}
	};
</script>

<section id="map" class="h-screen w-screen">
	<div bind:this={mapContainer} class="h-full w-full" />
</section>

<style>
</style>
