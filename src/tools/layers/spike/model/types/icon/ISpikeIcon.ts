import { DivIconOptions } from "leaflet";

interface ISpikeIconOptions extends DivIconOptions {
    countryName?: string;
    value: number;
    color: string | undefined;
    height: number;
    width: number;
    category?: string;
}

export type { ISpikeIconOptions };
