import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig,
} from "../../../../../../index.core";
import { ICategoryColorRules } from "../categoryColor.ts/ICategoryColor";

type IDotLayerToolConfig = ILayerToolConfig & {
    data?: IDotLayerToolDimensionsConfig;
    categoryColorRules?: ICategoryColorRules[];
};

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
