import {
    IMapDomainArrayManager
} from "../../../../../index.core";

import IInfoData from "./IInfoData";

/**
 * The type represents geographical data manager.
 *
 * @author Jiri Hynek
 * Tomas Koscielniak
 */
type IInfoDataManager = IMapDomainArrayManager<IInfoData>;
export default IInfoDataManager;