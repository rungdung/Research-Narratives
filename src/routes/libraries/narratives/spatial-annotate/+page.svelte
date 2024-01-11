<script>
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';
	import { PUBLIC_MAPTILER_KEY } from '$env/static/public';
	import { supabase } from '$lib/supabaseClient.js';
	import Filter from '$lib/research-map/spatial-annotate/Filter.svelte';

	export let data;
	let resource, map, attributes, filterExpression, appearanceExpression, mapContainer;

	// Destructuring data to get the resource
	$: ({ resource, attributes } = data);

	// $: filterExpression = resource.filter;
	// $: appearanceExpression = resource.appearance;

	// Color settings
	const colorsOG = ['#6E07EB', '#00CAF5', '#5FDE43', '#F5C83D', '#EB533B'];
	let colors = colorsOG.map((color) => color);

	// Function to get a random color
	function getRandColor() {
		let selectedColor;
		let randIndex = Math.floor(Math.random() * colors.length);
		if (colors.length > 0) {
			selectedColor = colors[randIndex];
			colors.splice(randIndex, 1);
		} else {
			colors = colorsOG.map((color) => color);
			selectedColor = colors[randIndex];
			colors.splice(randIndex, 1);
		}
		return selectedColor;
	}

	// Initialization on mount
	onMount(() => {
		// Map initialization
		map = new maplibre.Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/47780736-e784-40ca-9f2e-6da4248ada51/style.json?key=${PUBLIC_MAPTILER_KEY}`,
			center: [78.398438, 21.616579],
			pitch: 0,
			bearing: 0,
			zoom: 1,
			maxZoom: 14,
			minZoom: 3
		});

		// Handling map load event
		try {
			map.on('load', async () => {
				// Download and parse the resource data
				let blob = await downloadResource(resource.url);
				let data = JSON.parse(await blob.text());
				let geometryType = data.features[0].geometry.type;
				let filter, appearance;

				// Set filter and appearance based on geometry type
				if (['Polygon', 'MultiPolygon'].includes(geometryType)) {
					filter = ['==', '$type', 'Polygon'];
					appearance = {
						'fill-color': getRandColor(),
						'fill-opacity': 0.6,
						'fill-outline-color': 'green'
					};
				} else if (['LineString', 'MultiLineString'].includes(geometryType)) {
					filter = ['==', '$type', 'LineString'];
					appearance = {
						'line-color': getRandColor()
					};
				} else if (['Point', 'MultiPoint'].includes(geometryType)) {
					filter = ['==', '$type', 'Point'];
					appearance = {
						'fill-color': getRandColor(),
						'fill-opacity': 0.6,
						'fill-outline-color': 'green'
					};
				}

				// Add source and layer to the map
				map.addSource('resource', {
					type: 'geojson',
					data: data
				});
				map.addLayer({
					id: 'resource-layer',
					type: 'fill',
					source: 'resource',
					filter: filter,
					paint: appearance
				});
			});
		} catch (e) {
			console.log(e);
		}
	});

	// Function to download resource from Supabase storage
	const downloadResource = async (path) => {
		try {
			const { data, error } = await supabase.storage.from('resources').download(path);
			if (error) {
				throw error;
			}
			return data;
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading resource: ', error.message);
			}
		}
	};
</script>

<!-- Map and sidebar section -->
<section id="map" class="h-screen w-screen">
	<section id="sidebar" class="absolute top-0 left-0 m-3 z-50 bg-primary-50 p-4 rounded-lg">
		<Filter bind:map bind:attributes bind:filterExpression />
	</section>
	<div bind:this={mapContainer} class="h-full w-full" />
</section>

<!-- Styling -->
<style>
</style>
