// Geovisto core
import {
    IMapDomain,
} from "../../../../../index.core";


/**
 * The interface declares functions for management of info data.
 *
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
interface IInfoData extends IMapDomain {

    /**
     * It returns the original source of info data.
     */
    getOriginalInfoData(): unknown;

    /**
     * It returns the original representation of data domain.
     */
    getInfoMD(): string;


}
export default IInfoData;