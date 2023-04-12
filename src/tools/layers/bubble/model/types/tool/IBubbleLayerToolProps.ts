// Geovisto core
import { ILayerToolProps } from "../../../../../../index.core";

import IBubbleLayerToolDimensions from "./IBubbleLayerToolDimensions";

/**
 * This type provides the specification of the bubble layer tool props model.
 * 
 * @author Vladimir Korencik
 */
type IBubbleLayerToolProps = ILayerToolProps & {
    dimensions?: IBubbleLayerToolDimensions;
};

export default IBubbleLayerToolProps;
