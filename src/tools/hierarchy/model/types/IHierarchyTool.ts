import { IMapTool } from "../../../..";

/**
 * Tool interface for Hierarchy tool.
 * @author Vojtěch Malý
 */
interface IHierarchyTool extends IMapTool {
    copy() : IHierarchyTool;
}
export default IHierarchyTool;