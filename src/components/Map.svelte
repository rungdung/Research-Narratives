<svelte:options accessors={true} />

<script context="module">
  export let dbLayer;
  export let map;
</script>

<script>
  //Rewrite in maplibre-gl
  import { onMount } from "svelte";
  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { mapLoadStatus } from "../stores";

  let mapContainer;

  onMount(() => {
    map = new maplibre.Map({
      container: mapContainer,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [78.398438, 21.616579],
      pitch: 0, // pitch in degrees
      bearing: 0, // bearing in degrees
      zoom: 1,
      maxZoom: 14,
      minZoom: 3,
    }).addControl(
      new maplibre.AttributionControl({
        customAttribution: "",
      })
    );
    map.resize();

    map.on("idle", async () => {
      $mapLoadStatus = map.isStyleLoaded();
    });
  });
</script>

<div id="map" bind:this={mapContainer} />

<style>
  #map {
    height: 100vh;
    padding: 0 !important;
    margin: 0 !important;
  }
</style>
