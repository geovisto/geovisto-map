import {
    Control
} from "leaflet";

// Geovisto core
import {
    IMapToolState,
} from "../../../../../index.core";

import ILegendToolDefaults from "./ILegendToolDefaults";
import ILegendToolConfig from "./ILegendToolConfig";
import ILegendToolProps from "./ILegendToolProps";

/**
 * This interface declares legend tool model.
 * 
 * @author Tomas Koscielniak
 */
interface ILegendToolState<
    TProps extends ILegendToolProps = ILegendToolProps,
    TDefaults extends ILegendToolDefaults = ILegendToolDefaults,
    TConfig extends ILegendToolConfig = ILegendToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {

    /**
     * It returns the legend.
     */
    getLegend(): Control.Legend | null;

    /**
     * It sets legend.
     * 
     * @param legend
     */
    setLegend(legend: Control.Legend): void;


}
export default ILegendToolState;