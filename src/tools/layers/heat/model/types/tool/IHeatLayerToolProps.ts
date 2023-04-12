// Geovisto core
import { ILayerToolProps } from "../../../../../../index.core";

import IHeatLayerToolDimensions from "./IHeatLayerToolDimensions";

/**
 * This type provides the specification of the heat layer tool props model.
 * 
 * @author Vladimir Korencik
 */
type IHeatLayerToolProps = ILayerToolProps & {
    dimensions?: IHeatLayerToolDimensions;
};

export default IHeatLayerToolProps;
