import IInfoData from "./IInfoData";
import {
    IMapDomainArrayManager
} from "../../../../../index.core";

/**
 * The type represents geographical data manager.
 *
 * @author Jiri Hynek
 */
type IInfoDataManager = IMapDomainArrayManager<IInfoData>;
export default IInfoDataManager;