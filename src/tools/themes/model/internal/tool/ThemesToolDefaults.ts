import MapThemesManager from "../theme/basic/MapThemesManager";
import Light1Theme from "../theme/custom/light1/Light1Theme";
import Light2Theme from "../theme/custom/light2/Light2Theme";
import Light3Theme from "../theme/custom/light3/Light3Theme";
import Dark1Theme from "../theme/custom/dark1/Dark1Theme";
import Dark2Theme from "../theme/custom/dark2/Dark2Theme";
import Dark3Theme from "../theme/custom/dark3/Dark3Theme";
import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import IMapThemesManager from "../../types/theme/IMapThemesManager";
import IMapTheme from "../../types/theme/IMapTheme";
import IThemesToolDefaults from "../../types/tool/IThemesToolDefaults";
import IThemesToolConfig from "../../types/tool/IThemesToolConfig";
import BasicTheme from "../theme/basic/BasicTheme";
import { GeovistoThemesTool } from "../../..";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ThemesToolDefaults extends MapToolDefaults implements IThemesToolDefaults {

    /**
     * It returns the default config.
     */
    public getConfig(): IThemesToolConfig {
        const config = <IThemesToolConfig> super.getConfig();
        config.theme = undefined;
        return config;
    }

    /**
     * Only one themes tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return GeovistoThemesTool.getType();
    }

    /**
     * It returns default themes manager.
     */
    public getThemesManager(): IMapThemesManager {
        return new MapThemesManager([
            new Light1Theme(),
            new Light2Theme(),
            new Light3Theme(),
            new Dark1Theme(),
            new Dark2Theme(),
            new Dark3Theme()
        ]);
    }

    /**
     * It returns default theme.
     */
    public getTheme(themesManager: IMapThemesManager | undefined): IMapTheme {
        if(!themesManager) {
            themesManager = this.getThemesManager();
        }
        let theme: IMapTheme | undefined = themesManager.getDefault();
        if(theme == undefined) {
            theme = new BasicTheme();
        }
        return theme;
    }
}
export default ThemesToolDefaults;