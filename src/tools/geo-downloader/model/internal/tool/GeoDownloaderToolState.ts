import { 
    IMapToolInitProps, 
    MapToolState 
} from "../../../../../index.core";

import IGeoDownloaderTool from "../../types/tool/IGeoDownloaderTool";
import IGeoDownloaderToolDefaults from "../../types/tool/IGeoDownloaderToolDefaults";
import IGeoDownloaderToolProps from "../../types/tool/IGeoDownloaderToolProps";
import IGeoDownloaderToolState from "../../types/tool/IGeoDownloaderToolState";

/**
 * State class for GeoDownloaderTool.
 * @author Vojtěch Malý
 */
class GeoDownloaderToolState extends MapToolState implements IGeoDownloaderToolState {

    public constructor(tool: IGeoDownloaderTool) {
        super(tool);
    }

    public initialize(defaults: IGeoDownloaderToolDefaults, props: IGeoDownloaderToolProps, initProps: IMapToolInitProps<IGeoDownloaderToolProps>): void {
        super.initialize(defaults, props, initProps);
    }
}

export default GeoDownloaderToolState;
