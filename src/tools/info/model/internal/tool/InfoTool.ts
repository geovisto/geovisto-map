// Geovisto core
import {
    IMap,
    IMapForm,
    IMapFormControl,
    IMapToolInitProps,
    MapTool
} from "../../../../../index.core";

import IInfoTool from "../../types/tool/IInfoTool";
import IInfoToolConfig from "../../types/tool/IInfoToolConfig";
import IInfoToolDefaults from "../../types/tool/IInfoToolDefaults";
import IInfoToolProps from "../../types/tool/IInfoToolProps";
import IInfoToolState from "../../types/tool/IInfoToolState";
import InfoToolDefaults from "./InfoToolDefaults";
import InfoToolState from "./InfoToolState";
import InfoToolMapForm from "../form/InfoToolMapForm";

// styles
import "../../../styles/style.scss";
import IMapTheme from "../../../../themes/model/types/theme/IMapTheme";
import ThemesToolEvent from "../../../../themes/model/internal/event/ThemesToolEvent";
import IInfoData from "../../types/infodata/IInfoData";

/**
 * This class wraps filters, sidebar tab and state. It provides methods for filters management.
 * 
 * @author Jiri Hynek
 */
class InfoTool extends MapTool implements IInfoTool, IMapFormControl {

    /**
     * TODO: move to the state
     */
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props
     */
    public constructor(props?: IInfoToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IInfoTool {
        return new InfoTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IInfoToolProps {
        return <IInfoToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the filters tool.
     */
    public getDefaults(): IInfoToolDefaults {
        return <IInfoToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    public createDefaults(): IInfoToolDefaults {
        return new InfoToolDefaults();
    }

    /**
     * It returns the filters tool state.
     */
    public getState(): IInfoToolState {
        return <IInfoToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    public createState(): IInfoToolState {
        return new InfoToolState(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<IInfoToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates new filter tool.
     */
    public create(): this {
        this.getInfo();
        return this;
    }

    /**
     * It returns a map form.
     */
    public getMapForm(): IMapForm {
        if(this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    /**
     * It creates new map form.
     */
    protected createMapForm(): IMapForm {
        return new InfoToolMapForm(this);
    }

    /**
     * It updates filter rules and notifies listeners.
     * 
     */
    public getInfo(): void {
        this.createMapForm();
    }

    /**
     * It updates the theme and notifies listeners.
     *
     * @param markdown
     */
    public setMarkdown(markdown: IInfoData): void {
        if(markdown != undefined) {
            // if the theme tool is enabled, update map theme
            const map = this.getMap();
            if(this.isEnabled() && map) {

                // update tool state
                this.getState().setMarkdown(markdown);
            }
        }
    }
}
export default InfoTool;