import { IMapToolConfig, IMapToolProps, IMapToolState } from "../../../..";
import HierarchyConfigurationType from "./IHierarchyConfigType";
import IHierarchyToolDefaults from "./IHierarchyToolDefaults";

interface IHierarchyToolState<TProps extends IMapToolProps = IMapToolProps,
TDefaults extends IHierarchyToolDefaults = IHierarchyToolDefaults,
TConfig extends IMapToolConfig = IMapToolConfig> extends IMapToolState<TProps, TDefaults, TConfig> {
    getConfiguration() : HierarchyConfigurationType;
}
export default IHierarchyToolState;