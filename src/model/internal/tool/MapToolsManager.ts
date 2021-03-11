import MapObjectsManager from "../object/MapObjectsManager";
import IMapToolsManager from "../../types/tool/IMapToolsManager";
import IMapTool from "../../types/tool/IMapTool";

/**
 * This class provide functions for using tools.
 * 
 * @author Jiri Hynek
 */
class MapToolsManager extends MapObjectsManager<IMapTool> implements IMapToolsManager {

    constructor(tools: IMapTool[]) {
        super(tools);
    }

    /**
     * It returns copy of the tools manager with copies of tools.
     */
    public copy(): IMapToolsManager {
        // we use copies of predefined tools due to later multiple imports of configs
        let toolsCopy: IMapTool[] = [];
        let tools: IMapTool[] = this.getObjects();
        for(let i = 0; i < tools.length; i++) {
            toolsCopy.push(tools[i].copy());
        }
        return new MapToolsManager(toolsCopy);
    }
}
export default MapToolsManager;