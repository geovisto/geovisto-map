import { ILayerTool, IMapToolInitProps } from "../../../../../../index.core";
import { IDotLayerToolConfig } from "./IDotLayerToolConfig";
import IDotLayerToolDefaults from "./IDotLayerToolDefaults";
import IDotLayerToolProps from "./IDotLayerToolProps";
import IDotLayerToolState from "./IDotLayerToolState";

interface IDotLayerTool<
    TProps extends IDotLayerToolProps = IDotLayerToolProps,
    TDefaults extends IDotLayerToolDefaults = IDotLayerToolDefaults,
    TState extends IDotLayerToolState = IDotLayerToolState,
    TConfig extends IDotLayerToolConfig = IDotLayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {
    copy(): IDotLayerTool;
}

export default IDotLayerTool;
