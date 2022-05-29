import {
    IMapToolConfig,
    IMapToolDefaults,
    IMapToolInitProps,
    MapToolState
} from "../../../../../index.core";

import { IHierarchyConfig, IHierarchyToolConfig } from "../../types/tool/IHierarchyToolConfig";
import IHierarchyTool from "../../types/tool/IHierarchyTool";
import IHierarchyToolDefaults from "../../types/tool/IHierarchyToolDefaults";
import IHierarchyToolProps from "../../types/tool/IHierarchyToolProps";
import IHierarchyToolState from "../../types/tool/IHierarchyToolState";

/**
 * State of hierarchy tool
 * @author Vojtěch Malý
 * @author Jiri Hynek
 * 
 */
class HierarchyToolState extends MapToolState implements IHierarchyToolState {
    
    private hierarchies!: IHierarchyConfig[];

    public constructor(tool: IHierarchyTool) {
        super(tool);
    } 

    public initialize(defaults: IHierarchyToolDefaults, props: IHierarchyToolProps, initProps: IMapToolInitProps<IHierarchyToolProps>): void {
        // TODO: allow to set by props
        this.setHierarchies([]);

        super.initialize(defaults, props, initProps);
    }

    public deserialize(config: IHierarchyToolConfig): void {
        super.deserialize(config);

        if(config.hierarchies) {
            this.setHierarchies(config.hierarchies);
        }
    }

    public serialize(defaults: IMapToolDefaults | undefined): IMapToolConfig {
        const config: IHierarchyToolConfig = <IHierarchyToolConfig> super.serialize(defaults);

        config.hierarchies = this.getHierarchies();

        return config;
    }

    /**
     * It returns the list of hierarchy specififactions.
     */
    public getHierarchies() : IHierarchyConfig[] {
        return this.hierarchies;
    }

    /**
     * It sets the list of hierarchy specififactions.
     * 
     * @param hierachies 
     */
     public setHierarchies(hierachies: IHierarchyConfig[]) : void {
        this.hierarchies = hierachies;
    }
}
export default HierarchyToolState;
