// Geovisto core
import { IMap } from "../../../../../../index.core";

/**
 * This type provides options for bubble icon
 * 
 * @author Vladimir Korencik
 */
type IBubbleIconOptions = {
    countryName?: string;
    values: IBubbleIconValues;
    map: () => IMap | undefined;
    max: number;
    isGroup?: boolean;
    bubbleSize?: number;
    bubbleColor?: string;
};

/**
 * This type provides values for bubble icon
 * 
*  @author Vladimir Korencik
 */
type IBubbleIconValues = {
    id?: string;
    value: number;
    subvalues: { [name: string]: number };
    colors: { [name: string]: string };
    category?: string;
    aggregationCount?: number;
    aggregationValue?: number
};

export type { IBubbleIconOptions, IBubbleIconValues };
