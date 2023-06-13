// convert to maplibre
import maplibre from 'maplibre-gl';

export function zoomToFeature(e, map) {
  // Create a popup, but don't add it to the map yet.
  const popup = new maplibre.Popup({
    closeButton: false
  });

  // highlightLayer.clearLayers();
  console.log("Zooming to feature");

  map.flyTo({
    center: e.lngLat,
    zoom: 12,
    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
  });
  popup.setLngLat(e.lngLat).addTo(map);

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