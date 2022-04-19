import IGeoData from "./IGeoData";
import IMapDomainArrayManager from "../domain/IMapDomainArrayManager";
import { FeatureCollection } from "geojson";

/**
 * The type represents geographical data manager.
 * 
 * @author Jiri Hynek
 */
type IGeoDataManager = IMapDomainArrayManager<IGeoData> & {
    isHierarchyEnabled() : boolean;

    /**
     * Change enable status of hierarchy.
     */
    enableHierarchy(enabled:boolean) : void;

    /**
     * Sets new hierarchy tree.
     * @param domainName - Name of domain
     * @param nodes - Array of nodes in forma : [Id of node, Id of parent (if parent it is boolean set to true), level of zoom]
     * @param aggregationEnabled - Status of agregation, set by configuration file.
     */
    setTree(domainName : string, nodes : [string, string | boolean, number][], aggregationEnabled : boolean) : void;

    /**
     * Overloaded function, returns only active GeoJSON object.
     * @param name - Name of requested domain
     * @param types - Points / Polygons / etc..
     */
    getFeatures(name : string, types : string[]) : FeatureCollection | undefined 
    
    /**
     * Start's active watch of active zoom levels for tree.
     * Used to set initial level of zoom. (Map might render from start on different levels, based on configuration.)
     * @param domainName - Name of domain.
     * @param zoom - Initial zoom level
     */
    startTree(domainName : string, zoom : number) : void;
    
    /**
     * Update active objects of each tree based on new zoom.
     * @param zoom - New level of zoom.
     */
    updateTrees(zoom : number) : void;

    /**
     * Returns if hierarchy is enabled and all set up for certain tree.
     * @param domainName - Name of domain.
     */
    isHierarchyEnabledForDomain(domainName: string): boolean;
    
    /**
     * Returns true, if active objects of some tree changed after last zoom.
     */
    didSomeTreeChanged() : boolean;

    /**
     * Returns true, if aggregation of data should be performed on certain tree.
     * @param name - Name of domain
     */
    treeAggregationFlag(name : string) : boolean;

    /**
     * Get active objects of tree.
     * @param name - Name of domain.
     */
    getActiveByTree(name : string) : string[];

    /**
     * Get child nodes ID's of parent.
     * @param name - Name of domain
     * @param geoOb - ID of parent
     */
    getChildsFromTree(name : string, geoOb : string) : string[];
};
export default IGeoDataManager;