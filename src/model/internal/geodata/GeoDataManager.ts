import { FeatureCollection} from "geojson";
import GeoJSONTypes from "../../types/geodata/GeoJSONTypes";
import IGeoData from "../../types/geodata/IGeoData";
import IGeoDataManager from "../../types/geodata/IGeoDataManager";
import MapDomainArrayManager from "../domain/generic/MapDomainArrayManager";
import HierarchyTree from "./HierarchyTree";

/**
 * The class provides a basic implemention geographical data manager.
 * 
 * @author Jiri Hynek
 */
class GeoDataManager extends MapDomainArrayManager<IGeoData> implements IGeoDataManager {
    public constructor(geoDataArray: IGeoData[]) {
        super(geoDataArray);
    }


    /*--- Hierarchy interface ---*/
    private hierarchy = false;                                  
    private TreeMap : Map<string, HierarchyTree> = new Map();

    public enableHierarchy(enabled : boolean) : void{
        this.hierarchy = enabled;
    }

    public isHierarchyEnabled() : boolean {
        return this.hierarchy;
    }

    public isHierarchyEnabledForDomain(domainName: string): boolean {
        return this.TreeMap.has(domainName);
    }

    public getFeatures(name : string, types : string[]) : FeatureCollection | undefined {
        const geoData = this.getDomain(name);
        const list = geoData?.getFeatures(types);
        let active : string[] = [];
        const answer: FeatureCollection = {
            type: GeoJSONTypes.FeatureCollection,
            features: []
        };
        if (this.TreeMap.has(name)) {
            active = this.TreeMap.get(name)?.getActive() ?? [];
        }
        list?.features.forEach(feat => {
            if (feat.id) {
                if(active.includes(feat.id.toString())) {
                    answer.features.push(feat);
                }
            }
        });
        if (!this.hierarchy) {
            list?.features.forEach(feat => {
                answer.features.push(feat);
            });
        }
        return answer;
    }

    public setTree(domainName : string, nodes : [string, string | boolean, number][], aggregationEnabled : boolean) : void{
        const newTree = new HierarchyTree(domainName);
        newTree.initByArray(nodes);
        newTree.setAggregationFlag(aggregationEnabled);
        this.TreeMap.set(domainName, newTree);
        
    }

    public startTree(domainName : string, zoom : number) : void {
        if (this.TreeMap.has(domainName)) {
            this.TreeMap.get(domainName)?.startActiveWatch(zoom);
        }
    }

    public updateTrees(zoom : number) : void {
        this.TreeMap.forEach(tree => {
            tree.recalculate(zoom);
        });
    }


    public didSomeTreeChanged() : boolean {
        let x = false;
        this.TreeMap.forEach(tr => {
            if(tr.getChangeFlag()) {
                x = true;
            }
        });
        return x;
    }

    public treeAggregationFlag(name : string) : boolean {
        if (this.TreeMap.has(name)) {
            return this.TreeMap.get(name)?.getAggregationFlag() ?? false;
        }
        return false;
    }

    public getActiveByTree(name : string) : string[] {
        let answer : string[] = [];
        if (this.TreeMap.has(name)) {
            answer = this.TreeMap.get(name)?.getActive() ?? [];
        }
        return answer;
    }

    public getChildsFromTree(name : string, geoOb : string) : string[] {
        let answer : string[] = [];
        if (this.TreeMap.has(name)) {
            answer = this.TreeMap.get(name)?.getAllLeafes(geoOb) ?? [];
        }
        return answer;
    }
}
export default GeoDataManager;