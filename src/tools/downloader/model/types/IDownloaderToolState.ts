import { IMapToolConfig, IMapToolProps, IMapToolState } from "../../../..";
import IDownloaderToolDefaults from "./IDownloaderToolDefaults";


interface IDownloaderToolState<TProps extends IMapToolProps = IMapToolProps,
TDefaults extends IDownloaderToolDefaults = IDownloaderToolDefaults,
TConfig extends IMapToolConfig = IMapToolConfig> extends IMapToolState<TProps, TDefaults, TConfig> {
    getConfiguration() : IMapToolConfig;
}
export default IDownloaderToolState;