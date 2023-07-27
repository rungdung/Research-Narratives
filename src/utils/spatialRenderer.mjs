import { uploadedSources } from "../stores";
import maplibre from "maplibre-gl";
import Popup from "../components/MarkerPopup.svelte";
import { map } from "../components/Map.svelte";
import { kml } from "@tmcw/togeojson";

export async function fileConvert(file, fileName, fileType) {
  switch (fileType) {
    case "kml":
      let fileUrl = URL.createObjectURL(file);
      let response = await fetch(fileUrl);
      let data = kml(
        new DOMParser().parseFromString(await response.text(), "text/xml")
      );
      return new Blob([JSON.stringify(data)], { type: "application/json" });
  }
export async function loadSpatialData(
  file,
  fileName,
  fileUrl,
  appearanceExpression,
  DBload = false
) {
  let layerType, layerName, attributes, responseData;

  // Fetch from URL
  try {
    responseData = await fetch(fileUrl).then((response) => response.json());
    layerType = responseData.features[0].geometry.type;
  } catch (error) {
    console.log(error);
  }

  // Add as source
  try {
    map.addSource(fileName, {
      type: "geojson",
      data: fileUrl,
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

    if (appearanceExpression) {
      map.setPaintProperty(layerName, "circle-color", appearanceExpression);
    }
  } else if (layerType == "LineString" || layerType == "MultiLineString") {
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
    if (appearanceExpression) {
      map.setPaintProperty(layerName, "line-color", appearanceExpression);
    }
  } else if (layerType == "Polygon" || layerType == "MultiPolygon") {
    layerName = fileName + "-fill";

    map.addLayer({
      id: layerName,
      type: "fill",
      source: fileName,
      filter: ["==", "$type", "Polygon"],
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.6,
        "fill-outline-color": "green",
      },
    });

    if (appearanceExpression) {
      map.setPaintProperty(layerName, "fill-color", appearanceExpression);
    }
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
          let range, numericValues;
          let uniqueValues = new Set();

          // Check for datatypes
          if (typeof value == "number") {
            dataType = "numeric";
            numericValues = responseData.features.map(
              (feature) => feature.properties[key]
            );
            range = [
              Math.round(Math.min(...numericValues) * 10) / 10,
              Math.round(Math.max(...numericValues) * 10) / 10,
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
            numericValues: numericValues,
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
        dbURL: fileUrl,
        type: "Spatial",
        appearanceExpression: null,
        geometry: layerType,
        attributes: attributes,
        visible: true,
        container: null,
      });
      return sources;
    });
  }
}
