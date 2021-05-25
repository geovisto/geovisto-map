import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import ISettingsToolDefaults from "../../types/tool/ISettingsToolDefaults";
import ISettingsToolConfig from "../../types/tool/ISettingsToolConfig";
import { GeovistoSettingsTool } from "../../..";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SettingsToolDefaults extends MapToolDefaults implements ISettingsToolDefaults {
    
    /**
     * It returns default config if no config is given.
     */
    public getConfig(): ISettingsToolConfig {
        return <ISettingsToolConfig> super.getConfig();
    }

    /**
     * Only one settings tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return GeovistoSettingsTool.getType();
    }
}
export default SettingsToolDefaults;