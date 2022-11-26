import {
    SpikeLayerTool,
    SpikeLayerToolDefaults,
    ISpikeLayerTool,
    ISpikeLayerToolProps,
} from ".";

export const GeovistoSpikeLayerTool: {
    getType: () => string;
    createTool: (props?: ISpikeLayerToolProps) => ISpikeLayerTool;
} = {
    getType: () => SpikeLayerToolDefaults.TYPE,
    createTool: (props) => new SpikeLayerTool(props),
};
