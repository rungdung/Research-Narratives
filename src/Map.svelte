<svelte:options accessors={true} />

<script context="module">
  export let map;
  export let dbLayer;
</script>

<script>
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import "leaflet";
  import "leaflet.markercluster";
  import "leaflet.markercluster/dist/MarkerCluster.css";
  import "leaflet.markercluster/dist/MarkerCluster.Default.css";

  import Popup from "./MarkerPopup.svelte";

  // Custom icon for Leaflet markers
  var iconSettings = {
    mapIconUrl:
      '<?xml version="1.0" encoding="UTF-8"?><svg id="d" xmlns="http://www.w3.org/2000/svg" width="30" height="auto" viewBox="0 0 179.368 176.383"><path d="m179.02,106.984l-.667-6.639c-2.492-12.952-9.617-24.553-20.042-32.633-11.702-9.702-26.937-14.051-41.997-11.987-15.144,1.066-29.174,8.34-38.774,20.1-10.451,12.785-14.65,26.618-12.485,42.606l2.788,50.013c.667,6.639,3.711,9.127,9.741,7.963l54.603-7.161c13.775-1.942,25.39-8.697,34.846-20.264,9.953-12.176,13.543-26.507,11.987-41.997Z" fill="#303030"/><path d="m247.058,187.759l-3.985-4.352c-8.553-7.795-19.413-11.921-30.549-11.605-12.838-.098-25.125,5.691-33.869,15.957-9.332,9.602-6.996,20.498-6.987,34.502,0,15.232,8.038,25.845,18,36l17.543,38.298c3.985,4.352,7.305,4.352,10.626,0l16.831-38.298c7.969-9.429,27-31.219,27-45,0-14.507-5.313-15.347-14.61-25.502Z" fill="#2d84cb"/><path d="m125.895,21.883l-6-6C107.016,5.135,90.664-.552,73.895-.117c-19.331-.135-37.832,7.846-51,22C8.843,35.122.882,53.576.895,72.883c0,21,7,38,22,52l43,47c6,6,11,6,16,0l48-51c12-13,18-29,18-48,0-20-8-37-22-51Z" fill="#3184c6"/><circle cx="75.129" cy="69.872" r="37.619" fill="#fff"/><circle cx="73.895" cy="73.883" r="2" fill="#fff"/></svg>',
    mapIconColor: "#cc756b",
    mapIconColorInnerCircle: "#fff",
    pinInnerCircleRadius: 28,
  };
  var divIcon = L.divIcon({
    className: "leaflet-data-marker",
    html: L.Util.template(iconSettings.mapIconUrl, iconSettings), //.replace('#','%23'),
    iconAnchor: [12, 32],
    iconSize: [25, 30],
    popupAnchor: [0, -28],
  });

  onMount(() => {
    // Initialize Leaflet map
    map = L.map("map", {
      renderer: L.canvas(),
    }).setView([13.086066, 77.609997], 7);

    // Add OpenStreetMap tiles
    var tileLayer = L.tileLayer(
      "https://api.mapbox.com/styles/v1/rungdung/clftq8tyw001r01nwuzgk0gic/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicnVuZ2R1bmciLCJhIjoiY2tqeWh6cXF4MDgzMjJvbWVmbGQzYjAwMyJ9.U-aJyoqyKvTXlhVk43jV1A",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Mapbox Imagery',
        maxZoom: 20,
        minZoom: 3,
        maxBounds: [
          [12.846638, 77.125397],
          [13.283409, 78.016663],
        ],
        renderer: L.canvas(),
      }
    );
    tileLayer.addTo(map);

    // Initialize a layer group for comments
    dbLayer = L.markerClusterGroup().addTo(map);

    loadSavedData();
  });

  export async function loadSavedData() {
    // load geojson data
    const response = await fetch("HWdb_geocoded.geojson");
    var data = await response.json();

    // add geojson layer from db
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.setIcon(divIcon);
        let popupContainer = document.createElement("div");
        new Popup({
          target: popupContainer,
          props: {
            title: feature.properties.title,
            date: feature.properties.date,
            link: feature.properties.link,
            excerpt: feature.properties.excerpt,
            feature: feature,
          },
        });
        layer.bindPopup(popupContainer);
      },
    }).addTo(dbLayer);
  }
</script>

<main>
  <div id="map" />
</main>

<style>
  #map {
    height: 100vh;
    width: 100vw;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Change cursor when mousing over clickable layer */
  .leaflet-clickable {
    cursor: crosshair !important;
  }
  /* Change cursor when over entire map */
  .leaflet-container {
    cursor: help !important;
  }

  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: transparent;
    transform: translate(10%, 5%);
    box-shadow: 0 0 0 0 !important;
  }

  .leaflet-popup-close-button {
    transform: translate(-78px, 40px);
  }

  .btn {
    margin: 0.04em;
  }

  .popup {
    width: 800px;
  }

  .leaflet-popup-content {
    width: 400px !important;
  }
  .leaflet-popup-content-wrapper {
    min-height: 40vh;
  }

  .btn-sm {
    padding: 0.1em 0.3em !important;
  }
</style>
