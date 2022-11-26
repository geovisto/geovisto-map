import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";
import { ICategoryColorRules } from "../categoryColor/ICategoryColor";

type ISpikeLayerToolConfig = ILayerToolConfig & {
    data?: ISpikeLayerToolDimensionsConfig;
    categoryColorRules?: ICategoryColorRules[];
};

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
