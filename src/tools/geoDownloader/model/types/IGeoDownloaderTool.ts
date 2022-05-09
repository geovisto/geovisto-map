import { IMapTool } from "../../../../index";

/**
 * Interface of GeoDownloaderTool.
 * @author Vojtěch Malý
 */
interface IGeoDownloaderTool extends IMapTool {
    copy() : IGeoDownloaderTool;
}
export default IGeoDownloaderTool;