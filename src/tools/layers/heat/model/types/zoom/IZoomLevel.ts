// Geovisto core
import { IMapDomain } from "../../../../../../index.core";

enum ZoomLevels {
    NORMAL = "Normal",
    MIN = "Min",
    MAX = "Max",
}

/**
 * Provides type definition for zoom level values
 * 
 * @author Vladimir Korencik
 */
type IZoomLevelType = {
    name: ZoomLevels;
    value: number;
};

/**
 * This inteface describes methods for zoom level
 * 
 * @author Vladimir Korencik
 */
interface IZoomLevel extends IMapDomain {
    /**
     * Gets zoom zevel
     */
    getZoom(): number;
}

export { ZoomLevels };
export type { IZoomLevel, IZoomLevelType };
