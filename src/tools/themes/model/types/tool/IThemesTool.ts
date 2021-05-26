import IMapTool from "../../../../../model/types/tool/IMapTool";
import IThemesToolDefaults from "./IThemesToolDefaults";
import IThemesToolProps from "./IThemesToolProps";
import IThemesToolState from "./IThemesToolState";
import IMapTheme from "../theme/IMapTheme";

/**
 * This interface provides the themes tool.
 * 
 * @author Jiri Hynek
 */
interface IThemesTool extends IMapTool {

    /**
     * It returns the props given by the programmer.
     */
    getProps(): IThemesToolProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): IThemesToolDefaults;

    /**
     * It returns the sidebar tool state.
     */
    getState(): IThemesToolState;

    /**
     * It updates the theme and notifies listeners.
     * 
     * @param theme 
     */
    setTheme(theme: IMapTheme): void
}
export default IThemesTool;