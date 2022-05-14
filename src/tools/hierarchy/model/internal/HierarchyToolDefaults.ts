

import {
	IMapToolConfig,
	MapToolDefaults
} from "../../../../index.core";

import IHierarchyToolDefaults from "../types/IHierarchyToolDefaults";

/**
 * Class for default values of HierarchyTool.
 * @author Vojtěch Malý
 */
class HierarchyToolDefaults extends MapToolDefaults implements IHierarchyToolDefaults {
    public static TYPE="geovisto-tool-hierarchy";

    public getType() : string {
		return HierarchyToolDefaults.TYPE;  
    }

    public isSingleton(): boolean {
		return true; 
	}
    
	public getLabel(): string {
		return "Hierarchy Tool";
	}

	public getIcon(): string {
		return '<i class="fa fa-database"></i>';
	}
  
	public getConfig(): IMapToolConfig {
		return super.getConfig();
	}
}

export default HierarchyToolDefaults;