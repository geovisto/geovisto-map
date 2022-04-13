// Geovisto core
import {
    MapDomainArrayManager
} from "../../../../../index.core";

import IInfoData from "../../types/infodata/IInfoData";
import IInfoDataManager from "../../types/infodata/IInfoDataManager";

/**
 * The class provides a basic implemention info data manager.
 *
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
class InfoDataManager extends MapDomainArrayManager<IInfoData> implements IInfoDataManager {

    public constructor(infoDataArray: IInfoData[]) {
        super(infoDataArray);
    }
}
export default InfoDataManager;