import "leaflet";

export function zoomToFeature(e, highlightLayer, map) {
    let feature = e.feature;
   // highlightLayer.clearLayers();
    console.log("Zooming to feature");

    // Add a circle marker to highlight the feature
    highlightLayer.addLayer(
      new L.CircleMarker(feature.geometry.coordinates.reverse(), {
        radius: 30,
        color: "#ff7800",
        weight: 5,
        opacity: 0.65,
      })
    );

    map.flyTo(feature.geometry.coordinates, 4);
    highlightLayer.addTo(map);
  }

export function highlightAllFeatures(highlightLayer, map, selectedFeatures) {
    //highlightLayer.clearLayers();
    console.log("Zooming to feature");

    selectedFeatures.forEach((feature) => {
      highlightLayer.addLayer(
        new L.CircleMarker(feature.feature.geometry.coordinates.reverse(), {
          radius: 30,
          color: "#ff7800",
          weight: 5,
          opacity: 0.9,
        })
      );
    });

    // map.flyTo(feature.geometry.coordinates, 8);
    highlightLayer.addTo(map);
  }