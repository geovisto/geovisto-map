import {
    IMapToolDefaults
} from "../../../../../index.core";

import { IHierarchyToolConfig } from "./IHierarchyToolConfig";

/**
 * Defaults interface for HierarchyTool
 * @author Vojtěch Malý
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IHierarchyToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IHierarchyToolConfig;
    
}
export default IHierarchyToolDefaults;