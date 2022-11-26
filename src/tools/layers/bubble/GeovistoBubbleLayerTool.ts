import {
    BubbleLayerTool,
    BubbleLayerToolDefaults,
    IBubbleLayerTool,
    IBubbleLayerToolProps,
} from ".";

export const GeovistoBubbleLayerTool: {
    getType: () => string;
    createTool: (props?: IBubbleLayerToolProps) => IBubbleLayerTool;
} = {
    getType: () => BubbleLayerToolDefaults.TYPE,
    createTool: (props) => new BubbleLayerTool(props),
};
