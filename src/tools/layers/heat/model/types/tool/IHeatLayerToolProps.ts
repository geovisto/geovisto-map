// Geovisto core
import {
    IGeoDataManager,
    ILayerToolProps
} from "../../../../../../index.core";

import IHeatLayerToolDimensions from "./IHeatLayerToolDimensions";

/**
 * This type provides the specification of the marker layer tool props model.
 * 
 * @author Jiri Hynek
 */
type IHeatLayerToolProps = ILayerToolProps & {
    dimensions?: IHeatLayerToolDimensions;
    geoData?: IGeoDataManager;
}
export default IHeatLayerToolProps;