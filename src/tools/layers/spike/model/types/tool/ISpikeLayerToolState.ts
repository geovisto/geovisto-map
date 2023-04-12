// Leaflet
import { LatLngLiteral } from "leaflet";

// Geovisto core
import { ILayerToolState, IMapFilterManager } from "../../../../../../index.core";

import { ICategoryColorRules } from "../categoryColor/ICategoryColor";
import { ISpikeIconOptions } from "../icon/ISpikeIcon";
import {
    ISpikeLayerToolConfig,
    ISpikeLayerToolDimensionsConfig,
} from "./ISpikeLayerToolConfig";
import ISpikeLayerToolDefaults from "./ISpikeLayerToolDefaults";
import ISpikeLayerToolDimensions from "./ISpikeLayerToolDimensions";
import ISpikeLayerToolProps from "./ISpikeLayerToolProps";

/**
 * This type provides types for work data
 * 
 * @author Vladimir Korencik
 */
export type IWorkData = Partial<LatLngLiteral> & ISpikeIconOptions

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Vladimir Korencik
 */
interface ISpikeLayerToolState<
    TProps extends ISpikeLayerToolProps = ISpikeLayerToolProps,
    TDefaults extends ISpikeLayerToolDefaults = ISpikeLayerToolDefaults,
    TConfig extends ISpikeLayerToolConfig = ISpikeLayerToolConfig,
    TDimensionsConfig extends ISpikeLayerToolDimensionsConfig = ISpikeLayerToolDimensionsConfig,
    TDimensions extends ISpikeLayerToolDimensions = ISpikeLayerToolDimensions
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

    getMarkers(): L.Marker[];

    setMarkers(markers: L.Marker[]): void;

    setCategoryColorRules(rules: ICategoryColorRules[]): void;

    getCategoryColorRules(): ICategoryColorRules[];

    setWorkData(workData: Array<IWorkData>): void;

    getWorkData(): Array<IWorkData>;
}

export default ISpikeLayerToolState;
