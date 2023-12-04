<svelte:options accessors={true} />

<script context="module">
	export let dbLayer;
	export let map;
</script>

<script>
	//Rewrite in maplibre-gl
	import { onMount } from 'svelte';
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	import { PUBLIC_MAPTILER_KEY } from '$env/static/public';

	import { loadSources } from '$lib/utils/loadFromDB.mjs';
	import { loadedSources } from '../../stores';

	import Alert from '../../lib/Alerts.svelte';

	export let uploadedSources;

	let mapContainer;

	let sourceLoading = new Set(),
		sourceLoaded = new Set();

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

		map.on('load', () => {
			if(uploadedSources.length > 0) {
				loadSources(uploadedSources);
			}
			
		});

		map.on('sourcedataloading', (e) => {
			if (e.sourceId != sourceLoading) {
				//check if source exists in uploaded sources
				if (
					uploadedSources.find((source) => {
						return source.fileName == e.sourceId;
					})
				) {
					sourceLoading.add(e.sourceId);
					sourceLoading = sourceLoading;
				}
			}
		});

		map.on('sourcedata', (e) => {
			if (
				uploadedSources.find((source) => {
					return source.fileName == e.sourceId;
				})
			) {
				if (e.sourceId != $loadedSources) {
					$loadedSources.add(e.sourceId);
					$loadedSources = $loadedSources;
				}
			}
		});

		map.resize();
	});
</script>

<div id="map" bind:this={mapContainer} />

{#key sourceLoading.size}
	<Alert pos="bottom" content="{Array.from(sourceLoading).pop()} is loading" />
{/key}

{#key $loadedSources.size}
	<Alert pos="bottom" content="{Array.from($loadedSources).pop()} is loaded" />
{/key}

<style>
	#map {
		height: 100vh;
		padding: 0 !important;
		margin: 0 !important;
	}
</style>
