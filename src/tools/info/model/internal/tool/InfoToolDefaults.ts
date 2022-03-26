// Geovisto core
import {
    MapToolDefaults
} from "../../../../../index.core";

import IInfoToolConfig from "../../types/tool/IInfoToolConfig";
import IInfoToolDefaults from "../../types/tool/IInfoToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class InfoToolDefaults extends MapToolDefaults implements IInfoToolDefaults {
    
    /**
     * It returns default config if no config is given.
     */
    public getConfig(): IInfoToolConfig {
        const config = <IInfoToolConfig> super.getConfig();
        config.filterRules = undefined;
        return config;
    }

    /**
     * Only one filter tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-info";

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return InfoToolDefaults.TYPE;
    }

    /**
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return "Info";
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-filter"></i>';
    }

}
export default InfoToolDefaults;