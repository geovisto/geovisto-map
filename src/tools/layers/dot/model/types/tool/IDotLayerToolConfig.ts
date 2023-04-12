// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";

import { ICategoryColorRules } from "../categoryColor.ts/ICategoryColor";

/**
 * This type provides specification of the dot layer tool config model.
 * 
 * @author Vladimir Korencik
 */
type IDotLayerToolConfig = ILayerToolConfig & {
    data?: IDotLayerToolDimensionsConfig;
    categoryColorRules?: ICategoryColorRules[];
};

/**
 * This type provides specification of the dot layer tool dimensions config model.
 * 
 * @author Vladimir Korencik
 */
type IDotLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    latitude?: string;
    longitude?: string;
    category?: string;
    color?: string;
    categoryColorOp?: string;
    categoryColorValue?: string;
    categoryColor?: string;
};

export type { IDotLayerToolConfig, IDotLayerToolDimensionsConfig };
