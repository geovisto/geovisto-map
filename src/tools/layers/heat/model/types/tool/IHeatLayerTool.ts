// Geovisto core
import { ILayerTool, IMapToolInitProps } from "../../../../../../index.core";

import { IHeatLayerToolConfig } from "./IHeatLayerToolConfig";
import IHeatLayerToolDefaults from "./IHeatLayerToolDefaults";
import IHeatLayerToolProps from "./IHeatLayerToolProps";
import IHeatLayerToolState from "./IHeatLayerToolState";

/**
 * This intreface declares the heat layer.
 * 
 * @author Vladimir Korencik
 */
interface IHeatLayerTool<
    TProps extends IHeatLayerToolProps = IHeatLayerToolProps,
    TDefaults extends IHeatLayerToolDefaults = IHeatLayerToolDefaults,
    TState extends IHeatLayerToolState = IHeatLayerToolState,
    TConfig extends IHeatLayerToolConfig = IHeatLayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {
    /**
   * It creates a copy of the uninitialized tool.
   */
    copy(): IHeatLayerTool;
}

export default IHeatLayerTool;
