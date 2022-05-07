import { 
    IMapToolProps 
} from "../../index";
import GeoDownloaderTool from "./model/internal/GeoDownloaderTool";
import GeoDownloaderToolDefaults from "./model/internal/GeoDownloaderToolDefaults";

export const GeovistoGeoDownloaderTool: {
    getType: () => string,
    createTool: (props?: IMapToolProps) => GeoDownloaderTool
} = {
    getType: () => GeoDownloaderToolDefaults.TYPE,
    createTool: (props) => new GeoDownloaderTool(props),
};