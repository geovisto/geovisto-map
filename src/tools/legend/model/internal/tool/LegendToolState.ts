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

/**
 * This class provide legend tool model.
 * 
 * @author Tomas Koscielniak
 */
class LegendToolState extends MapToolState implements ILegendToolState {

    
    private legend: Control.Legend | null;

    /**
     * It creates a tool state.
     */
    public constructor(tool: ILegendTool) {
        super(tool);

        this.legend = null;
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


}
export default LegendToolState;