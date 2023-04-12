// Leaflet
import { DivIconOptions } from "leaflet";

/**
 * This interfaces provides options for spike icon
 * 
 * @author Vladimir Korencik
 */
interface ISpikeIconOptions extends DivIconOptions {
    countryName?: string;
    value: number;
    color: string | undefined;
    height: number;
    width: number;
    category?: string;
    aggregationCount?: number;
    aggregationValue?: number;
}

export type { ISpikeIconOptions };
