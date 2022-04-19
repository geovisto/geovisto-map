import { IMapToolProps } from "../..";
import DownloaderTool from "./model/internal/DownloaderTool";
import DownloaderToolDefaults from "./model/internal/DownloaderToolDefaults";

export const GeovistoDownloaderTool: {
    getType: () => string,
    createTool: (props?: IMapToolProps) => DownloaderTool
} = {
    getType: () => DownloaderToolDefaults.TYPE,
    createTool: (props) => new DownloaderTool(props),
};