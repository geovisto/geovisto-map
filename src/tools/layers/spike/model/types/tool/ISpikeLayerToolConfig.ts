// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";

import { ICategoryColorRules } from "../categoryColor/ICategoryColor";

/**
 * This type provides specification of the spike layer tool config model.
 * 
 * @author Vladimir Korencik
 */
type ISpikeLayerToolConfig = ILayerToolConfig & {
    data?: ISpikeLayerToolDimensionsConfig;
    categoryColorRules?: ICategoryColorRules[];
};

/**
 * This type provides specification of the spike layer tool dimensions config model.
 * 
 * @author Vladimir Korencik
 */
type ISpikeLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    latitude?: string;
    longitude?: string;
    category?: string;
    value?: string;
    aggregation?: string;
    color?: string;
    categoryColorOp?: string;
    categoryColorValue?: string;
    categoryColor?: string;
};

export type { ISpikeLayerToolConfig, ISpikeLayerToolDimensionsConfig };
