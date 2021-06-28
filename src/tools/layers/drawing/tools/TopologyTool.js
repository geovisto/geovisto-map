import React from 'react';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import MarkerTool from './MarkerTool';
import { normalStyles } from '../util/Poly';

class TopologyTool extends MarkerTool {
  constructor(props) {
    super(props);
    this.leafletMap.on('draw:created', this.createdListener);
  }

  // TODO:
  createdListener = (e): void => {
    let layer = e.layer;

    let isConnect = this.drawingTool.getState().isConnectMarker(layer);

    if (isConnect) {
      this.plotTopology();
    }
  };

  static NAME(): string {
    return 'topology-drawing-tool';
  }

  getName(): string {
    return TopologyTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-sitemap';
  }

  getTitle(): string {
    return 'Topology drawing tool';
  }

  result = (): string => {
    return 'marker';
  };

  canBeCanceled = (): boolean => {
    return true;
  };

  enable = (): void => {
    this._redrawSidebar(this.result);
    this._markerCreate(true);
  };

  plotTopology(chosen = null): void {
    console.log('run');
    const toolState = this.drawingTool.getState();
    const selectedLayer = toolState.selectedLayer;

    const layersObj = toolState.featureGroup._layers;
    const layerArr = [...Object.values(layersObj)];
    const allConnected = layerArr.filter((_) => toolState.isConnectMarker(_)).reverse();
    const _markers = chosen || allConnected;
    // console.log({ _markers });
    const index = 0;
    // * chronologically the last created
    const firstMarker = _markers[index];

    const selectedLayerIsConnectMarker = toolState.selectedLayerIsConnectMarker();

    // * choose selected object or the second to last created
    const secondMarker =
      selectedLayerIsConnectMarker && !chosen ? selectedLayer : _markers[index + 1];
    if (secondMarker) {
      const { lat: fLat, lng: fLng } = firstMarker.getLatLng();
      const { lat: sLat, lng: sLng } = secondMarker.getLatLng();

      // * create vertice
      let _latlng = [L.latLng(fLat, fLng), L.latLng(sLat, sLng)];
      let poly = new L.polyline(_latlng, {
        color: '#563412',
        weight: 3,
        ...normalStyles,
      });
      poly.layerType = 'vertice';
      if (!this._haveSameVertice(poly)) {
        toolState.pushVertice(poly);
        toolState.addLayer(poly);
      }
    }

    this._mapMarkersToVertices(_markers);
  }

  /**
   * @brief loops through each of the vertices and checks if
   *        vertice with certain coordinates is already created
   */
  _haveSameVertice(current: object): boolean {
    const found = this.drawingTool.getState().createdVertices.find((vertice) => {
      return (
        (vertice.getLatLngs()[0].equals(current.getLatLngs()[0]) &&
          vertice.getLatLngs()[1].equals(current.getLatLngs()[1])) ||
        (vertice.getLatLngs()[0].equals(current.getLatLngs()[1]) &&
          vertice.getLatLngs()[1].equals(current.getLatLngs()[0]))
      );
    });

    return Boolean(found);
  }

  /**
   * @brief maps through each of the markes and if its coordinates fit vertice's coordinates
   *        then vertice is mapped onto marker id
   */
  _mapMarkersToVertices(_markers: object[]): void {
    const toolState = this.drawingTool.getState();

    _markers
      .map((marker) => ({ latlng: marker.getLatLng(), lId: marker._leaflet_id, marker }))
      .forEach(({ latlng, lId }) => {
        toolState.createdVertices.forEach((vertice, index) => {
          // * used indexing instead of another loop (vertices have only 2 points)

          let spread = toolState.mappedMarkersToVertices[lId] || {};
          // * depending on if first or second latlng of vertice matches with marker's latlng
          // * we save this information so we know which side we should move on drag
          if (vertice.getLatLngs()[0].equals(latlng)) {
            toolState.setVerticesToMarker(lId, { ...spread, [`${index}-0`]: vertice });
          } else if (vertice.getLatLngs()[1].equals(latlng)) {
            toolState.setVerticesToMarker(lId, { ...spread, [`${index}-1`]: vertice });
          }
        });
      });
  }
}

export default TopologyTool;