// Geovisto core
import {
    IMapToolDefaults
} from "../../../../../index.core";

import IInfoToolConfig from "./IInfoToolConfig";
import IInfoDataManager from "../infodata/IInfoDataManager";
import IInfoData from "../infodata/IInfoData";
/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
interface IInfoToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IInfoToolConfig;

    /**
     * It returns default info data manager.
     */
    getInfoDataManager(): IInfoDataManager;

    getMarkdown(): IInfoData;

}
export default IInfoToolDefaults;