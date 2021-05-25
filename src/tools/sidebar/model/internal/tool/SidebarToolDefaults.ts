import ISidebarToolDefaults from "../../types/tool/ISidebarToolDefaults";
import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import ISidebarToolConfig from "../../types/tool/ISidebarToolConfig";
import { GeovistoSidebarTool } from "../../..";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SidebarToolDefaults extends MapToolDefaults implements ISidebarToolDefaults {

    /**
     * It returns the default config.
     */
    public getConfig(): ISidebarToolConfig {
        const config = <ISidebarToolConfig> super.getConfig();
        config.tabs = undefined;
        return config;
    }

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return GeovistoSidebarTool.getType();
    }

    /**
     * Only one sidebar tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }
}
export default SidebarToolDefaults;