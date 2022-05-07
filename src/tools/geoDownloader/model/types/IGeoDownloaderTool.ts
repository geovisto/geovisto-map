import { IMapTool } from "../../../../index";

interface IGeoDownloaderTool extends IMapTool {
    copy() : IGeoDownloaderTool;
}
export default IGeoDownloaderTool;