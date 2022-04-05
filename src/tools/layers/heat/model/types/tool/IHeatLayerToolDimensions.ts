// Geovisto core
import {
    IGeoData,
    ILayerToolDimensions,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension
} from "../../../../../../index.core";

/**
 * This type provides the specification of the Heat layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IHeatLayerToolDimensions = ILayerToolDimensions & {
    geoData: IMapDomainDimension<IGeoData>,
    geoId: IMapDomainDimension<IMapDataDomain>,
    value: IMapDomainDimension<IMapDataDomain>,
    aggregation: IMapDomainDimension<IMapAggregationFunction>,
    category: IMapDomainDimension<IMapDataDomain>
}
export default IHeatLayerToolDimensions;