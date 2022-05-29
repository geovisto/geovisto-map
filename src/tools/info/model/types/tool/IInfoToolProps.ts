// Geovisto core
import {
    IMapToolProps
} from "../../../../../index.core";

import IInfoData from "../infodata/IInfoData";
import IInfoDataManager from "../infodata/IInfoDataManager";

/**
 * This type provides the specification of the info tool props model.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
type IInfoToolProps = IMapToolProps & {
    manager?: IInfoDataManager;
    md_data?: IInfoData;
}
export default IInfoToolProps;