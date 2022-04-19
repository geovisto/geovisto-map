import { IMapTool } from "../../../..";

interface IDownloaderTool extends IMapTool {
    copy() : IDownloaderTool;
}
export default IDownloaderTool;