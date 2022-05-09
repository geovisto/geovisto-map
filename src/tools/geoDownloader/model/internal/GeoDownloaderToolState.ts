import { 
    IMapToolConfig, 
    IMapToolInitProps, 
    MapToolState 
} from "../../../../index.core";

import IGeoDownloaderTool from "../types/IGeoDownloaderTool";
import IGeoDownloaderToolDefaults from "../types/IGeoDownloaderToolDefaults";
import IGeoDownloaderToolProps from "../types/IGeoDownloaderToolProps";
import IGeoDownloaderToolState from "../types/IGeoDownloaderToolState";

/**
 * State class for GeoDownloaderTool.
 * @author Vojtěch Malý
 */
class GeoDownloaderToolState extends MapToolState implements IGeoDownloaderToolState {
    private config : IMapToolConfig | undefined = undefined;

    public constructor(tool: IGeoDownloaderTool) {
        super(tool);
    } 

    public initialize(defaults: IGeoDownloaderToolDefaults, props: IGeoDownloaderToolProps, initProps: IMapToolInitProps<IGeoDownloaderToolProps>): void {
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

export default GeoDownloaderToolState;
