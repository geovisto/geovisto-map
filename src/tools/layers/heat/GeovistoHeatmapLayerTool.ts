import IHeatLayerTool from "./model/types/tool/IHeatLayerTool";
import IHeatLayerToolProps from "./model/types/tool/IHeatLayerToolProps";
import HeatLayerTool from "./model/internal/tool/HeatLayerTool";
import HeatLayerToolDefaults from "./model/internal/tool/HeatLayerToolDefaults";

export const GeovistoHeatmapLayerTool: {
    getType: () => string,
    createTool: (props?: IHeatLayerToolProps) => IHeatLayerTool
} = {
    getType: () => HeatLayerToolDefaults.TYPE,
    createTool: (props) => new HeatLayerTool(props),
};