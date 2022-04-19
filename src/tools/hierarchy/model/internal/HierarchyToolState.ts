import {
    IMapToolInitProps,
    MapToolState
} from "../../../../index.core";
import IHierarchyTool from "../types/IHierarchyTool";
import IHierarchyToolDefaults from "../types/IHierarchyToolDefaults";
import IHierarchyToolState from "../types/IHierarchyToolState";
import IHierarchyToolProps from "../types/IHierarchyToolProps";
import IHierarchyConfigType from "../types/IHierarchyConfigType";
import HierarchyConfigurationType from "../types/IHierarchyConfigType";

/**
 * State of hierarchy tool
 */
class HierarchyToolState extends MapToolState implements IHierarchyToolState {
    private config : HierarchyConfigurationType | undefined = undefined;

    public constructor(tool: IHierarchyTool) {
        super(tool);
    } 

    public initialize(defaults: IHierarchyToolDefaults, props: IHierarchyToolProps, initProps: IMapToolInitProps<IHierarchyToolProps>): void {
        super.initialize(defaults, props, initProps);
    }

    public deserialize(config: HierarchyConfigurationType): void {
        super.deserialize(config);
        this.config = config;
    }

    public getConfiguration() : IHierarchyConfigType {
        if (this.config) {
            return this.config;
        } else {
            return {};
        }
    }

}

export default HierarchyToolState;
