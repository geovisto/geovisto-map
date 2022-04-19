import { IMapToolConfig, IMapToolInitProps, MapToolState } from "../../../../index.core";
import IDownloaderTool from "../types/IDownloaderTool";
import IDownloaderToolDefaults from "../types/IDownloaderToolDefaults";
import IDownloaderToolProps from "../types/IDownloaderToolProps";
import IDownloaderToolState from "../types/IDownloaderToolState";

class DownloaderToolState extends MapToolState implements IDownloaderToolState {
    private config : IMapToolConfig | undefined = undefined;

    public constructor(tool: IDownloaderTool) {
        super(tool);
    } 

    public initialize(defaults: IDownloaderToolDefaults, props: IDownloaderToolProps, initProps: IMapToolInitProps<IDownloaderToolProps>): void {
        super.initialize(defaults, props, initProps);
    }

    public deserialize(config: IMapToolConfig): void {
        super.deserialize(config);
        this.config = config;
    }

    public getConfiguration() : IMapToolConfig {
        if (this.config) {
            return this.config;
        } else {
            return {};
        }
    }

}

export default DownloaderToolState;
