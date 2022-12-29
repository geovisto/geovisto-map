import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";
import { ICategoryColorRules } from "../categoryColor/ICategoryColor";

type IBubbleLayerToolConfig = ILayerToolConfig & {
    data?: IBubbleLayerToolDimensionsConfig;
    categoryColorRules?: ICategoryColorRules[];
};

type IBubbleLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    latitude?: string;
    longitude?: string;
    category?: string;
    value?: string;
    aggregation?: string;
    color?: string;
    bubbleSize?: number;
    categoryColorOp?: string;
    categoryColorValue?: string;
    categoryColor?: string;
};

export type { IBubbleLayerToolConfig, IBubbleLayerToolDimensionsConfig };
