// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IMap from "../../../../../../model/types/map/IMap";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";

import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";
/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(map?: IMap): IConnectionLayerToolDimensions;

    /**
     * It returns the default geo data dimension.
     */
    getGeoDataDimension(map?: IMap): IMapDimension<IGeoData>;

    /**
     * It returns the default geo source ID dimension.
     */
    getFromDimension(map?: IMap): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default geo target ID dimension.
     */
    getToDimension(map?: IMap): IMapDimension<IMapDataDomain>;
    
    /**
     * It returns optiomal zoom for D3 projections.
     */
    getProjectionZoom(): number;
    
    /**
     * It returns the default geo data.
     */
    getGeoData(): IGeoData[];
}
export default IConnectionLayerToolDefaults;