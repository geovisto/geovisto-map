import {
	IMapToolConfig,
	MapToolDefaults
} from "../../../../../index.core";

import IHierarchyToolDefaults from "../../types/tool/IHierarchyToolDefaults";

/**
 * Class for default values of HierarchyTool.
 * @author Vojtěch Malý
 */
class HierarchyToolDefaults extends MapToolDefaults implements IHierarchyToolDefaults {
    public static TYPE="geovisto-tool-hierarchy";

    public getType() : string {
		return HierarchyToolDefaults.TYPE;  
    }

    /**
     * By default, the tool is disabled.
     */
    public isEnabled(): boolean {
        return false;
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