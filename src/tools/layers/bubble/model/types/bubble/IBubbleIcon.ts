import { IMap } from "../../../../../../index.core";

type IBubbleIconOptions = {
    countryName?: string;
    values: IBubbleIconValues;
    map: () => IMap | undefined;
    max: number;
    isGroup?: boolean;
    bubbleSize?: number;
    bubbleColor?: string;
};

type IBubbleIconValues = {
    id?: string;
    value: number;
    subvalues: { [name: string]: number };
    colors: { [name: string]: string };
    category?: string;
};

export type { IBubbleIconOptions, IBubbleIconValues };
