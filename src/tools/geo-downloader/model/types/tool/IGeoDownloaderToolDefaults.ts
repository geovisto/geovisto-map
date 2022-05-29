import {
    IMapToolDefaults
} from "../../../../../index.core";

import IGeoDownloaderToolConfig from "./IGeoDownloaderToolConfig";

/**
 * State interface for GeoDownloaderTool
 * @author Vojtěch Malý
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IGeoDownloaderToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IGeoDownloaderToolConfig;
    
}

export default IGeoDownloaderToolDefaults;