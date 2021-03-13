import L from 'leaflet';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import DrawingLayerToolState from './DrawingLayerToolState';
import DrawingLayerToolDefaults from './DrawingLayerToolDefaults';
import DrawingLayerToolTabControl from './sidebar/DrawingLayerToolTabControl';
import useDrawingToolbar from './components/useDrawingToolbar';
import union from '@turf/union';
import {
  featureToLeafletCoordinates,
  getGeoJSONFeatureFromLayer,
  highlightStyles,
  normalStyles,
} from './util/Poly';

import 'leaflet/dist/leaflet.css';
import './style/drawingLayer.scss';
import difference from '@turf/difference';

export const DRAWING_TOOL_LAYER_TYPE = 'geovisto-tool-layer-drawing';

/**
 * This class represents Drawing layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerTool extends AbstractLayerTool {
  /**
   * It creates a new tool with respect to the props.
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    useDrawingToolbar();
  }

  /**
   * A unique string of the tool type.
   */
  static TYPE() {
    return DRAWING_TOOL_LAYER_TYPE;
  }

  /**
   * It creates a copy of the uninitialized tool.
   */
  copy() {
    return new DrawingLayerTool(this.getProps());
  }

  /**
   * It creates new defaults of the tool.
   */
  createDefaults() {
    return new DrawingLayerToolDefaults();
  }

  /**
   * It returns default tool state.
   */
  createState() {
    return new DrawingLayerToolState();
  }

  /**
   * It returns a tab control.
   */
  getSidebarTabControl() {
    if (this.tabControl == undefined) {
      this.tabControl = this.createSidebarTabControl();
    }
    return this.tabControl;
  }

  redrawSidebarTabControl(layerType) {
    if (this.tabControl == undefined) return;
    this.tabControl.redrawTabContent(layerType);
  }

  /**
   * It creates new tab control.
   */
  createSidebarTabControl() {
    return new DrawingLayerToolTabControl({ tool: this });
  }

  // ? possibly move to state
  serializeToGeoJSON() {
    const geo = {
      type: 'FeatureCollection',
      features: [],
    };

    this.getState().featureGroup.eachLayer((l) => {
      let feature = l.toGeoJSON();
      // * so we don't save selected polygon
      feature.properties = { ...l.options, ...normalStyles };
      geo.features.push(feature);
    });

    return geo;
  }

  // ? possibly move to state
  deserializeGeoJSON(geojson) {
    if (geojson.type === 'FeatureCollection' && geojson.features) {
      geojson.features.forEach((f) => {
        featureToLeafletCoordinates(f.geometry.coordinates);
        let result = new L.polygon(f.geometry.coordinates, f.properties);
        result.layerType = 'polygon';
        this.getState().addLayer(result);
        this.applyEventListeners(result);
      });
    }
    return;
  }

  applyEventListeners(layer) {
    layer.on('click', L.DomEvent.stopPropagation).on('click', this.initChangeStyle, this);
    layer.on('mouseover', this.hightlightPoly, this);
    layer.on('mouseout', this.normalizePoly, this);
  }

  createdListener = (e) => {
    let layer = e.layer;
    layer.layerType = e.layerType;

    let prevLayer = this.getState().getPrevLayer();
    if (prevLayer?.layerType !== e.layerType) this.redrawSidebarTabControl(e.layerType);
    this.getSidebarTabControl().getState().setEnabledEl(null);

    let feature = getGeoJSONFeatureFromLayer(layer);
    let featureType = feature ? feature.geometry.type.toLowerCase() : '';

    let isFeaturePoly = featureType === 'polygon' || featureType === 'multipolygon';
    let selectedLayer = this.getState().selectedLayer;

    let join = isFeaturePoly && Boolean(selectedLayer);

    if (join) {
      let selectedFeature = getGeoJSONFeatureFromLayer(selectedLayer);
      let unifiedFeature = union(feature, selectedFeature);
      featureToLeafletCoordinates(unifiedFeature.geometry.coordinates);
      let result = new L.polygon(unifiedFeature.geometry.coordinates, {
        ...layer.options,
      });
      layer = result;
      layer.layerType = 'polygon';
      let paintPoly = this.getSidebarTabControl().getState().paintPoly;
      paintPoly.clearPaintedPolys(e?.keyIndex);
    }

    // * DIFFERENCE
    // TODO: FIX
    // let fgLayers = this.getState().featureGroup._layers;
    // let layerFeature = getGeoJSONFeatureFromLayer(layer);
    // Object.values(fgLayers).forEach((l) => {
    //   let feature = getGeoJSONFeatureFromLayer(l);
    //   let featureType = feature ? feature.geometry.type.toLowerCase() : '';
    //   let isFeaturePoly = featureType === 'polygon' || featureType === 'multipolygon';
    //   if (isFeaturePoly && l?._leaflet_id !== selectedLayer?._leaflet_id) {
    //     let diffFeature = difference(layerFeature, feature);
    //     if (diffFeature) {
    //       featureToLeafletCoordinates(diffFeature.geometry.coordinates);
    //       let result = new L.polygon(diffFeature.geometry.coordinates, {
    //         ...l.options,
    //       });
    //       result.layerType = 'polygon';
    //       this.getState().removeLayer(l);
    //       this.getState().addLayer(result);
    //       this.applyEventListeners(result);
    //     }
    //   }
    // });

    this.getState().addLayer(layer);
    this.getState().setCurrEl(layer);
    this.applyEventListeners(layer);
    if (join) {
      this.getState().removeLayer(selectedLayer);
      this.getState().setSelectedLayer(layer);
    }
  };

  /**
   * It creates layer items.
   */
  createLayerItems() {
    const combinedMap = this.getMap();
    const map = combinedMap.state.map;
    map.addControl(L.control.drawingToolbar({ tool: this }));
    // * eventlistener for when object is created
    map.on('draw:created', this.createdListener);

    return [this.getState().featureGroup];
  }

  hightlightPoly(e) {
    if (!this.getState().getSelecting()) return;
    if (e.target._icon) {
      L.DomUtil.addClass(e.target._icon, 'highlight-marker');
    } else {
      e.target.setStyle(highlightStyles);
    }
  }

  normalizePoly(e) {
    if (!this.getState().getSelecting()) return;
    if (e.target._icon) {
      L.DomUtil.removeClass(e.target._icon, 'highlight-marker');
    } else {
      e.target.setStyle(normalStyles);
    }
  }

  initChangeStyle(e) {
    const drawObject = e.target;
    if (this.getState().getSelecting()) {
      let fgLayers = this.getState().featureGroup._layers;
      Object.values(fgLayers).forEach((_) => {
        _.setStyle(normalStyles);
      });
      this.getState().setSelectedLayer(drawObject);
    }
    this.getState().setCurrEl(drawObject);
    this.redrawSidebarTabControl(e.target.layerType);
    document.querySelector('.leaflet-container').style.cursor = '';
  }

  /**
   * This function is called when layer items are rendered.
   */
  postCreateLayerItems() {}

  /**
   * It reloads data and redraw the layer.
   */
  redraw(onlyStyle) {
    console.log('...redrawing');
  }

  /**
   * This function is called when a custom event is invoked.
   *
   * @param {AbstractEvent} event
   */
  handleEvent(event) {}
}

export default DrawingLayerTool;
