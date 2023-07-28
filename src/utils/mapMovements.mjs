// convert to maplibre
import maplibre from "maplibre-gl";
import * as Turf from "@turf/turf";

/**
 * Zooms to a given set of features on the map.
 * If the feature is a collection, it will zoom to the extent of the collection
 * It will also create a popup with the feature's name
 * @param {object} feature - Feature to zoom to
 * @param {string} featureSource - Source name of the feature
 * @param {object} map - MapLibre GL JS map object
 * @param {string} type - Single feature or collection to zoom to. Filtered results are collections
 * @returns
 */
export function zoomToFeature(feature, featureSource, map, type = "singular") {
  let point, geometry;
  if (type == "singular") {
    geometry = feature._geometry ? feature._geometry : feature.geometry;
  }
  if (type == "collection") {
    console.log(featureSource);
    geometry = map.getSource(featureSource); //._data.features[0].geometry;
    let bbox = Turf.bbox(geometry._data);
    map.fitBounds(bbox);
    return;
  }

  // highlightLayer.clearLayers();
  if (geometry.type == "Polygon") {
    point = Turf.centerOfMass(
      Turf.geometry("Polygon", geometry.coordinates)
    ).geometry;
  } else if (geometry.type == "MultiPolygon") {
    // get a array of polygons
    point = Turf.centerOfMass(
      Turf.geometry("MultiPolygon", geometry.coordinates)
    ).geometry;
  } else if (geometry.type == "LineString") {
    point = Turf.centerOfMass(
      Turf.geometry("LineString", geometry.coordinates)
    ).geometry;
  } else if (geometry.type == "MultiLineString") {
    point = Turf.centerOfMass(
      Turf.geometry("MultiLineString", geometry.coordinates)
    ).geometry;
  } else if (geometry.type == "Point") {
    point = Turf.geometry("Point", geometry.coordinates);
    console.log(point);
  }
  map.flyTo({
    center: point.coordinates,
    zoom: 10,
    speed: 1,
    curve: 2,
    easing(t) {
      return t;
    },
  });

  new maplibre.Marker()
    .setLngLat(point.coordinates)
    .setPopup(
      new maplibre.Popup({
        focusAfterOpen: false,
      }).setHTML(
        `<h3>${feature.properties.title || feature.properties.name}</h3><p>${
          feature.properties.description
        }</p>`
      )
    )
    .addTo(map)
    .togglePopup();
  // this animation is considered essential with respect to prefers-reduced-motion
}
