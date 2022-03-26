// Geovisto core
import {
    IMapDataDomain,
    IMapToolInitProps,
    MapToolState
} from "../../../../../index.core";

import IInfoToolState from "../../types/tool/IInfoToolState";
import IInfoTool from "../../types/tool/IInfoTool";
import IInfoToolConfig from "../../types/tool/IInfoToolConfig";
import IInfoToolProps from "../../types/tool/IInfoToolProps";
import IInfoToolDefaults from "../../types/tool/IInfoToolDefaults";

/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 */
class InfoToolState extends MapToolState implements IInfoToolState {
    
    private data: string | null;

    /**
     * It creates a tool state.
     * 
     * @param tool
     */
    public constructor(tool: IInfoTool) {
        super(tool);

        this.data = null;
    }

    public getContent(): string | null {
        return this.data;
    }


}
export default InfoToolState;