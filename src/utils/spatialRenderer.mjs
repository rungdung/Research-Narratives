import { uploadedSources } from "../stores";
import maplibre from "maplibre-gl";
import Popup from "../components/MarkerPopup.svelte";
import { map } from "../components/Map.svelte";

export async function loadSpatialData(
  file,
  fileName,
  fileDBUrl,
  DBload = false
) {
  let layerType, layerName, attributes, responseData;

  // Check if file is from DB or local
  if (DBload == true) {
    file = fileDBUrl;
  }

  try {
    responseData = await fetch(file).then((response) => response.json());
    layerType = responseData.features[0].geometry.type;
  } catch (error) {
    console.log(error);
  }

  // Add as source
  try {
    map.addSource(fileName, {
      type: "geojson",
      data: file,
    });
  } catch (error) {
    alert(error);
    return;
  }

  // Add as layer depending on geometry type
  if (layerType == "Point") {
    layerName = fileName + "-point";
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

  map.on("mouseenter", layerName, function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", layerName, function () {
    map.getCanvas().style.cursor = "grab";
  });

  if (DBload == false) {
    // Get Keys and unique values of the key if categorical assign data type
    // if continuous, get range
    try {
      attributes = Object.entries(responseData.features[0].properties).map(
        ([key, value]) => {
          let dataType;
          let range;
          let uniqueValues = new Set();

          // Check for datatypes
          if (typeof value == "number") {
            dataType = "continuous";
            let values = responseData.features.map(
              (feature) => feature.properties[key]
            );
            range = [
              Math.round(Math.min(...values) * 10) / 10,
              Math.round(Math.max(...values) * 10) / 10,
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
    } catch (error) {
      console.log(error);
    }

    uploadedSources.update((sources) => {
      sources.push({
        fileName: fileName,
        name: layerName,
        dbURL: fileDBUrl,
        type: "Spatial",
        geometry: layerType,
        blob: file,
        attributes: attributes,
        visible: true,
        container: null,
      });
      return sources;
    });
  }
}
