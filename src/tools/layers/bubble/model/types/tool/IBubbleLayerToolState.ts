import { LatLngLiteral } from "leaflet";
import { ILayerToolState, IMapFilterManager } from "../../../../../../index.core";
import { IBubbleIconValues } from "../bubble/IBubbleIcon";
import { ICategoryColorRules } from "../categoryColor/ICategoryColor";
import {
    IBubbleLayerToolConfig,
    IBubbleLayerToolDimensionsConfig,
} from "./IBubbleLayerToolConfig";
import IBubbleLayerToolDefaults from "./IBubbleLayerToolDefaults";
import IBubbleLayerToolDimensions from "./IBubbleLayerToolDimensions";
import IBubbleLayerToolProps from "./IBubbleLayerToolProps";

export type IWorkData = Partial<LatLngLiteral> & IBubbleIconValues;

interface IBubbleLayerToolState<
    TProps extends IBubbleLayerToolProps = IBubbleLayerToolProps,
    TDefaults extends IBubbleLayerToolDefaults = IBubbleLayerToolDefaults,
    TConfig extends IBubbleLayerToolConfig = IBubbleLayerToolConfig,
    TDimensionsConfig extends IBubbleLayerToolDimensionsConfig = IBubbleLayerToolDimensionsConfig,
    TDimensions extends IBubbleLayerToolDimensions = IBubbleLayerToolDimensions
> extends ILayerToolState<
        TProps,
        TDefaults,
        TConfig,
        TDimensionsConfig,
        TDimensions
    > {
    getFiltersManager(): IMapFilterManager;

    setFiltersManager(manager: IMapFilterManager): void;
    
    setLayer(layer: L.LayerGroup): void;

    getLayer(): L.LayerGroup | undefined;

    getMarkers(): L.Marker[];

    setMarkers(markers: L.Marker[]): void;

    setCategoryColorRules(rules: ICategoryColorRules[]): void;

    getCategoryColorRules(): ICategoryColorRules[];

    setWorkData(workData: Array<IWorkData>): void;

    getWorkData(): Array<IWorkData>;
}

export default IBubbleLayerToolState;
