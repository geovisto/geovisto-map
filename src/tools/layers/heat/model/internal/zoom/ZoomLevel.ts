// Geovisto core
import { MapDomain } from "../../../../../../index.core";

// types
import {
    IZoomLevel,
    IZoomLevelType,
    ZoomLevels,
} from "../../types/zoom/IZoomLevel";

const ZOOM_LEVELS: IZoomLevelType[] = [
    { name: ZoomLevels.MIN, value: 1 },
    { name: ZoomLevels.NORMAL, value: 7 },
    { name: ZoomLevels.MAX, value: 14 },
];

/**
 *  This class provides functions for using different zoom levels in the heatmap form input.
 */
class ZoomLevel extends MapDomain implements IZoomLevel {
    private zoomLevel: ZoomLevels;

    public constructor(zoomLevel: ZoomLevels) {
        super(ZoomLevel.TYPE(zoomLevel));

        this.zoomLevel = zoomLevel;
    }

    public static TYPE(zoomLevel: ZoomLevels): ZoomLevels {
        return (
            ZOOM_LEVELS.find((level) => level.name === zoomLevel)?.name ??
            ZOOM_LEVELS[0].name
        );
    }

    public getZoom(): number {
        return (
            ZOOM_LEVELS.find((level) => level.name === this.zoomLevel)?.value ??
            ZOOM_LEVELS[0].value
        );
    }
}

export default ZoomLevel;
