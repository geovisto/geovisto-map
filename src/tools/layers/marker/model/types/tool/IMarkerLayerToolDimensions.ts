// Geovisto core
import {
    IGeoData,
    ILayerToolDimensions,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension, IMapTypeDimension
} from "../../../../../../index.core";

/**
 * This type provides the specification of the marker layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IMarkerLayerToolDimensions = ILayerToolDimensions & {
    geoData: IMapDomainDimension<IGeoData>,
    geoId: IMapDomainDimension<IMapDataDomain>,
    value: IMapDomainDimension<IMapDataDomain>,
    aggregation: IMapDomainDimension<IMapAggregationFunction>,
    category: IMapDomainDimension<IMapDataDomain>,
    units: IMapTypeDimension<string>,
    unitsDesc: IMapTypeDimension<string>,
    unitsEnabled: IMapTypeDimension<boolean>,
    round: IMapTypeDimension<number>
}
export default IMarkerLayerToolDimensions;