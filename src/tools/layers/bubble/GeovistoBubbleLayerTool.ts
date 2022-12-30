import BubbleLayerTool from "./model/internal/tool/BubbleLayerTool";
import BubbleLayerToolDefaults from "./model/internal/tool/BubbleLayerToolDefaults";
import IBubbleLayerTool from "./model/types/tool/IBubbleLayerTool";
import IBubbleLayerToolProps from "./model/types/tool/IBubbleLayerToolProps";


export const GeovistoBubbleLayerTool: {
    getType: () => string;
    createTool: (props?: IBubbleLayerToolProps) => IBubbleLayerTool;
} = {
    getType: () => BubbleLayerToolDefaults.TYPE,
    createTool: (props) => new BubbleLayerTool(props),
};
