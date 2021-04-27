import IMapObjectState from "../object/IMapObjectState";
import IMapConfig from "./IMapConfig";
import IMapToolsManager from "../tool/IMapToolsManager";
import IMapDataManager from "../data/IMapDataManager";
import IMapConfigManager from "../config/IMapConfigManager";

/**
 * This interface declares the state of the map.
 * It wraps the state since the map can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface IMapState extends IMapObjectState {

    /**
     * It takes config and deserializes the values.
     * 
     * @param config
     */
    deserialize(config: IMapConfig): void;

    /**
     * It serializes the map state. Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    serialize(filterDefaults: boolean | undefined): IMapConfig

    /**
     * It returns the Leaflet map.
     */
    getLeafletMap(): L.Map | undefined;

    /**
     * It returns the Leaflet map.
     * 
     * @param map 
     */
    setLeafletMap(map: L.Map): void;

    /**
     * It returns the tool manager providing tool templates.
     */
    getToolTemplates(): IMapToolsManager;

    /**
     * It sets the tool templates providing tool templates.
     * 
     * @param toolTemplates 
     */
    setToolTemplates(toolTemplates: IMapToolsManager): void;

    /**
     * It returns tools manager providing tools.
     */
    getTools(): IMapToolsManager;

    /**
     * It sets tools manager providing tools.
     * 
     * @param tools 
     */
    setTools(tools: IMapToolsManager): void;

    /**
     * It returns the map data manager.
     */
    getMapData(): IMapDataManager;

    /**
     * It sets the map data manager.
     * note: It also updates the current data.
     * 
     * @param mapData 
     */
    setMapData(mapData: IMapDataManager): void;

    /**
     * It returns current data (might be filtered).
     * 
     * TODO: specify the type
     */
    getCurrentData(): any[];

    /**
     * It sets current data.
     * 
     * TODO: specify the type
     * 
     * @param data
     */
    setCurrentData(data: any[]): void;

    /**
     * It returns the map config manager.
     */
    getMapConfig(): IMapConfigManager;

    /**
     * It sets the map config manager.
     * 
     * @param mapConfigManager 
     */
    setMapConfig(mapConfigManager: IMapConfigManager): void;

    /**
     * It returns polygons.
     * 
     * TODO: specify the type
     */
    getPolygons(): any;

    /**
     * It sets polygons.
     * 
     * TODO: specify the type
     * 
     * @param polygons
     */
    setPolygons(polygons: any): void;

    /**
     * It returns centroids.
     * 
     * TODO: specify the type
     */
    getCentroids(): any;

    /**
     * It sets centroids.
     * 
     * TODO: specify the type
     * 
     * @param centroids
     */
    setCentroids(centroids: any): void;

    /**
     * It returns the initial zoom level.
     */
    getInitialZoom(): number;

    /**
     * It sets initial zoom level.
     * 
     * @param zoom
     */
    setInitialZoom(zoom: number): void;

    /**
     * It returns the initial map center.
     * 
     * TODO: remove from state (use defaults only)
     */
    getInitialMapCenter(): { lat: number, lng: number };

    /**
     * It sets initial map center.
     * 
     * TODO: remove from state (use defaults only)
     * 
     * @param mapCenter
     */
    setInitialMapCenter(mapCenter: { lat: number, lng: number }): void;

    /**
     * It returns the initial structure.
     * 
     * TODO: remove from state (use defaults only)
     */
    getInitialMapStructure(): { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] };

    /**
     * It sets initial map structure.
     * 
     * TODO: remove from state (use defaults only)
     * 
     * @param mapStructure
     */
    setInitialMapStructure(mapStructure: { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] }): void;
}
export default IMapState;