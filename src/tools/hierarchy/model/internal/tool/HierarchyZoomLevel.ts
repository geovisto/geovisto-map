import IHierarchyToolZoomLevel from "../../types/tool/IHierarchyToolZoomLevel";

/**
 * Holds information about active objects in one zoom level.
 * @author Vojtěch Malý
 */
class HierarchyZoomLevel implements IHierarchyToolZoomLevel {
    private zoomLevel: number;
    private IDs : (string|number)[] = [];

    public constructor(zoomLevel:number) {
        this.zoomLevel = zoomLevel;
    }
    
    public getZoomLevel() : number {
        return this.zoomLevel;
    }

    public addID(id : string | number) : void {
        this.IDs.push(id);
    }

    public getStringifiedIds() : string[] {
        const ans : string[] = [];
        this.IDs.forEach(lm => {
            ans.push(lm.toString());
        });
        return ans;
    }
}
export default HierarchyZoomLevel;