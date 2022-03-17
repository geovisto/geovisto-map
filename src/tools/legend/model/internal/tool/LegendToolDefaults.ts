// Geovisto core
import {MapToolDefaults} from "../../../../../index.core";

import ILegendToolConfig from "../../types/tool/ILegendToolConfig";
import ILegendToolDefaults from "../../types/tool/ILegendToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Tomas Koscielniak
 */
class LegendToolDefaults extends MapToolDefaults implements ILegendToolDefaults {

    /**
     * It returns the default config.
     */
    public getConfig(): ILegendToolConfig {
        return <ILegendToolConfig>super.getConfig();
    }

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-legend";

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return LegendToolDefaults.TYPE;
    }


}
export default LegendToolDefaults;