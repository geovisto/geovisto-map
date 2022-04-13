// Geovisto core
import {
    MapToolDefaults
} from "../../../../../index.core";

import IInfoToolConfig from "../../types/tool/IInfoToolConfig";
import IInfoToolDefaults from "../../types/tool/IInfoToolDefaults";
import IInfoDataManager from "../../types/infodata/IInfoDataManager";
import InfoDataManager from "../infodata/InfoDataManager";
import IInfoData from "../../types/infodata/IInfoData";
import MarkDownData from "../infodata/markdown/MarkDownData";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
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
     * It returns default markdown manager.
     */
    public getInfoDataManager(): IInfoDataManager {
        return new InfoDataManager([
        ]);
    }

    /**
     * It returns default markdown.
     */
    public getMarkdown(): IInfoData {
        return new MarkDownData("default", "");
    }

    /**
     * Only one info tool should be present in the Geovisto map.
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