import React from 'react';
import L, { popup } from 'leaflet';
import 'leaflet-path-drag';

import 'leaflet/dist/leaflet.css';
import { ICON_SRCS } from '../sidebar/DrawingLayerToolTabControlState';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapLayerTool } from '../../map';

/**
 * @author Andrej Tlcina
 */

/**
 * extends marker so we can change its options while marker tool is enabled
 */
L.Draw.ExtendedMarker = L.Draw.Marker.extend({
  setIconOptions: function (iconOpts) {
    this.options.icon = iconOpts;
  },
});

/**
 * icon options default
 */
export const iconStarter = {
  shadowUrl: null,
  iconAnchor: new L.Point(12, 12),
  iconSize: new L.Point(24, 24),
};

// * opted for this approach instead of extending L.Icon
// * it led to some bugs/errors and this way we have an access to icon options
const iconOptions = {
  ...iconStarter,
};

/**
 * enables creation of markers
 *
 * @param {Object} map
 * @param {Object} sidebar
 * @param {Boolean} connectClick
 * @returns
 */
export const markerCreate = (map, sidebar, connectClick = false) => {
  const additionalOpts = { iconUrl: sidebar.getState().getSelectedIcon(), connectClick };
  const icon = new L.Icon({ ...iconOptions, ...additionalOpts });
  const { guideLayers } = sidebar.getState();

  const x = new L.Draw.ExtendedMarker(map, {
    icon,
    draggable: true,
    transform: true,
    repeatMode: true,
    guideLayers,
    snapVertices: false,
  });
  if (x) sidebar.getState().setEnabledEl(x);
  x.enable();
  return x;
};

/**
 * enables creation of topology
 *
 * @param {Object} map
 * @param {Object} sidebar
 */
export const connectClick = (map, sidebar) => {
  const marker = markerCreate(map, sidebar, true);
};

/**
 * append marker on map with given latlng
 *
 * @param {Object} featureGroup
 * @param {*} latlng
 * @param {String} popup
 * @param {String} iconUrl
 * @param {Boolean} connectClick
 * @returns {Layer}
 */
export const putMarkerOnMap = (featureGroup, latlng, popup, iconUrl, connectClick = false) => {
  const additionalOpts = { iconUrl: iconUrl || ICON_SRCS[0], connectClick };
  const icon = new L.Icon({
    ...iconOptions,
    ...additionalOpts,
  });

  let marker = new L.Marker.Touch(latlng, { icon });
  if (popup) {
    marker.bindPopup(popup, { closeOnClick: false, autoClose: false });
    marker.popupContent = popup;
  }

  marker.layerType = 'marker';
  console.log({ marker });
  featureGroup.addLayer(marker);
  // map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
  return marker;
};

/**
 * sends request to OSM with given query
 *
 * @param {Object} featureGroup
 * @param {String} query
 * @returns
 */
export const geoSearch = async (featureGroup, query = '') => {
  if (!query) return;

  // setup
  const provider = new OpenStreetMapProvider();

  // search
  const results = await provider.search({ query });

  return results;
};
