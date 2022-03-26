import {
    FeatureCollection
} from 'geojson';

// Geovisto core
import {
    IMapDomain,
} from "../../../../../index.core";


/**
 * The interface declares functions for management of geographical data.
 *
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
interface IInfoData extends IMapDomain {

    /**
     * It returns the original source of geographical data.
     */
    getOriginalInfoData(): unknown;

    /**
     * It returns the original representation of data domain.
     */
    getInfoMD(): string;


}
export default IInfoData;