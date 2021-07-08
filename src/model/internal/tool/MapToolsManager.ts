import IMapTool from "../../types/tool/IMapTool";
import IMapToolsManager from "../../types/tool/IMapToolsManager";
import MapObjectsManager from "../object/MapObjectsManager";

/**
 * This class provide functions for using tools.
 * 
 * @author Jiri Hynek
 */
class MapToolsManager extends MapObjectsManager<IMapTool> implements IMapToolsManager {

    public constructor(tools: IMapTool[]) {
        super(tools);
    }

    /**
     * It returns copy of the tools manager with copies of tools.
     */
    public copy(): IMapToolsManager {
        // we use copies of predefined tools due to later multiple imports of configs
        const toolsCopy: IMapTool[] = [];
        const tools: IMapTool[] = this.getAll();
        for(let i = 0; i < tools.length; i++) {
            toolsCopy.push(tools[i].copy());
        }
        return new MapToolsManager(toolsCopy);
    }
}
export default MapToolsManager;