/**
 * Class representing one geo object / one node in hierarchy tree.
 */
class HNode {
    public ID : string;
    public childIDS : string[] = [];
    public zoomLevel : number;
    public isParent = false;
    
    public constructor(ID : string, zoomLevel : number, isParent : boolean) {
        this.ID = ID;
        this.zoomLevel = zoomLevel;
        if (isParent) {
            this.isParent = true;
        }
    }

    public addChild(childID : string) {
        this.childIDS.push(childID);
    }
    
}

class HierarchyTree {
    public name : string;                               // Name of tree and asosciated domain.
    private Tree : Map <string, HNode> = new Map();     // Hierarchy Tree data.
    private zoomLevels : number[] = [];                 // Sorted array of number's representing all zoom levels in which active objects change.
    private active : string[] = [];                     // Array of acitve ID's objects. 
    private parents : string[] = [];
    private changeFlag = false;
    private aggregationFlag : boolean;

    public constructor(name : string, aggregationFlag = false) {
        this.name = name;
        this.aggregationFlag = aggregationFlag;
    }

    /**
     * Creates new node in tree
     * @param ID                    ID of node
     * @param parentID              ID of parent
     * @param zoomLevel             Zoom level where node gets active
     */
    private initByNode(ID : string, zoomLevel : number) : void {
        this.Tree.set(ID, new HNode(ID, zoomLevel, false));
        this.updateZoomLevels(zoomLevel);
    }

    /**
     * Creates new root node. There may be more than one root node, but they must not have any more parents.
     * @param ID 
     * @param zoomLevel 
     */
    private initByParent(ID : string, zoomLevel : number) : void {
        this.Tree.set(ID, new HNode(ID, zoomLevel, true));
        this.updateZoomLevels(zoomLevel);
        this.parents.push(ID);
    }

    /**
     * Creates tree structure from [nodeID, ParentID, Zoomlevel] array.
     * 
     * @param nodes - Array of nodes. *There is no need for particular order.
     */
    public initByArray(nodes : [string, string | boolean, number][]) : void {
        const unresolved : Map<string, string[]> = new Map();                   // Map of unresolved nodes. (Node has parent, that is not yet inicialized.)
                
        nodes.forEach(node => {
            if (typeof node[1] === "boolean") {                                 // Root inicialization.
                this.initByParent(node[0], node[2]);
                if (unresolved.has(node[0])) {                                  // Resolving possible unresolved childs
                    const arrayOfChilds = unresolved.get(node[0]) ?? [];
                    arrayOfChilds.forEach(child => {
                        this.Tree.get(node[0])?.addChild(child);
                    });
                    unresolved.delete(node[0]);
                }
            } else {                                                            // Node init
                if (this.Tree.has(node[1])) {                                   // Parent is already in Tree
                    this.Tree.get(node[1])?.addChild(node[0]);
                } else {                                                        // Parent is not in tree yet.
                    const temp = unresolved.get(node[1]) ?? [];
                    temp.push(node[0]);
                    unresolved.set(node[1], temp);
                }
            
                this.initByNode(node[0], node[2]);                              // Create node        
                
                if (unresolved.has(node[0])) {                                  // Resolving unresolved childs
                    const arrayOfChilds = unresolved.get(node[0]) ?? [];
                    arrayOfChilds.forEach(child => {
                        this.Tree.get(node[0])?.addChild(child);
                    });
                    unresolved.delete(node[0]);
                }
            }
        });  
    }

    /**
     * Initialize first zoom level.
     * @param zoom 
     */
    public startActiveWatch(zoom : number) : void {
        this.active = this.getActiveByZoom(zoom);
    }


    /**
     * Update Zoom Levels array
     * @param zoomLevel 
     */
    private updateZoomLevels(zoomLevel : number): void {
        if(! this.zoomLevels.includes(zoomLevel)) {
            this.zoomLevels.push(zoomLevel);
            this.zoomLevels.sort();
        }
    }

    /**
     * Returns ID array of geoobjects visible in that particular zoom.
     * @param zoom 
     * @returns 
     */
    public getActiveByZoom(zoom : number) : string[] {
        const resolverArray : string[] = [];
        this.parents.forEach(value => {resolverArray.push(value);});
        let answer : string[] = [];

        while(resolverArray.length > 0) {
            const resolved = resolverArray.pop();
            if (!resolved) {
                continue;
            }
            const node = this.Tree.get(resolved) ?? undefined;
            if(node) {
                if (node.zoomLevel >= zoom) {
                    answer.push(node.ID);
                } else {
                    if (node.childIDS.length < 1) {             // Does not have any childs, is active even under his active zoom.
                        answer.push(node.ID);
                    } else {
                        node.childIDS.forEach(child => {
                            resolverArray.push(child);
                        });
                    }
                }
            }
        }

        // If empty, return parents beacause nothing in tree changed.
        if (answer.length == 0) {
            answer = this.parents;
        }

        return answer;
    }

    /**
     * Returns all lowest chidls of that object.
     * @param root - ID of node in tree.
     * @returns - Array of lowest ids. 
     */
    public getAllLeafes(root : string) : string[] {
        const answer : string[] = [];
        const reslover : string[] = [];
        reslover.push(root);

        while (reslover.length > 0) {
            const resolving = reslover.pop();

            if (resolving) {
                if (this.Tree.has(resolving)) {
                    const node = this.Tree.get(resolving);
                    const length = node?.childIDS.length ?? 0;
                    if (length > 0) {
                        node?.childIDS.forEach(child => {
                            reslover.push(child);
                        });
                    } else {
                        answer.push(resolving);
                    }
                }
            }
        }
        return answer;
    }

    /**
     * Recalculates visible objects. If there was change, sets change flag to true until next recalculation.
     * @param newZoom 
     * @returns 
     */
    public recalculate(newZoom : number) : boolean {
        if (this.changeFlag) {
            this.changeFlag = false;
        }

        const newActive = this.getActiveByZoom(newZoom).sort();
        const oldActive = this.active.sort();
        let flag = false;
    
        // Length check
        if (newActive.length != oldActive.length) {
            flag = true;
        } else {
            for (let cnt = 0; cnt < newActive.length; cnt++) {
                if (newActive[cnt] != oldActive[cnt]) {
                    flag = true;
                    break;   
                }
            }
        }

        if (flag) {
            this.changeFlag = true;
            this.active = newActive;
        }
        return this.changeFlag;
    }

    /**
     * Getter for change flag.
     * @returns 
     */
    public getChangeFlag() : boolean {
        return this.changeFlag;
    }

    /**
     * Getter for active objects
     * @returns 
     */
    public getActive() : string[] {
        return this.active;
    }

    public getAggregationFlag() : boolean {
        return this.aggregationFlag;
    }

    public setAggregationFlag(flag : boolean) : void {
        this.aggregationFlag = flag;
    }
}

export default HierarchyTree;
