import IMapToolState from "../tool/IMapToolState";
import ILayerToolConfig from "./ILayerToolConfig";
import ILayerToolDimensions from "./ILayerToolDimensions";
import ILayerToolDefaults from "./ILayerToolDefaults";
import ILayerToolProps from "./ILayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolState<
    TProps extends ILayerToolProps = ILayerToolProps,
    TDefaults extends ILayerToolDefaults = ILayerToolDefaults,
    TConfig extends ILayerToolConfig = ILayerToolConfig,
    TDimensions extends ILayerToolDimensions = ILayerToolDimensions
> extends IMapToolState<TProps, TDefaults, TConfig> {

    /**
     * It returns the layer dimensions property of the tool state.
     */
    getDimensions(): TDimensions;

    /**
     * It sets the layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    setDimensions(dimensions: TDimensions): void;

    /**
     * It returns the layer name property of the tool state.
     */
    getLayerName(): string;

    /**
     * It sets the layer name property of the tool state.
     * 
     * @param layerName 
     */
    setLayerName(layerName: string): void;

    /**
     * It returns the layer items property of the tool state.
     * 
     * TODO: specify the type
     */
    getLayerItems(): L.Layer[] | undefined;

    /**
     * It sets the layer items property of tool state.
     * 
     * @param layerItems 
     */
    setLayerItems(layerItems: L.Layer[]): void;
}
export default ILayerToolState;