import {
    IMapToolState 
} from "../../../../../index.core";

import IGeoDownloaderToolConfig from "./IGeoDownloaderToolConfig";
import IGeoDownloaderToolDefaults from "./IGeoDownloaderToolDefaults";
import IGeoDownloaderToolProps from "./IGeoDownloaderToolProps";

/**
 * State interface for GeoDownloaderTool
 * @author Vojtěch Malý
 */
type IGeoDownloaderToolState<
    TProps extends IGeoDownloaderToolProps = IGeoDownloaderToolProps,
    TDefaults extends IGeoDownloaderToolDefaults = IGeoDownloaderToolDefaults,
    TConfig extends IGeoDownloaderToolConfig = IGeoDownloaderToolConfig
> = IMapToolState<TProps, TDefaults, TConfig>
export default IGeoDownloaderToolState;