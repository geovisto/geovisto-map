import { ILayerToolProps } from "../../../../../../index.core";
import IBubbleLayerToolDimensions from "./IBubbleLayerToolDimensions";

type IBubbleLayerToolProps = ILayerToolProps & {
    dimensions?: IBubbleLayerToolDimensions;
};

export default IBubbleLayerToolProps;
