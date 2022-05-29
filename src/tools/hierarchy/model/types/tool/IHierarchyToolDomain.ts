import IHierarchyToolZoomLevel from "./IHierarchyToolZoomLevel";

/**
 * Interface for one domain hierarchy definiton. 
 * Used by HierarchyToolManager.
 * @author Vojtěch Malý
 */
interface IHierarchyToolDomain {
    /**
     * Return node array where:
     * [childID, parentID or True if parent, ZoomLevel of change] 
     */
    getNodes() : [string, string | boolean, number][]; 

    /**
     * Returns zoom ply based on requested zoom level number.
     * Undefined if that zoom level doesn't exists.
     * @param zoom 
     */
    getLevelByZoom(zoom : number) : IHierarchyToolZoomLevel | undefined;

    /**
     * Add ID to hierarchy ply based on zoom level.
     * @param zoom 
     * @param id 
     */
    addToLevel(zoom : number, id : string | number) : void;

    /**
     * Returns hierarchy Map.
     */
    getHierarchyMap() : Map<string, string[]>;

    /**
     * Sets new parent child arrry of domain.
     * @param parentChild 
     */
    setParentChild(parentChild : [string, string][]) : void ;

    /**
     * Sets new parent child map of domain.
     * @param map 
     */
    setParentChildMap(map : Map<string, string[]>) : void;

    getParentChild() : [string, string][];
    
    setZoomLevels(zoomLevels : number[]) : void;

    /**
     * Get name of Domain.
     */
    getName() : string;
}
export default IHierarchyToolDomain;