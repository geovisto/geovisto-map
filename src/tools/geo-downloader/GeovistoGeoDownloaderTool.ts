import { 
    IMapToolProps 
} from "../../index.core";

import GeoDownloaderTool from "./model/internal/tool/GeoDownloaderTool";
import GeoDownloaderToolDefaults from "./model/internal/tool/GeoDownloaderToolDefaults";

/**
 * Factory for GeovistoGeoDonwloaderTool
 * @author Vojtěch Malý
 */
export const GeovistoGeoDownloaderTool: {
    getType: () => string,
    createTool: (props?: IMapToolProps) => GeoDownloaderTool
} = {
    getType: () => GeoDownloaderToolDefaults.TYPE,
    createTool: (props) => new GeoDownloaderTool(props),
};