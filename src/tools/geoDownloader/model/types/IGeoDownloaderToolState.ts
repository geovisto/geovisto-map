import { 
    IMapToolConfig, 
    IMapToolProps, 
    IMapToolState 
} from "../../../../index";
import IGeoDownloaderToolDefaults from "./IGeoDownloaderToolDefaults";


interface IGeoDownloaderToolState<TProps extends IMapToolProps = IMapToolProps,
TDefaults extends IGeoDownloaderToolDefaults = IGeoDownloaderToolDefaults,
TConfig extends IMapToolConfig = IMapToolConfig> extends IMapToolState<TProps, TDefaults, TConfig> {
    getConfiguration() : IMapToolConfig;
}
export default IGeoDownloaderToolState;