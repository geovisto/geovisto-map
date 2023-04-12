// Geovisto core
import {
    ILayerToolDefaults,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterManager,
    IMapFilterOperation,
    IMapTypeDimension,
} from "../../../../../../index.core";

import ISpikeLayerToolDimensions from "./ISpikeLayerToolDimensions";

/**
 * This interface provides functions which return the default state values.
 * 
 * @author Vladimir Korencik
 */
interface ISpikeLayerToolDefaults extends ILayerToolDefaults {
    getFiltersManager(): IMapFilterManager

    getDimensions(map?: IMap): ISpikeLayerToolDimensions;

    getLatitudeDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getLongitudeDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getCategoryDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getValueDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getAggregationDimension(
        map?: IMap
    ): IMapDomainDimension<IMapAggregationFunction>;

    getColorDimension(): IMapTypeDimension<string>;

    getCategoryColorOperationDimension(): IMapDomainDimension<IMapFilterOperation>;

    getCategoryColorValueDimension(): IMapTypeDimension<string>;

    getCategoryColorDimension(): IMapTypeDimension<string>;
}

export default ISpikeLayerToolDefaults;
