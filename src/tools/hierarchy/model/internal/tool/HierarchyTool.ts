import {
    GeoDataChangeEvent,
    GeoDataManager,
    IMapForm,
    IMapFormControl,
    IMapToolConfig,
    IMapToolInitProps,
    IMapToolProps,
    MapTool
} from "../../../../../index.core";

import HierarchyToolDefaults from "./HierarchyToolDefaults";
import HierarchyToolManager from "./HierarchyToolManager";
import HierarchyToolMapForm from "../form/HieararchyToolMapForm";
import HierarchyToolState from "./HierarchyToolState";
import IHierarchyTool from "../../types/tool/IHierarchyTool";
import IHierarchyToolDefaults from "../../types/tool/IHierarchyToolDefaults";
import IHierarchyToolState from "../../types/tool/IHierarchyToolState";

/**
 * Hierarchy tool provides configuration parsing for hierarchy, sets hierarchy trees for geoDataManager and
 * later dispatches event in case of zoom/geo data change event.
 * 
 * @author Malý Vojtěch
 */
class HierarchyTool extends MapTool implements IMapFormControl, IHierarchyTool {
    private mapForm!: HierarchyToolMapForm;                             // Map form of hierarchy tool.
    private manager : HierarchyToolManager = new HierarchyToolManager();// Hieararchy tool manager.

    // Used for performance, if there is no change in any defined domain, doesnt fire the zoom changed events.
    private changeStruct : Map<string, [boolean, number]> = new Map();  // Struct to hold information about last zoom change.
    private changeLastZoom : string[] = [];                             // IDs of last active zoomed objects.


    public constructor(props?: IMapToolProps) {
        super(props);
    }

    public getMapForm(): IMapForm {
        if (this.mapForm == undefined) {
            this.mapForm = this.createMapForm() as HierarchyToolMapForm;
        }
        return this.mapForm;
    }

    public getDefaults(): IHierarchyToolDefaults {
        return <IHierarchyToolDefaults> super.getDefaults();
    }

    public createDefaults(): IHierarchyToolDefaults {
        return new HierarchyToolDefaults();
    }

    protected createMapForm(): IMapForm {
        return new HierarchyToolMapForm(this);
    }

    public initialize(initProps: IMapToolInitProps<IMapToolConfig>): this {
        super.initialize(initProps);
        
        // FIXME: enableHierarchy function should be defined in the interface 
        const geoDataManager = this.getMap()?.getState().getGeoDataManager() as GeoDataManager;
        geoDataManager.enableHierarchy(this.isEnabled());

        return this;
    }

    public getState(): IHierarchyToolState {
        return <IHierarchyToolState> super.getState();
    }

    public createState(): IHierarchyToolState {
        return new HierarchyToolState(this);
    }

    public copy(): IHierarchyTool {
        return new HierarchyTool(this.getProps());
    }

    // Initialization and creation of Hierarchy tool
    public create(): this {
        // Bind event listener for zoom to dispatche zoom changed event. 
        this.getMap()?.getState().getLeafletMap()?.addEventListener("zoom" , this.zoomChanged, this);
        
        // Initialize manager by hierarchy configuration.
        this.manager.initialize(this.getState().getHierarchies());

        // Gets initial zoom value.
        const initialZoomLevel : number | undefined = this.getMap()?.getState().getLeafletMap()?.getZoom();
        const geoDataManager = this.getMap()?.getState().getGeoDataManager() as GeoDataManager;
        
        // Initialize observation structer and set initial zoom to each tree.
        this.manager.getDefinedDomains().forEach(dom => {
            if (this.getMap()?.getState().getGeoDataManager().getDomain(dom)) {
                if (initialZoomLevel) {
                    const temp = this.manager.getLevelByLevel(dom, initialZoomLevel)?.getZoomLevel();
                    if (temp) {
                        this.changeStruct.set(dom, [false, temp]);
                    }

                    geoDataManager.updateTrees(initialZoomLevel);
                }
            }
        });

        if (initialZoomLevel) {    
            // Sets trees to geoDataManager
            this.manager.getDomainsWithNodes().forEach((val, key) => {
                const aggregationFlag = this.manager.getAggregationStatus(key);
                geoDataManager.setTree(key, val, aggregationFlag);
                geoDataManager.startTree(key, initialZoomLevel);
            });

            // Enable hierarchy in whole Geovisto.
            geoDataManager.enableHierarchy(this.isEnabled());
        
        } 

        return this;
    }

    /**
     * Method called whenever zoom changes.
     */
    private zoomChanged() : void {
        const geoDataManager = this.getMap()?.getState().getGeoDataManager() as GeoDataManager;
        // Get new level of zoom.
        const newZoomLevel : number | undefined = this.getMap()?.getState().getLeafletMap()?.getZoom();
        if (newZoomLevel) {
            // Update change structure.
            this.updateChangeStruct(newZoomLevel);
            //const domains = this.manager.getIdsForEveryDefinedDomainByZoomLevel(newZoomLevel);
            geoDataManager.updateTrees(newZoomLevel);
        }

        let anythingCHnagedFlag = false;

        this.changeStruct.forEach(val => {
            if(val[0]) {
                anythingCHnagedFlag = true;
                return;
            }
        });
        
        // In case of any change in trees, dispatch event for tools.
        if (anythingCHnagedFlag) {
            //console.log("Active:", geoDataManager.getActiveByTree("debugger"));
            this.getMap()?.getState().getEventManager().scheduleEvent(new GeoDataChangeEvent(this), undefined, undefined);
        }
    }

    /**
     * Private method to update data in change structer.
     * @param zoom New level of zoom.
     */
    private updateChangeStruct(zoom : number) : void {
        // Clear change struct
        this.changeLastZoom.forEach(wasChanged => {
            const rem : [boolean, number] | undefined = this.changeStruct.get(wasChanged);
            if (rem) {
                rem[0] = false;
                this.changeStruct.set(wasChanged,rem);
            }
        });

        // Clear array of last changed objects
        this.changeLastZoom = [];

        // Set new change struct
        this.manager.getDefinedDomains().forEach(domain => {
            const fromDef : number | undefined = this.manager.getLevelByLevel(domain, zoom)?.getZoomLevel();
            if (fromDef) {
                if (this.changeStruct.has(domain)) {
                    // If something changed, sets flags to true.
                    if(fromDef != this.changeStruct.get(domain)?.[1]) {
                        this.changeLastZoom.push(domain);
                        this.changeStruct.set(domain, [true, fromDef]);
                    } 
                }
            }
        });
    }   
}
export default HierarchyTool;