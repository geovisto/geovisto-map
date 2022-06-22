import IInfoData from "./IInfoData";

/**
 * This interface declares a factory for info data objects.
 *
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
interface IInfoDataFactory {

    /**
     * It creates the Markdown info data object.
     */
    markdown(name: string, data: string): IInfoData;
}
export default IInfoDataFactory;