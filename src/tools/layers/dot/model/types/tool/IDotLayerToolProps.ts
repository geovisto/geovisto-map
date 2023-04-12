// Geovisto core
import { ILayerToolProps } from "../../../../../../index.core";

import IDotLayerToolDimensions from "./IDotLayerToolDimensions";

/**
 * This type provides the specification of the dot layer tool props model.
 * 
 * @author Vladimir Korencik
 */
type IDotLayerToolProps = ILayerToolProps & {
    dimensions?: IDotLayerToolDimensions;
};

export default IDotLayerToolProps;
