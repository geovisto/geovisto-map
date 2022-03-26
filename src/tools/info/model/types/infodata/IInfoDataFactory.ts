import IInfoData from "./IInfoData";

/**
 * This interface declares a factory for geographical data objects.
 *
 * @author Jiri Hynek
 */
interface IInfoDataFactory {

    /**
     * It creates the GeoJSON geographical data object.
     */
    markdown(name: string, data: unknown): IInfoData;
}
export default IInfoDataFactory;