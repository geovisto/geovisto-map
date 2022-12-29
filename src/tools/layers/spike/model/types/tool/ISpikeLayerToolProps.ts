import { ILayerToolProps } from "../../../../../../index.core";
import ISpikeLayerToolDimensions from "./ISpikeLayerToolDimensions";

type ISpikeLayerToolProps = ILayerToolProps & {
    dimensions?: ISpikeLayerToolDimensions;
};

export default ISpikeLayerToolProps;
