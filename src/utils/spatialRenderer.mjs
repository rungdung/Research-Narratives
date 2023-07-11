import { uploadedSources } from "../stores";
import maplibre from "maplibre-gl";
import Popup from "../components/MarkerPopup.svelte";
import { map } from "../components/Map.svelte";

export async function loadSpatialData(file, fileName) {
  let layerType, layerName, attributes;
  try {
    let responseData = await fetch(file).then((response) => response.json());
    layerType = responseData.features[0].geometry.type;

    // Get Keys and unique values of the key if categorical
    // assign data type
    // if data or continous, get range
    attributes = Object.entries(responseData.features[0].properties).map(
      ([key, value]) => {
        let dataType;
        let range;
        let uniqueValues = new Set();

        // Check for datatypes
        if (typeof value == "number") {
          dataType = "continuous";
          range = [
            Math.min(...responseData.feature["properties"]),
            Math.max(...responseData.features["properties"]),
          ];
        } else if (typeof value == "string") {
          dataType = "string";
          responseData.features.map((feature) => {
            uniqueValues.add(feature.properties[key]);
          });
        } else if (typeof value == "boolean") {
          dataType = "boolean";
        }

        return {
          name: key,
          dataType: dataType,
          range: range,
          values: Array.from(uniqueValues),
        };
      }
    );
    console.log(attributes);
  } catch (error) {
    alert(error);
  }

  try {
    map.addSource(fileName, {
      type: "geojson",
      data: file,
    });
  } catch (error) {
    alert(error);
  }

  if (layerType == "Point") {
    layerName = fileName + "-point";
    uploadedSources.update((sources) => {
      sources.push({
        fileName: fileName,
        name: layerName,
        type: "Spatial",
        geometry: "Point",
        blob: file,
        attributes: attributes,
        visible: true,
        container: null,
      });
      return sources;
    });

    map.addLayer({
      id: layerName,
      type: "circle",
      source: fileName,
      filter: ["==", "$type", "Point"],
      paint: {
        "circle-radius": 6,
        "circle-color": "#007cbf",
      },
    });
  } else if (layerType == "LineString") {
    layerName = fileName + "-line";
    uploadedSources.update((sources) => {
      sources.push({
        fileName: fileName,
        name: layerName,
        type: "Spatial",
        geometry: "LineString",
        blob: file,
        attributes: attributes,
        visible: true,
        container: null,
      });
      return sources;
    });
    map.addLayer({
      id: layerName,
      type: "line",
      source: fileName,
      filter: ["==", "$type", "LineString"],
      paint: {
        "line-color": "#007cbf",
        "line-width": 2,
      },
    });
  } else if (layerType == "Polygon" || layerType == "MultiPolygon") {
    layerName = fileName + "-fill";
    uploadedSources.update((sources) => {
      sources.push({
        fileName: fileName,
        name: layerName,
        type: "Spatial",
        geometry: "Polygon",
        blob: file,
        attributes: attributes,
        visible: true,
        container: null,
      });
      return sources;
    });
    map.addLayer({
      id: layerName,
      type: "fill",
      source: fileName,
      filter: ["==", "$type", "Polygon"],
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.1,
        "fill-outline-color": "green",
      },
    });
  }

  map.on("click", layerName, function (e) {
    let popupContainer = document.createElement("div");

    // create a new popup component instance
    // and save to object
    new Popup({
      target: popupContainer,
      props: {
        feature: e.features[0],
      },
    });

    // set popup content to html object
    var popup = new maplibre.Popup({ closeOnClick: true })
      .setLngLat(e.lngLat)
      // append div to popup of maplibre
      .setDOMContent(popupContainer)
      .addTo(map);
  });

  // Change cursor style
  map.on("mouseenter", layerName, function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", layerName, function () {
    map.getCanvas().style.cursor = "grab";
  });

  // Extract properties from GeoJSON features
  // for filtering in Filter.svelte
  //loadProperties(file);
}
