// Geovisto core
import {
    IMapToolConfig
} from "../../../../../index.core";

/**
 * This type provides specification of the info tool config model.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
type IInfoToolConfig = IMapToolConfig & {
    filterRules?: {
        domain: string,
        operation: string,
        pattern: string,
    }[];
}
export default IInfoToolConfig;