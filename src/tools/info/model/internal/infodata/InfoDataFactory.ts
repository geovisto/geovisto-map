import IInfoData from "../../types/infodata/IInfoData";
import IInfoDataFactory from "../../types/infodata/IInfoDataFactory";
import MarkDownData from "./markdown/MarkDownData";

/**
 * This interface declares a factory for geographical data objects.
 *
 * @author Jiri Hynek
 */
class InfoDataFactory implements IInfoDataFactory {

    /**
     * It creates the GeoJSON geographical data object.
     */
    public markdown(name: string, data: unknown): IInfoData {
        return new MarkDownData(name, data);
    }
}
export default InfoDataFactory;