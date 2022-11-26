import HeatLayerTool from "./model/internal/tool/HeatLayerTool";
import HeatLayerToolDefaults from "./model/internal/tool/HeatLayerToolDefaults";
import IHeatLayerTool from "./model/types/tool/IHeatLayerTool";
import IHeatLayerToolProps from "./model/types/tool/IHeatLayerToolProps";

export const GeovistoHeatLayerTool: {
    getType: () => string;
    createTool: (props?: IHeatLayerToolProps) => IHeatLayerTool;
} = {
    getType: () => HeatLayerToolDefaults.TYPE,
    createTool: (props) => new HeatLayerTool(props),
};
