// Leaflet
import { HeatLatLngTuple, HeatLayer, HeatMapOptions, LatLng } from "leaflet";

// Geovisto core
import { ILayerToolState, IMapFilterManager } from "../../../../../../index.core";

import { IReactiveRadiusRules } from "../reactiveRadius/IReactiveRadius";
import {
    IHeatLayerToolConfig,
    IHeatLayerToolDimensionsConfig,
} from "./IHeatLayerToolConfig";
import IHeatLayerToolDefaults from "./IHeatLayerToolDefaults";
import IHeatLayerToolDimensions from "./IHeatLayerToolDimensions";
import IHeatLayerToolProps from "./IHeatLayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Vladimir Korencik
 */
interface IHeatLayerToolState<
    TProps extends IHeatLayerToolProps = IHeatLayerToolProps,
    TDefaults extends IHeatLayerToolDefaults = IHeatLayerToolDefaults,
    TConfig extends IHeatLayerToolConfig = IHeatLayerToolConfig,
    TDimensionsConfig extends IHeatLayerToolDimensionsConfig = IHeatLayerToolDimensionsConfig,
    TDimensions extends IHeatLayerToolDimensions = IHeatLayerToolDimensions
> extends ILayerToolState<
    TProps,
    TDefaults,
    TConfig,
    TDimensionsConfig,
    TDimensions
> {
    getFiltersManager(): IMapFilterManager

    setFiltersManager(manager: IMapFilterManager): void

    setLayer(layer: L.LayerGroup): void;

    getLayer(): L.LayerGroup | undefined;

    getLayers(): HeatLayer[];

    setLayers(layers: HeatLayer[]): void;

    setReactiveRadiusRules(rules: IReactiveRadiusRules[]): void;

    getReactiveRadiusRules(): IReactiveRadiusRules[];

    setLatlngsData(latlngs: Array<LatLng | HeatLatLngTuple>): void;

    getLatlngsData(): Array<LatLng | HeatLatLngTuple>;

    setOptions(options: HeatMapOptions): void;

    getOptions(): HeatMapOptions;
}

export default IHeatLayerToolState;
