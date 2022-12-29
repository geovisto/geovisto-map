import DotLayerTool from "./model/internal/tool/DotLayerTool";
import DotLayerToolDefaults from "./model/internal/tool/DotLayerToolDefaults";
import IDotLayerTool from "./model/types/tool/IDotLayerTool";
import IDotLayerToolProps from "./model/types/tool/IDotLayerToolProps";

export const GeovistoDotLayerTool: {
    getType: () => string;
    createTool: (props?: IDotLayerToolProps) => IDotLayerTool;
} = {
    getType: () => DotLayerToolDefaults.TYPE,
    createTool: (props) => new DotLayerTool(props),
};
