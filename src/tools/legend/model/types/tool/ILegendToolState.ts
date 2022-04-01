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
import IChoroplethLayerToolDimensions
    from "../../../../layers/choropleth/model/types/tool/IChoroplethLayerToolDimensions";

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

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    getDimensions(): IChoroplethLayerToolDimensions;

    /**
     * It returns the tabs configs.
     */
    getLegendConfig(): ILegendToolConfig[] | undefined;

    /**
     * It returns the tools to create a legend for.
     */
    getLegendToolsConfig(): string[] | undefined;


}
export default ILegendToolState;