import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";
import { IReactiveRadiusRules } from "../reactiveRadius/IReactiveRadius";

type IHeatLayerToolConfig = ILayerToolConfig & {
    data?: IHeatLayerToolDimensionsConfig;
    radiusRules?: IReactiveRadiusRules[];
};

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
