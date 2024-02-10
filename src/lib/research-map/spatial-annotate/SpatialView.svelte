<script>
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	import { PUBLIC_MAPTILER_KEY } from '$env/static/public';

	export let resource;

	let map, filterExpression, appearanceExpression, mapContainer, resourceJSON;
	filterExpression = resource.filterExpression;

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
		// Calculate the initial center, zoom, and pitch by subtracting from the final values
		const initialCenter = {lat:resource.center.lat - 0.005, lng: resource.center.lng - 0.005};
		const initialZoom = resource.zoom - 6;
		const initialPitch = resource.pitch - 5;

		console.log(resource, initialZoom, initialPitch);
		// Map initialization

		// Map initialization
		map = new maplibre.Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/47780736-e784-40ca-9f2e-6da4248ada51/style.json?key=${PUBLIC_MAPTILER_KEY}`,
			center: initialCenter || [0, 0],
			pitch: initialPitch || 0,
			bearing: resource.bearing || 0,
			zoom: initialZoom || 3,
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

				map.flyTo({
					center: resource.center,
					zoom: resource.zoom,
					pitch: resource.pitch,
					bearing: resource.bearing
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
<section id="map" class="relative h-full w-full">
	<div bind:this={mapContainer} class="h-full w-full" />
</section>

<!-- Styling -->
<style>
</style>
