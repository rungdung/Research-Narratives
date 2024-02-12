<script>
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	import { PUBLIC_MAPTILER_KEY } from '$env/static/public';
	import { Button } from 'flowbite-svelte';

	import Filter from '$lib/research-map/spatial-annotate/Filter.svelte';

	export let resource;

	let map, appearanceExpression, mapContainer, resourceJSON;

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
			center: resource.center || [0, 0],
			pitch: resource.pitch || 0,
			bearing: resource.bearing || 0,
			zoom: resource.zoom || 3,
			maxZoom: 14,
			minZoom: 3
		});

		// Handling map load event
		try {
			map.on('load', async () => {
				// Download and parse the resource data
				let blob = await downloadResource(resource.url);
				resourceJSON = JSON.parse(await blob.text());
				let geometryType = resourceJSON.features[0].geometry.type,
					type;
				let filter, appearance;

				// Add source and layer to the map
				map.addSource('resource', {
					type: 'geojson',
					data: resourceJSON
				});

				// Set filter and appearance based on geometry type
				if (['Polygon', 'MultiPolygon'].includes(geometryType)) {
					filter = ['==', '$type', 'Polygon'];
					appearance = {
						'fill-color': getRandColor(),
						'fill-opacity': 0.6,
						'fill-outline-color': 'green'
					};
					type = 'fill';
				} else if (['LineString', 'MultiLineString'].includes(geometryType)) {
					filter = ['==', '$type', 'LineString'];
					appearance = {
						'line-color': getRandColor()
					};
					type = 'line';
				} else if (['Point', 'MultiPoint'].includes(geometryType)) {
					filter = ['==', '$type', 'Point'];
					appearance = {
						'fill-color': getRandColor(),
						'fill-opacity': 0.6,
						'fill-outline-color': 'green'
					};
					type = 'fill';
				}

				map.addLayer({
					id: 'resource-layer',
					type: type,
					source: 'resource',
					filter: filter,
					paint: appearance
				});

				// If filter exists already, apply it
				map.setFilter('resource-layer', resource.filterExpression);

				// if map.center does not exist
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

	// Function to get attributes from Nodes

	const onSave = async () => {
		resource.center = map.getCenter();
		resource.bearing = map.getBearing();
		resource.pitch = map.getPitch();
		resource.zoom = map.getZoom();
	};
</script>

<!-- Map and sidebar section -->
<section id="map" class="relative h-full w-full">
	<section id="sidebar" class="absolute top-0 left-0 m-3 grid gap-y-2 z-50 w-1/3">
		<div class="bg-primary-50 rounded-lg p-4">
			<Filter bind:map bind:resourceJSON bind:filterExpression={resource.filterExpression} />
		</div>
		<div class="bg-primary-50 rounded-lg p-4">
			<!-- todo implement component to have view options -->
			<h3 class="pb-2">Viewing Options</h3>
			<p class="text-xs">This zoom level, angle and view-height will be used to render this map when you share the story</p>
			<Button on:click={onSave} color="dark" class="rounded-sm px-1 py-0 mt-2 bg-slate-800"
				>Save view state</Button
			>
		</div>

		<!-- <MapExportPanel bind:map={map} showPrintableArea={true} showCrosshair={false} />  -->
	</section>
	<div bind:this={mapContainer} class="h-full w-full" />
</section>

<!-- Styling -->
<style>
</style>
