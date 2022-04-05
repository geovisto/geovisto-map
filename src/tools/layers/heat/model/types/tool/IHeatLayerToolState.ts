// Geovisto core
import {
    IMapAggregationBucket,
    ILayerToolState
} from "../../../../../../index.core";

import { IHeatLayerToolConfig, IHeatLayerToolDimensionsConfig } from "./IHeatLayerToolConfig";
import IHeatLayerToolDefaults from "./IHeatLayerToolDefaults";
import IHeatLayerToolDimensions from "./IHeatLayerToolDimensions";
import IHeatLayerToolProps from "./IHeatLayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IHeatLayerToolState<
    TProps extends IHeatLayerToolProps = IHeatLayerToolProps,
    TDefaults extends IHeatLayerToolDefaults = IHeatLayerToolDefaults,
    TConfig extends IHeatLayerToolConfig = IHeatLayerToolConfig,
    TDimensionsConfig extends IHeatLayerToolDimensionsConfig = IHeatLayerToolDimensionsConfig,
    TDimensions extends IHeatLayerToolDimensions = IHeatLayerToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensionsConfig, TDimensions> {

    /**
     * It returns a Leaflet layer group.
     */
    getHeatLayerGroup(): L.LayerGroup | undefined;

    /**
     * It sets a Leaflet layer group.
     * 
     * @param layerGroup 
     */
    setHeatLayerGroup(layerGroup: L.LayerGroup): void;

    /**
     * It returns the current data categories.
     * 
     * @param currentData 
     */
    getCurrentDataCategories(): string[];

    /**
     * It sets the current data categories.
     * 
     * @param currentData 
     */
    setCurrentDataCategories(allCategories: string[]): void;

    /**
     * It returns the bucket data.
     * 
     * @param bucketData 
     */
    getBucketData(): Map<string, Map<string, IMapAggregationBucket | null>>;

    /**
     * It sets the bucket data.
     * 
     * @param bucketData 
     */
    setBucketData(bucketData: Map<string, Map<string, IMapAggregationBucket | null>>): void;
}
export default IHeatLayerToolState;