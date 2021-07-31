import { DrawnObject, GeoFeature, LatLngs, TurfPolygon } from './../model/types/index';
import L, { LatLng } from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import 'leaflet/dist/leaflet.css';

import { STROKES, COLORS, normalStyles } from './constants';

import * as turf from '@turf/turf';
import { LooseObject } from '../model/types';

type StyleOptions = { [key: string]: string | boolean };

/**
 * @author Andrej Tlcina
 */

/**
 * maps feature types to leaflet types
 *
 * @param {String} feature
 * @returns
 */
export const getLeafletTypeFromFeature = (
  feature: GeoJSON.Feature,
): 'polygon' | 'polyline' | 'marker' | '' => {
  switch (feature?.geometry?.type) {
    case 'Polygon':
      return 'polygon';
    case 'LineString':
      return 'polyline';
    case 'Point':
      return 'marker';
    default:
      return '';
  }
};

/**
 * converts GeoJSON properties to Leaflet options
 *
 * @param {Object} properties
 * @returns
 */
export const convertPropertiesToOptions = (properties: LooseObject): StyleOptions => {
  const options: LooseObject = { draggable: true, transform: true };
  if (!properties) return options;
  options.weight = properties['stroke-width'] || STROKES[1].value;
  options.color = properties['fill'] || COLORS[0];
  options.fillOpacity = properties['fill-opacity'] || normalStyles.fillOpacity;
  options.opacity = properties['stroke-opacity'] || normalStyles.opacity;

  return options;
};

/**
 * converts Leaflet options to GeoJSON properties
 *
 * @param {Object} properties
 * @returns
 */
export const convertOptionsToProperties = (options: StyleOptions): LooseObject => {
  const properties: LooseObject = { draggable: true, transform: true };
  properties['stroke-width'] = options.weight || STROKES[1].value;
  properties['fill'] = options.color || COLORS[0];
  // * so we don't save selected polygon
  properties['fill-opacity'] = normalStyles.fillOpacity;
  properties['stroke-opacity'] = normalStyles.opacity;

  return properties;
};

/**
 * returns GeoJSON representation, always array of them
 * used in case of selected layer, which can be 'Multi' object
 */
export const getGeoJSONFeatures = (layer: DrawnObject): Array<GeoJSON.Feature> | null => {
  if (!layer) return null;
  const drawnGeoJSON = layer.toGeoJSON();
  const feature =
    drawnGeoJSON.type === 'FeatureCollection' ? drawnGeoJSON.features : [drawnGeoJSON];
  return feature;
};

/**
 * gets GeoJSON representation from layer structure
 * gets only first one, because 'Multi' object is not expected to be created
 *
 * @param {Layer} layer
 * @returns
 */
export const getFirstGeoJSONFeature = (layer: DrawnObject): GeoJSON.Feature | null => {
  if (!layer) return null;
  const geoFeatures = getGeoJSONFeatures(layer);
  const feature = geoFeatures ? geoFeatures[0] : null;
  return feature;
};

/**
 * checks if feature is polygon
 */
export const isFeaturePoly = (
  feature: GeoJSON.Feature | GeoJSON.FeatureCollection | null,
): boolean => {
  if (!feature) return false;
  if (feature?.type === 'FeatureCollection') {
    const f = feature.features[0];
    return f?.geometry?.type === 'Polygon' || f?.geometry?.type === 'MultiPolygon';
  }
  return feature?.geometry?.type === 'Polygon' || feature?.geometry?.type === 'MultiPolygon';
};

/**
 * simplifies polygon feature according to pixels
 */
export const simplifyFeature = (feature: turf.AllGeoJSON, pixels?: number): turf.AllGeoJSON => {
  const tolerance = pixels || window.customTolerance;

  const result = turf.simplify(feature, { tolerance });
  return result;
};

/**
 * checks if layer structure is polygon
 *
 * @param {Layer} layer
 * @returns
 */
export const isLayerPoly = (layer: DrawnObject): boolean => {
  const feature = getFirstGeoJSONFeature(layer);
  return feature ? isFeaturePoly(feature) : false;
};

export const getConversionDepth = (feature: GeoJSON.Feature | null): 1 | 2 => {
  let depth: 1 | 2 = 1;
  if (feature?.geometry?.type === 'MultiPolygon') {
    depth = 2;
  }
  return depth;
};

export const convertCoords = (feature: GeoFeature): LatLng | LatLngs | null => {
  if (!feature) return null;

  const coords = feature.geometry.coordinates;
  const depth = getConversionDepth(feature);

  if (feature.geometry.type === 'Point') {
    return L.GeoJSON.coordsToLatLng(coords as [number, number] | [number, number, number]);
  } else if (feature.geometry.type === 'LineString') {
    return L.GeoJSON.coordsToLatLngs([coords], 1);
  } else {
    return L.GeoJSON.coordsToLatLngs(coords, depth);
  }
};

/**
 * helper function for morphing GeoJSON feature to Polygon {Layer} structure
 */
export const morphFeatureToPolygon = (feature, options = {}, simplify = false) => {
  const depth = getConversionDepth(feature);
  const simplified = simplify ? simplifyFeature(feature) : feature;
  const coords = simplified.geometry.coordinates;
  const latlngs = L.GeoJSON.coordsToLatLngs(coords, depth);
  const result = new L.polygon(latlngs, {
    ...options,
    draggable: true,
    transform: true,
  });
  result.layerType = 'polygon';
  if (result.dragging) result.dragging.disable();
  return result;
};