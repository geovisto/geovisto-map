import IInfoData from "../../types/infodata/IInfoData";
import IInfoDataFactory from "../../types/infodata/IInfoDataFactory";
import MarkDownData from "./markdown/MarkDownData";

/**
 * This class implements IInfoDataFactory
 *
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
class InfoDataFactory implements IInfoDataFactory {

    /**
     * It creates the Markdown info data object.
     */
    public markdown(name: string, data: string): IInfoData {
        return new MarkDownData(name, data);
    }
}
export default InfoDataFactory;