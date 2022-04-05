// Leaflet
import {
    LatLngExpression
} from "leaflet";

// Geovisto core
import {
    IGeoData,
    ILayerToolDefaults,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension
} from "../../../../../../index.core";

import IHeatLayerToolDimensions from "./IHeatLayerToolDimensions";

/**
 * This interface provides functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IHeatLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(map?: IMap): IHeatLayerToolDimensions;

    /**
     * It returns the default geo data dimension.
     */
    getGeoDataDimension(map?: IMap): IMapDomainDimension<IGeoData>;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoIdDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDomainDimension<IMapAggregationFunction>;

    /**
     * It returns the default category dimension.
     */
    getCategoryDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;
    
    /**
     * It returns the default geo data.
     */
    getGeoData(): IGeoData[];
}
export default IHeatLayerToolDefaults;