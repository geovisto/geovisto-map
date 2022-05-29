import { IHierarchyConfig } from "../../types/tool/IHierarchyToolConfig";
import HierarchyDomain from "./HierarchyDomain";
import HierarchyZoomLevel from "./HierarchyZoomLevel";
import IHierarchyToolManager from "../../types/tool/IHierarchyToolManager";

/**
 * Manager of hierarchy domains.
 * @author Vojtěch Malý
 */
class HierarchyToolManager implements IHierarchyToolManager {
    private hierarchyDomains : HierarchyDomain[];

    public constructor() {
        this.hierarchyDomains = [];
    }
    
    public getDomainsWithNodes() : Map<string, [string, string | boolean, number][]> {
        const answer : Map<string, [string, string | boolean, number][]> = new Map();
        this.hierarchyDomains.forEach(dom => {
            answer.set(dom.getName(), dom.getNodes());
        });  
        
        return answer;
    }

    public initialize(hierarchies : IHierarchyConfig[]) : void {
        // For each entry of configuration.
        if (hierarchies) {
            hierarchies.forEach(confDomain => {
                const parentChild : [string,string][] = [];
                const parentChildMap : Map<string, string[]> = new Map();
                let highest : number;
                const zoomIDs : number[] = [];  // Array of numbers in which every defined level is only once.

                // Create new domain.
                const hierarchyDom = new HierarchyDomain(confDomain.name);
                // Enable aggregation flag.
                hierarchyDom.aggregationEnabled = confDomain.aggregation;
                
                // Iterate features
                confDomain.hierarchy.forEach(confEntry => {
                    // Check if zoom level is defined.
                    if (confEntry.zoomLevel) {
                        // Check if there is no new highest level.
                        if (highest) {
                            highest = ((highest > confEntry.zoomLevel) ? highest : confEntry.zoomLevel);
                        } else {
                            highest = confEntry.zoomLevel;
                        }

                        if (!zoomIDs.includes(confEntry.zoomLevel)) {
                            zoomIDs.push(confEntry.zoomLevel);
                        }
                    } else {
                        return;
                    }
    
                    // Check if unique id is defined.
                    if (confEntry.id) {
                        hierarchyDom.addToLevel(confEntry.zoomLevel, confEntry.id);
                        // Check if entry has parent or is a parent
                        if (confEntry.parent && confEntry.parent !== "") {                        
                            hierarchyDom.nodes.push([confEntry.id, confEntry.parent, confEntry.zoomLevel]);        
                            // If parent is already defined, just add child.
                            if (parentChildMap.has(confEntry.parent)) {                    
                                const temp = parentChildMap.get(confEntry.parent);
                                temp?.push(confEntry.id.toString());
                                if (temp) {
                                    parentChildMap.set(confEntry.parent, temp);
                                }

                            } else {
                                parentChildMap.set(confEntry.parent, [confEntry.id.toString()]);
                            }
                            parentChild.push([confEntry.parent, confEntry.id.toString()]);
                        
                        } else {                                                            
                            hierarchyDom.nodes.push([confEntry.id, true, confEntry.zoomLevel]);
                        }
                    }
                });
                
                // Check if every object has only one parent.
                const checkSet : Set<string> = new Set();
                let checkBool = false;
                for (let cnt = 0; cnt < parentChild.length; cnt++) {
                    if (checkSet.has(parentChild[cnt][1])) {
                        console.error("Object: " + parentChild[cnt][1] + " has more than one parent in hierarchy!");
                        checkBool = true;
                        break;
                    } else {
                        checkSet.add(parentChild[cnt][1]);
                    }
                }

                if (!checkBool) {
                    // Push new domain
                    this.hierarchyDomains.push(hierarchyDom);
                    // Sort ids to be in ascending order
                    zoomIDs.sort().reverse();
                    hierarchyDom.setParentChild(parentChild);
                    hierarchyDom.setParentChildMap(parentChildMap);
                }
            });
        }

    }


    public getLevelByLevel(domainName : string, level :number) : HierarchyZoomLevel | undefined {
        let out : undefined | HierarchyZoomLevel = undefined;
        // Iterates through domains.
        this.hierarchyDomains.forEach(domain => {
            if (domain.getName() == domainName) {
                out = domain.getLevelByZoom(level);   
                domain.getHierarchyMap();   
            }
        });

        return out;
    }

    public getDefinedDomains() : string[] {
        const ans : string[] = [];
        this.hierarchyDomains.forEach(domain => {
            ans.push(domain.getName());
        });
        return ans;
    }

    public getIdsForEveryDefinedDomainByZoomLevel(zoomLev : number) : Map<string, string[]> {
        const ans : Map<string, string[]> = new Map(); 
        this.getDefinedDomains().forEach(domain => {
            const temp = this.getLevelByLevel(domain, zoomLev);           
            if (temp) {
                ans.set(domain, temp.getStringifiedIds());
            }
        });
        return ans;
    }

    public getAggregationStatus(name : string) : boolean {
        let temp = false;
        this.hierarchyDomains.forEach(dom => {
            if (dom.getName() === name) {
                temp = dom.aggregationEnabled;
            }
        });
        
        return temp;
    }
}
export default HierarchyToolManager;
