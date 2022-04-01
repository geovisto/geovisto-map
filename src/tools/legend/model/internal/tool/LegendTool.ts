// Leaflet
import * as L from 'leaflet';

// styles
import "font-awesome/css/font-awesome.min.css";
import "../../../styles/style.scss";

// Geovisto core
import {
    DataChangeEvent,
    DataManagerChangeEvent,
    IMapEvent,
    IMapToolInitProps,
    MapTool,
    IMapLegendControl,
    instanceOfMapLegend,
    IMapTool,
} from '../../../../../index.core';


import ILegendTool from '../../types/tool/ILegendTool';
import ILegendToolConfig from '../../types/tool/ILegendToolConfig';
import ILegendToolDefaults from '../../types/tool/ILegendToolDefaults';
import ILegendToolProps from '../../types/tool/ILegendToolProps';
import ILegendToolState from '../../types/tool/ILegendToolState';
import LegendToolDefaults from "./LegendToolDefaults";
import LegendToolState from "./LegendToolState";
import DimensionChangeEvent from "../../../../../model/internal/event/dimension/DimensionChangeEvent";
import VisibilityChangeEvent from "../../../../../model/internal/event/visibility/VisibilityChangeEvent";

/**
 * This class provides the legend tool.
 *
 * @author Tomas Koscielniak
 */
class LegendTool <T extends IMapTool & IMapLegendControl> extends MapTool implements ILegendTool {


    /**
     * It creates a new tool with respect to the props.
     *
     * @param props
     */
    public constructor(props?: ILegendToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ILegendTool {
        return new LegendTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ILegendToolProps {
        return <ILegendToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the legend tool.
     */
    public getDefaults(): ILegendToolDefaults {
        return <ILegendToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): ILegendToolDefaults {
        return new LegendToolDefaults();
    }

    /**
     * It returns the legend tool state.
     */
    public getState(): ILegendToolState {
        return <ILegendToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): ILegendToolState {
        return new LegendToolState(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<ILegendToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates legend.
     */
    public create(): this {
        super.create();
        this.createLegend(false, undefined);
        return this;
    }

    /**
     * Help function which returns the tool.
     */
    public getTool(tool: IMapTool): T {
        return <T> tool;
    }


    /**
     * It creates a legend tool and its parts (new legend for each layer that implements it).
     *
     * @param render False if the legend is rendered for the first time
     * @param visibility_changed_tool ID of the tool that changed visibility
     */
    protected createLegend(render: boolean, visibility_changed_tool: string | undefined): void {
        // Get map and tools
        const map = this.getMap()?.getState().getLeafletMap();
        const config = this.getState().getLegendToolsConfig();
        let tools = this.getMap()?.getState().getTools().getAll();
        if (config != undefined && this.getMap() != undefined){
            tools = [];
            for (let i = 0; i < config?.length; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tools.push(this.getMap().getState().getTools().getById(config[i]));
            }
        }
        if (tools != undefined && map) {
            for (let i = 0; i < tools?.length; i++) {
                // Check if tools implement legends
                if (instanceOfMapLegend(this.getTool(tools[i]))) {
                    // Check if tool doesnt want the legend rendered for some reason
                    // You can achieve this from tool by returning 'undefined'
                    if (this.getTool(tools[i]).getMapLegend().getContent(tools[i]) != undefined) {
                        // And if they do want to get rendered, get div with legend
                        const legend = L.control({position: "bottomright"});
                        /*// Check if this is only change in visibility, no need to rerender other tools
                        if (visibility_changed_tool != undefined) {
                            // Get the specific tool
                            const tool = this.getMap()?.getState().getTools().getById(visibility_changed_tool);
                            // Proceed as in usual cases
                            if (tool != undefined) {
                                if (render) {
                                    this.clearLegend(visibility_changed_tool);
                                }
                                legend.onAdd = () => {
                                    return this.getTool(tool).getMapLegend().getContent(tool);
                                };
                                legend.addTo(map);
                            }
                            break;
                        }*/
                        // Check if this is change in dimensions
                        //if (render) {
                        this.clearLegend(tools[i].getId());
                        //  }
                        // Get the div
                        legend.onAdd = () => {
                            return this.getTool(tools[i]).getMapLegend().getContent(tools[i]);
                        };
                        // Add it to map
                        legend.addTo(map);
                    }
                }
            }
        }
    }

    /**
     * This function clears legend.
     */
    public clearLegend(owner: string | undefined): void {
        let div: HTMLElement | undefined = undefined;
        div = L.DomUtil.get((owner + "-legend"))!;
        if (div != undefined) {
            L.DomUtil.remove(div);
        }
    }

    /**
     * This function is called when a custom event is invoked.
     *
     * @param event
     */
    public handleEvent(event: IMapEvent): void {
        switch (event.getType()) {
            case DataManagerChangeEvent.TYPE():
            case DataChangeEvent.TYPE():
            case DimensionChangeEvent.TYPE():
                this.createLegend(true, undefined);
                break;
            case VisibilityChangeEvent.TYPE():
                switch (VisibilityChangeEvent.getVisibility()) {
                    // Layer is being enabled
                    case true:
                        this.createLegend(false, VisibilityChangeEvent.getSource().getId());
                        break;
                    // Layer is being disabled
                    case false:
                        this.clearLegend(VisibilityChangeEvent.getSource().getId());
                        break;
                }
                break;
            default:
                break;
        }
    }

}
export default LegendTool;
