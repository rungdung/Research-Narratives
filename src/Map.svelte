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

  import Popup from "./MarkerPopup.svelte";
  import defaultDB from "./assets/HWdb_geocoded.geojson";

  let mapContainer;

  onMount(() => {
    map = new maplibre.Map({
      container: mapContainer,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [78.486328, 10.297698],
      pitch: 60, // pitch in degrees
      bearing: 30, // bearing in degrees
      zoom: 7,
      maxZoom: 10,
      minZoom: 3,
    }).addControl(
      new maplibre.AttributionControl({
        customAttribution: "Hindutva Watch Database",
      })
    );

    map.on("load", () => {
      loadSavedData();
    });
  });

  export async function loadSavedData() {
    map.addSource("dbLayer", {
      type: "geojson",
      data: defaultDB,
    });

    map.addLayer({
      id: "dbLayer",
      type: "circle",
      source: "dbLayer",
      paint: {
        "circle-radius": 5,
        "circle-color": "#ff0000",
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    map.on("click", "dbLayer", function (e) {
      console.log(e.features[0].properties.title);
      let popupContainer = document.createElement("div");
      new Popup({
        target: popupContainer,
        props: {
          title: e.features[0].properties.title,
          date: e.features[0].properties.date,
          link: e.features[0].properties.link,
          excerpt: e.features[0].properties.excerpt,
          feature: e.features[0],
        },
      });
      var popup = new maplibre.Popup({ closeOnClick: true })
        .setLngLat(e.lngLat)
        // append div to popup of maplibre
        .setDOMContent(popupContainer)
        .addTo(map);
    });

    map.on("mouseenter", "defaultDB", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "defaultDB", function () {
      //revert to normal cursor style
      map.getCanvas().style.cursor = "grab";
    });
  }
</script>

<main>
  <div id="map" bind:this={mapContainer} />
</main>

<style>
  #map {
    height: 100vh;
    width: 100vw;
    padding: 0 !important;
    margin: 0 !important;
  }

  .btn {
    margin: 0.04em;
  }

  .popup {
    width: 800px;
  }

  .btn-sm {
    padding: 0.1em 0.3em !important;
  }
</style>
