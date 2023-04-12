// Geovisto core
import {
    IIntegerRangeManager,
    ILayerToolDefaults,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterManager,
    IMapFilterOperation,
    IMapTypeDimension,
} from "../../../../../../index.core";

import IBubbleLayerToolDimensions from "./IBubbleLayerToolDimensions";

/**
 * This interface provides functions which return the default state values.
 * 
 * @author Vladimir Korencik
 */
interface IBubbleLayerToolDefaults extends ILayerToolDefaults {
    getFiltersManager(): IMapFilterManager;

    getDimensions(map?: IMap): IBubbleLayerToolDimensions;

    getLatitudeDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getLongitudeDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getCategoryDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getValueDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getColorDimension(): IMapTypeDimension<string>;

    getAggregationDimension(
        map?: IMap
    ): IMapDomainDimension<IMapAggregationFunction>;

    getBubbleSizeDimension(): IMapTypeDimension<number, IIntegerRangeManager>;

    getCategoryColorOperationDimension(): IMapDomainDimension<IMapFilterOperation>;

    getCategoryColorValueDimension(): IMapTypeDimension<string>;

    getCategoryColorDimension(): IMapTypeDimension<string>;
}

export default IBubbleLayerToolDefaults;
