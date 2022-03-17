// Geovisto core
import {
    IMapToolConfig
} from "../../../../../index.core";


/**
 * This interface provides specification of legend tool config model.
 * 
 * @author Tomas Koscielniak
 */
type ILegendToolConfig = IMapToolConfig & {
    state?: ILegendToolConfig[];
}
export default ILegendToolConfig;