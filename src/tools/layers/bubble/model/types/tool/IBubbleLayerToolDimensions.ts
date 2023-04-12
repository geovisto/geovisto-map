// Geovisto core
import {
    IIntegerRangeManager,
    ILayerToolDimensions,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterOperation,
    IMapTypeDimension,
} from "../../../../../../index.core";

/**
 * This type provides the specification of the bubble layer tool dimensions model.
 * 
 * @author Vladimir Korencik
 */
type IBubbleLayerToolDimensions = ILayerToolDimensions & {
    latitude: IMapDomainDimension<IMapDataDomain>;
    longitude: IMapDomainDimension<IMapDataDomain>;
    category: IMapDomainDimension<IMapDataDomain>;
    value: IMapDomainDimension<IMapDataDomain>;
    aggregation: IMapDomainDimension<IMapAggregationFunction>;
    color: IMapTypeDimension<string>;
    bubbleSize: IMapTypeDimension<number, IIntegerRangeManager>;
    categoryColorOp: IMapDomainDimension<IMapFilterOperation>;
    categoryColorValue: IMapTypeDimension<string>;
    categoryColor: IMapTypeDimension<string>;
};

export default IBubbleLayerToolDimensions;
