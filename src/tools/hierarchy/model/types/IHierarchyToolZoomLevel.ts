/**
 * Interface of one zoom ply.
 */
interface IHierarchyToolZoomLevel {

    /**
     * Retruns zoom level of this ply.
     */
    getZoomLevel() : number;

    /**
     * Adds ID of object in ply.
     * @param id 
     */
    addID(id : string | number) : void;

    /**
     * Returns all IDs in string format.
     */
    getStringifiedIds() : string[];
}

export default IHierarchyToolZoomLevel;