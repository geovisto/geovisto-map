// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";

import { ICategoryColorRules } from "../categoryColor/ICategoryColor";

/**
 * This type provides specification of the bubble layer tool config model.
 * 
 * @author Vladimir Korencik
 */
type IBubbleLayerToolConfig = ILayerToolConfig & {
    data?: IBubbleLayerToolDimensionsConfig;
    categoryColorRules?: ICategoryColorRules[];
};

/**
 * This type provides specification of the bubble layer tool dimensions config model.
 * 
 * @author Vladimir Korencik
 */
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
