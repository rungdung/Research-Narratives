// convert to maplibre
import maplibre from 'maplibre-gl';
import * as Turf from '@turf/turf';


export function zoomToFeature(e, map) {
  let point
  // highlightLayer.clearLayers();
  if (e._geometry.type == 'Polygon') {
    point = Turf.centerOfMass(Turf.geometry('Polygon', e._geometry.coordinates))
      .geometry;
  } else if (e._geometry.type == 'MultiPolygon') {
    // get a array of polygons
    point = Turf.centerOfMass(Turf.geometry('MultiPolygon', e._geometry.coordinates))
      .geometry;
  } else if (e._geometry.type == 'LineString') {
    point = Turf.centerOfMass(Turf.geometry('LineString', e._geometry.coordinates))
      .geometry;
  } else if (e._geometry.type == 'MultiLineString') {
    point = Turf.centerOfMass(Turf.geometry('MultiLineString', e._geometry.coordinates))
      .geometry;
  } else if (e._geometry.type == 'Point') {
    point = Turf.geometry('Point', e._geometry.coordinates);
    console.log(point)
  }
  map.flyTo({
    center: point.coordinates,
    zoom: 10,
    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
  });
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