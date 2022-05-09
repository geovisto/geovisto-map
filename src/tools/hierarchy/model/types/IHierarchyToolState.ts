import { IMapToolConfig, IMapToolProps, IMapToolState } from "../../../..";
import HierarchyConfigurationType from "./IHierarchyConfigType";
import IHierarchyToolDefaults from "./IHierarchyToolDefaults";

/**
 * State interface for Hierarchy Tool
 * @author Vojtěch Malý
 */
interface IHierarchyToolState<TProps extends IMapToolProps = IMapToolProps,
TDefaults extends IHierarchyToolDefaults = IHierarchyToolDefaults,
TConfig extends IMapToolConfig = IMapToolConfig> extends IMapToolState<TProps, TDefaults, TConfig> {
    getConfiguration() : HierarchyConfigurationType;
}
export default IHierarchyToolState;