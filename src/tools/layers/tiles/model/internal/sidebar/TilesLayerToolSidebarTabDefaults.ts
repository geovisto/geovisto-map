import { LayerToolSidebarTabDefaults, ILayerToolSidebarTabDefaults } from "../../../../../sidebar";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class TilesLayerToolSidebarTabDefaults extends LayerToolSidebarTabDefaults implements ILayerToolSidebarTabDefaults {

    /**
     * It returns the default name of the tab.
     */
    public getName(): string {
        return "Tiles layer tool settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-globe"></i>';
    }
}
export default TilesLayerToolSidebarTabDefaults;