// Geovisto core
import {
    IMapToolDefaults
} from "../../../../../index.core";

import IInfoToolConfig from "./IInfoToolConfig";
/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IInfoToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IInfoToolConfig;

}
export default IInfoToolDefaults;