import {
    IMapToolState
} from "../../../../../index.core";
import {
    IHierarchyToolConfig, 
    IHierarchyConfig
} from "./IHierarchyToolConfig";

import IHierarchyToolDefaults from "./IHierarchyToolDefaults";
import IHierarchyToolProps from "./IHierarchyToolProps";

/**
 * State interface for Hierarchy Tool
 * @author Vojtěch Malý
 */
interface IHierarchyToolState<
    TProps extends IHierarchyToolProps = IHierarchyToolProps,
    TDefaults extends IHierarchyToolDefaults = IHierarchyToolDefaults,
    TConfig extends IHierarchyToolConfig = IHierarchyToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {

    /**
     * It returns the list of hierarchy specififactions.
     */
    getHierarchies() : IHierarchyConfig[];

    /**
     * It sets the list of hierarchy specififactions.
     * 
     * @param hierachies 
     */
    setHierarchies(hierachies: IHierarchyConfig[]) : void;
}
export default IHierarchyToolState;