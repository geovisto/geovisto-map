// Leaflet
import {
    Control
} from "leaflet";

// Geovisto core
import {
    MapToolState
} from "../../../../../index.core";

import ILegendTool from "../../types/tool/ILegendTool";
import ILegendToolState from "../../types/tool/ILegendToolState";
import {ILegendToolConfig} from "../../../index";

/**
 * This class provide legend tool model.
 * 
 * @author Tomas Koscielniak
 */
class LegendToolState extends MapToolState implements ILegendToolState {

    private legendConfig?: ILegendToolConfig[];
    private legendTools?: Array<string>;
    private legend: Control.Legend | null;

    /**
     * It creates a tool state.
     */
    public constructor(tool: ILegendTool) {
        super(tool);

        this.legend = null;

        this.legendConfig = undefined;
    }

    /**
     * The metod takes config and deserializes the values.
     *
     * @param config
     */
    public deserialize(config: ILegendToolConfig): void {
        super.deserialize(config);

        // original tabs desriptions can be used after all tools are initialized during the sidebar tool creation
        this.legendConfig = config.state;
        this.legendTools = config.tools;
    }

    /**
     * It returns the legend.
     */
    public getLegend(): Control.Legend | null {
        return this.legend;
    }

    /**
     * It sets legend.
     * 
     * @param legend
     */
    public setLegend(legend: Control.Legend): void {
        this.legend = legend;
    }

    /**
     * It returns the legend config.
     */
    public getLegendConfig(): ILegendToolConfig[] | undefined {
        return this.legendConfig;
    }

    /**
     * It returns the tools to create a legend for.
     */
    public getLegendToolsConfig(): string[] | undefined {
        return this.legendTools;
    }


}
export default LegendToolState;