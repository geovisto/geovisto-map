import { IMapDomain } from "../../../../../../index.core";

enum ZoomLevels {
    NORMAL = "Normal",
    MIN = "Min",
    MAX = "Max",
}

type IZoomLevelType = {
    name: ZoomLevels;
    value: number;
};

interface IZoomLevel extends IMapDomain {
    getZoom(): number;
}

export { ZoomLevels };
export type { IZoomLevel, IZoomLevelType };
