// Geovisto core
import { CircleMarker, LatLngLiteral } from "leaflet";

import { ILayerToolState, IMapFilterManager } from "../../../../../../index.core";
import { ICategoryColorRules } from "../categoryColor.ts/ICategoryColor";
import {
    IDotLayerToolConfig,
    IDotLayerToolDimensionsConfig,
} from "./IDotLayerToolConfig";
import IDotLayerToolDefaults from "./IDotLayerToolDefaults";
import IDotLayerToolDimensions from "./IDotLayerToolDimensions";
import IDotLayerToolProps from "./IDotLayerToolProps";

/**
 * This type provides types for work data
 * 
 * @author Vladimir Korencik
 */
export type IWorkData = Partial<LatLngLiteral> & {
    color: string | undefined;
};

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Vladimir Korencik
 */
interface IDotLayerToolState<
    TProps extends IDotLayerToolProps = IDotLayerToolProps,
    TDefaults extends IDotLayerToolDefaults = IDotLayerToolDefaults,
    TConfig extends IDotLayerToolConfig = IDotLayerToolConfig,
    TDimensionsConfig extends IDotLayerToolDimensionsConfig = IDotLayerToolDimensionsConfig,
    TDimensions extends IDotLayerToolDimensions = IDotLayerToolDimensions
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

    getMarkers(): CircleMarker[];

    setMarkers(markers: CircleMarker[]): void;

    setCategoryColorRules(rules: ICategoryColorRules[]): void;

    getCategoryColorRules(): ICategoryColorRules[];

    setWorkData(workData: Array<IWorkData>): void;

    getWorkData(): Array<IWorkData>;
}

export default IDotLayerToolState;
