// Geovisto core
import {
    IMapToolInitProps,
    MapToolState
} from "../../../../../index.core";

import IInfoToolState from "../../types/tool/IInfoToolState";
import IInfoTool from "../../types/tool/IInfoTool";
import IInfoToolConfig from "../../types/tool/IInfoToolConfig";
import IInfoToolProps from "../../types/tool/IInfoToolProps";
import IInfoToolDefaults from "../../types/tool/IInfoToolDefaults";
import IInfoDataManager from "../../types/infodata/IInfoDataManager";
import IInfoData from "../../types/infodata/IInfoData";

/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
class InfoToolState extends MapToolState implements IInfoToolState {
    
    private data: string | null;
    private manager: IInfoDataManager;
    private md_data: IInfoData;

    /**
     * It creates a tool state.
     * 
     * @param tool
     */
    public constructor(tool: IInfoTool) {
        super(tool);
    }

    /**
     * It resets the state with respect to the initial props.
     *
     * @param defaults
     * @param props
     * @param initProps
     */
    public initialize(defaults: IInfoToolDefaults, props: IInfoToolProps, initProps: IMapToolInitProps<IInfoToolConfig>): void {
        // set theme manager - needs to be set before the theme
        this.setInfoDataManager(props.manager == undefined ? defaults.getInfoDataManager() : props.manager);

        // set theme
        this.setMarkdown(props.md_data == undefined ? defaults.getMarkdown() : props.md_data);

        // initialize super props
        super.initialize(defaults, props, initProps);
    }

    public getContent(): string | null {
        return this.data;
    }

    /**
     * It returns the markdown property of the tool state.
     */
    public getMarkdown(): IInfoData {
        return this.md_data;
    }

    /**
     * It sets the markdown property of the tool state.
     *
     * @param md
     */
    public setMarkdown(md: IInfoData): void {
        this.md_data = md;
    }

    /**
     * It sets markdown manager.
     *
     * @param manager
     */
    public setInfoDataManager(manager: IInfoDataManager): void {
        this.manager = manager;
    }

    /**
     * It returns markdown manager.
     */
    public getInfoDataManager(): IInfoDataManager {
        return this.manager;
    }


}
export default InfoToolState;