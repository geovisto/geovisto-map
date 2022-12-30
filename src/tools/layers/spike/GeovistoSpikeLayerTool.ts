import SpikeLayerTool from "./model/internal/tool/SpikeLayerTool";
import SpikeLayerToolDefaults from "./model/internal/tool/SpikeLayerToolDefaults";
import ISpikeLayerTool from "./model/types/tool/ISpikeLayerTool";
import ISpikeLayerToolProps from "./model/types/tool/ISpikeLayerToolProps";

export const GeovistoSpikeLayerTool: {
    getType: () => string;
    createTool: (props?: ISpikeLayerToolProps) => ISpikeLayerTool;
} = {
    getType: () => SpikeLayerToolDefaults.TYPE,
    createTool: (props) => new SpikeLayerTool(props),
};
