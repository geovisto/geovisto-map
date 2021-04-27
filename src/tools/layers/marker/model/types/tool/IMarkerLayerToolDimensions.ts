import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";

/**
 * This interface provide specification of the marker layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolDimensions extends ILayerToolDimensions {
    geo: IMapDimension<IMapDataDomain>,
    value: IMapDimension<IMapDataDomain>,
    aggregation: IMapDimension<IMapAggregationFunction>,
    category: IMapDimension<IMapDataDomain>
}
export default IMarkerLayerToolDimensions;