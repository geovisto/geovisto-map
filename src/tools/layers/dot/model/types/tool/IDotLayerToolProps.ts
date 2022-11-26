import { ILayerToolProps } from "../../../../../../index.core";
import IDotLayerToolDimensions from "./IDotLayerToolDimensions";

type IDotLayerToolProps = ILayerToolProps & {
    dimensions?: IDotLayerToolDimensions;
};

export default IDotLayerToolProps;
