<script>
	/**
	 * Initialize the map and handle resource fetching and display based on spatialEnabled and resource properties.
	 * @param {Object} resource - The resource object containing details like id, filterExpression, center, zoom, pitch, bearing.
	 * @param {Blob} resourceBlob - The blob containing the resource data.
	 * @param {boolean} spatialEnabled - Flag indicating if spatial is enabled.
	 */
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';

	import { PUBLIC_MAPTILER_KEY } from '$env/static/public';

	export let resource;
	export let resourceBlob;
	export let spatialEnabled;

	let map, filterExpression, appearanceExpression, mapContainer, resourceJSON;
	filterExpression = resource?.filterExpression || '';

	let addedSources = [];

	// Color settings
	const colorsOG = ['#6E07EB', '#00CAF5', '#5FDE43', '#F5C83D', '#EB533B'];
	let colors = colorsOG.map((color) => color);

	/**
	 * Get a random color from the colors array and remove it from the array.
	 * @returns {string} - Random color from the colors array.
	 */
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

	/**
	 * Fetch the resource data from the provided blob and parse it.
	 * @param {Blob} resourceBlob - The blob containing the resource data.
	 */
	const resourceFetch = async (resourceBlob) => {
		await fetch(resourceBlob).then(async (response) => {
			resourceJSON = await response.json();
		});
	};

	const addLayer = async () => {
		await resourceFetch(resourceBlob);
		// Handling map load event
		if (!addedSources.includes(resource.id) && !map.getLayer(resource.id)) {
			// Download and parse the resource data
			let geometryType = resourceJSON.features[0].geometry.type,
				type;
			let filter, appearance;

			// Add source and layer to the map
			map.addSource(resource.id, {
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
				id: resource.id + 'resource-layer',
				type: type,
				source: resource.id,
				filter: filter,
				paint: appearance
			});

			// If filter exists already, apply it
			map.setFilter(resource.id + 'resource-layer', resource.filterExpression);

			addedSources.push(resource.id);
		}

		if (resource?.center)
			map.flyTo({
				center: resource.center,
				zoom: resource.zoom,
				pitch: resource.pitch,
				bearing: resource.bearing
			});
	};

	/**
	 * Event handler for map initialization and resource loading.
	 */
	onMount(async () => {
		// Map initialization
		map = new maplibre.Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/47780736-e784-40ca-9f2e-6da4248ada51/style.json?key=${PUBLIC_MAPTILER_KEY}`,
			center: [0, 0],
			pitch: 0,
			bearing: 0,
			zoom: 3,
			maxZoom: 14,
			minZoom: 3,
			transformRequest: (url) => {
				// cache header
				return {
					url: url,
					cache: 'force-cache'
				};
			}
		});
	});

	/**
	 * Fetch the resource data if the resourceBlob is provided.
	 */
	$: if (resourceBlob && spatialEnabled) {
		addLayer();
	}
</script>

<!-- Map and sidebar section -->
<section id="map" class="relative h-full w-full">
	<div bind:this={mapContainer} class="h-full w-full" />
</section>

<!-- Styling -->
<style>
</style>
