// Geovisto core
import {
    IMapToolInitProps,
    MapToolState
} from "../../../../../index.core";

import IInfoData from "../../types/infodata/IInfoData";
import IInfoDataManager from "../../types/infodata/IInfoDataManager";
import IInfoTool from "../../types/tool/IInfoTool";
import IInfoToolConfig from "../../types/tool/IInfoToolConfig";
import IInfoToolDefaults from "../../types/tool/IInfoToolDefaults";
import IInfoToolProps from "../../types/tool/IInfoToolProps";
import IInfoToolState from "../../types/tool/IInfoToolState";

/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
class InfoToolState extends MapToolState implements IInfoToolState {
    
    private data: string | null;
    private manager?: IInfoDataManager;
    private md_data?: IInfoData;
    private defaultFile: string;

    /**
     * It creates a tool state.
     * 
     * @param tool
     */
    public constructor(tool: IInfoTool) {
        super(tool);
        this.data = null;
        this.defaultFile = "";
    }

    /**
     * It resets the state with respect to the initial props.
     *
     * @param defaults
     * @param props
     * @param initProps
     */
    public initialize(defaults: IInfoToolDefaults, props: IInfoToolProps, initProps: IMapToolInitProps<IInfoToolConfig>): void {
        // set info manager
        this.setInfoDataManager(props.manager == undefined ? defaults.getInfoDataManager() : props.manager);

        // set info
        this.setMarkdown(props.md_data == undefined ? defaults.getMarkdown() : props.md_data);

        // initialize super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The method takes config and deserializes the values.
     *
     * @param config
     */
    public deserialize(config: IInfoToolConfig): void {
        super.deserialize(config);
        this.defaultFile = config.defaultFile;
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     *
     * @param defaults
     */
    public serialize(defaults: IInfoToolDefaults | undefined): IInfoToolConfig {
        const config: IInfoToolConfig = <IInfoToolConfig> super.serialize(defaults);
        config.defaultFile = this.getDefaultFile() ?? "";
        return config;
    }

    public getContent(): string | null {
        return this.data;
    }

    /**
     * It returns the markdown property of the tool state.
     */
    public getMarkdown(): IInfoData | undefined {
        return this.md_data;
    }

    /**
     * It returns the default file property of the tool state.
     */
    public getDefaultFile(): string {
        return this.defaultFile;
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
    public getInfoDataManager(): IInfoDataManager | undefined {
        return this.manager;
    }


}
export default InfoToolState;