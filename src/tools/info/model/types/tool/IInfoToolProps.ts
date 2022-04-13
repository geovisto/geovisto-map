// Geovisto core
import {
    IMapToolProps
} from "../../../../../index.core";
import IInfoDataManager from "../infodata/IInfoDataManager";
import IInfoData from "../infodata/IInfoData";


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