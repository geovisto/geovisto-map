// Geovisto core
import {
    ILayerToolDimensions,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterOperation,
    IMapTypeDimension,
} from "../../../../../../index.core";

/**
 * This type provides the specification of the spike layer tool dimensions model.
 * 
 * @author Vladimir Korencik
 */
type ISpikeLayerToolDimensions = ILayerToolDimensions & {
    latitude: IMapDomainDimension<IMapDataDomain>;
    longitude: IMapDomainDimension<IMapDataDomain>;
    category: IMapDomainDimension<IMapDataDomain>;
    value: IMapDomainDimension<IMapDataDomain>;
    aggregation: IMapDomainDimension<IMapAggregationFunction>;
    color: IMapTypeDimension<string>;
    categoryColorOp: IMapDomainDimension<IMapFilterOperation>;
    categoryColorValue: IMapTypeDimension<string>;
    categoryColor: IMapTypeDimension<string>;
};

export default ISpikeLayerToolDimensions;
