// Geovisto core
import { ILayerTool, IMapToolInitProps } from "../../../../../../index.core";

import { ISpikeLayerToolConfig } from "./ISpikeLayerToolConfig";
import ISpikeLayerToolDefaults from "./ISpikeLayerToolDefaults";
import ISpikeLayerToolProps from "./ISpikeLayerToolProps";
import ISpikeLayerToolState from "./ISpikeLayerToolState";

/**
 * This intreface declares the spike layer.
 * 
 * @author Vladimir Korencik
 */
interface ISpikeLayerTool<
    TProps extends ISpikeLayerToolProps = ISpikeLayerToolProps,
    TDefaults extends ISpikeLayerToolDefaults = ISpikeLayerToolDefaults,
    TState extends ISpikeLayerToolState = ISpikeLayerToolState,
    TConfig extends ISpikeLayerToolConfig = ISpikeLayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {
    /**
    * It creates a copy of the uninitialized tool.
    */
    copy(): ISpikeLayerTool;
}

export default ISpikeLayerTool;
