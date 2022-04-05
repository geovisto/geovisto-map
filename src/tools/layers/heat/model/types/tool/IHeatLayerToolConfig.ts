// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig
} from "../../../../../../index.core";

/**
 * This type provides specification of the Heat layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IHeatLayerToolConfig = ILayerToolConfig & {
    data: IHeatLayerToolDimensionsConfig;
}

/**
 * This type provides specification of the Heat layer tool dimensions config model.
 * 
 * @author Jiri Hynek
 */
type IHeatLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    geoData?: string,
    geoId?: string,
    value?: string,
    aggregation?: string,
    category?: string
}
export type { IHeatLayerToolConfig, IHeatLayerToolDimensionsConfig };