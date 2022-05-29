import {
    IMapTool,
    IMapToolInitProps
} from "../../../../../index.core";

import { IHierarchyToolConfig } from "./IHierarchyToolConfig";
import IHierarchyToolDefaults from "./IHierarchyToolDefaults";
import IHierarchyToolProps from "./IHierarchyToolProps";
import IHierarchyToolState from "./IHierarchyToolState";

/**
 * Tool interface for Hierarchy tool.
 * @author Vojtěch Malý
 */
interface IHierarchyTool<
    TProps extends IHierarchyToolProps = IHierarchyToolProps,
    TDefaults extends IHierarchyToolDefaults = IHierarchyToolDefaults,
    TState extends IHierarchyToolState = IHierarchyToolState,
    TConfig extends IHierarchyToolConfig = IHierarchyToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends IMapTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() : IHierarchyTool;
}
export default IHierarchyTool;