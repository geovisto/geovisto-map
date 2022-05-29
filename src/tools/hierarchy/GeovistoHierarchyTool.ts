import HierarchyTool from "./model/internal/tool/HierarchyTool";
import HierarchyToolDefaults from "./model/internal/tool/HierarchyToolDefaults";
import IHierarchyToolProps from "./model/types/tool/IHierarchyToolProps";

/**
 * Factory for HierarchyTool.
 * @author Vojtěch Malý
 */
export const GeovistoHierarchyTool: {
    getType: () => string,
    createTool: (props?: IHierarchyToolProps) => HierarchyTool
} = {
    getType: () => HierarchyToolDefaults.TYPE,
    createTool: (props) => new HierarchyTool(props),
};