
import { IHierarchyConfig } from "./IHierarchyToolConfig";
import IHierarchyToolZoomLevel from "./IHierarchyToolZoomLevel";

/**
 * Interface for Hierarchy Tool manager. 
 * Used only internaly in Hierarchy Tool.
 * 
 * @author Vojtěch Malý
 */
interface IHierarchyToolManager {

    initialize(hierarchies : IHierarchyConfig[]) : void;

    /**
     * Return array of domain names defined in manager.
     */
    getDefinedDomains() : string[];

    /**
     * Generate map of basic node information.
     * @returns Map where Map<Domain_name, [] of tuples in which [Node_ID, Parent_ID, Zoom]
     */
    getDomainsWithNodes() : Map<string, [string, string | boolean, number][]>;

    /**
     * Returns zoom level object based on domain name and level of ply.
     * @param domainName Name of requested domain
     * @param level Zoom level
     * @returns Hiererchy zoomLevel or undefined.
     */
    getLevelByLevel(domainName : string, level : number) : IHierarchyToolZoomLevel | undefined;

    /**
     * Return array of acitve IDs for each defined domain in manager, by their ply zoom level.
     * @param zoomLevel Level of zoom
     * @returns 
     */
    getIdsForEveryDefinedDomainByZoomLevel(zoomLevel : number) : Map<string, string[]>;    
    
    /**
    * Get aggregation flag of certain domain. If true, data set of domain should be agregated from lowest children.
    * @param name Name of domain.
    * @returns 
    */
    getAggregationStatus(name : string) : boolean;
}
export default IHierarchyToolManager;