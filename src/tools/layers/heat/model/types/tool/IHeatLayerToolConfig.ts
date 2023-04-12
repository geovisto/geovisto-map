// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";

import { IReactiveRadiusRules } from "../reactiveRadius/IReactiveRadius";

/**
 * This type provides specification of the heat layer tool config model.
 * 
 * @author Vladimir Korencik
 */
type IHeatLayerToolConfig = ILayerToolConfig & {
    data?: IHeatLayerToolDimensionsConfig;
    radiusRules?: IReactiveRadiusRules[];
};

/**
 * This type provides specification of the heat layer tool dimensions config model.
 * 
 * @author Vladimir Korencik
 */
type IHeatLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    latitude?: string;
    longitude?: string;
    intensity?: string;
    radius?: number;
    gradient?: string;
    blur?: number;
    zoom?: string;
    reactiveOp?: string;
    reactiveZoom?: number;
    reactiveRadius?: number;
};

export type { IHeatLayerToolConfig, IHeatLayerToolDimensionsConfig };
