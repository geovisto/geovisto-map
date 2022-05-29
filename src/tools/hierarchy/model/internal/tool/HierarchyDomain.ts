import IHierarchyToolDomain from "../../types/tool/IHierarchyToolDomain";
import HierarchyZoomLevel from "./HierarchyZoomLevel";

/**
 * Holds everything about domais hierarchy
 * 
 * @author Vojtěch Malý
 */
class HierarchyDomain implements IHierarchyToolDomain{
    // Name of domain
    private name : string;
    // Map of every zoom level
    private levelsMap : Map<number, HierarchyZoomLevel> = new Map();
    // Parent <-> child array of whole domain
    private parentChildMap : Map<string,string[]> = new Map();
    private parentChild : [string,string][] = [];
    // Zoom levels
    private zoomLevels : number[] = [];
    // Map of object <-> lowest child id 
    public lowestChildMap : Map<string, string[]> = new Map();
    // Flag defining if lowestChildMap is cached. Performance enhancment.
    private cached = false;
    //Agregation flag, if enabled data are agregated in parents from lowest childs and not from their datasets. 
    public aggregationEnabled = false;
    // Array of [childID, parentID or True if parent, ZoomLevel of change]
    public nodes : [string, string | boolean, number][] = [];

    public constructor(name : string) {
        this.name = name;
    }

    public getNodes() : [string, string | boolean, number][] {
        return this.nodes;
    }

    /**
     * Based on zoom level returns object of hierarchyZoomLevel
     */
    public getLevelByZoom(zoom : number) : HierarchyZoomLevel | undefined {
        let lowestLevel : number;
        let max : number;
        let alreadyAssigned = true;

        if (this.zoomLevels.length > 0) {
            lowestLevel = this.zoomLevels[0];
            max = lowestLevel;
        } else {
            return undefined;
        }

        this.zoomLevels.forEach(levelIterated => {
            // If level is higher than requested.
            if (levelIterated >= zoom) {           
                if (lowestLevel > levelIterated) {
                    lowestLevel = levelIterated;
                } 

                if (alreadyAssigned) {
                    lowestLevel = levelIterated;
                    alreadyAssigned = false;
                }
            }

            max = (max <= levelIterated) ? levelIterated : max;
        });

        // If requested zoom level is HIGHER than highest defined level, return the highest.
        lowestLevel = (zoom > lowestLevel) ? max : lowestLevel; 
        return this.levelsMap.get(lowestLevel);
    }

    /**
     * Adds new object to certain zoom level
     * @param level Zoom level
     * @param id Id of added object.
     */
    public addToLevel(level : number, id : string | number) : void {
        // If level is defined add, if not create new level.
        if (this.levelsMap.has(level)) {
            this.levelsMap.get(level)?.addID(id);
        } else {
            const temp = new HierarchyZoomLevel(level);
            temp.addID(id);
            this.levelsMap.set(level, temp);
            this.zoomLevels.push(level);
        } 
    }

    /**
     * Returnes lowest child map.
     * @returns 
     */
    public getHierarchyMap() : Map<string, string[]>{
        // If map is cached returns.
        if(this.cached) {
            return this.lowestChildMap;
        }

        // Resolve new map.
        this.parentChildMap.forEach((value,key) => {    
            const ans = this.mapResolveGet(value);
            this.lowestChildMap.set(key, ans);
        });
        this.cached = true;

        return this.lowestChildMap;
    }

    /**
     * Resolve and get all lowest childrens of passed objects.
     * @param toResolve Ids of objects to resolve
     * @returns 
     */
    private mapResolveGet(toResolve : string[]) : string[] {
        const resolver = toResolve;
        const ans : string[] = [];

        while (resolver.length > 0) {
            const temp = resolver.pop();
            
            if (temp) {
                
                if (this.parentChildMap.has(temp)) {
                    ans.push(temp);
                    const x = this.parentChildMap.get(temp);
                    if (x) { 
                        x.forEach(tempx => {
                            resolver.push(tempx);
                        });
                    }
                } else {
                    ans.push(temp);
                }
            }
        }

        return ans;
    }

    /**
     * Set parentChild array
     * @param parentChild 
     */
    public setParentChild(parentChild : [string, string][]) : void {
        this.parentChild = parentChild;
    }

    /**
     * Set parentChild Map
     * @param map 
     */
    public setParentChildMap(map : Map<string, string[]>) : void {
        this.parentChildMap = map;
    }

    /**
     * Get parent child array
     * @returns 
     */
    public getParentChild() : [string, string][] {
        return this.parentChild;
    }

    /**
     * Sets level of all defined zoom levels
     * @param zoomLevels 
     */
    public setZoomLevels(zoomLevels : number[]) : void {
        this.zoomLevels = zoomLevels;
    }

    /**
     * Returns name of a domain.
     * @returns 
     */
    public getName() : string {
        return this.name;
    }
}
export default HierarchyDomain;
