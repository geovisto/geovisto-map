import MapToolState from "../../../../../model/internal/tool/MapToolState";
import ISelectionToolState from "../../types/tool/ISelectionToolState";
import ISelectionTool from "../../types/tool/ISelectionTool";
import ISelectionToolConfig from "../../types/tool/ISelectionToolConfig";
import IMapSelection from "../../types/selection/IMapSelection";
import ISelectionToolProps from "../../types/tool/ISelectionToolProps";
import ISelectionToolDefaults from "../../types/tool/ISelectionToolDefaults";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import MapSelection from "../selection/MapSelection";
import { IMapToolInitProps } from "../../../../../model/types/tool/IMapToolProps";

/**
 * This class provide functions for using selections.
 * 
 * @author Jiri Hynek
 */
class SelectionToolState extends MapToolState implements ISelectionToolState {
    
    private selection!: IMapSelection | null;

    /**
     * It creates a tool state.
     */
    public constructor(tool: ISelectionTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     */
    public initialize(defaults: ISelectionToolDefaults, props: ISelectionToolProps, initProps: IMapToolInitProps<ISelectionToolConfig>): void {
        // set selection
        this.setSelection(props.selection == undefined ? defaults.getSelection() : props.selection);

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config
     */
    public deserialize(config: ISelectionToolConfig): void {
        super.deserialize(config);

        // deserialize selection
        if(config.selection) {
            const tool: IMapTool | undefined = this.getMap()?.getState().getTools().getById(config.selection.tool);
            if(tool) {
                this.setSelection(new MapSelection(tool, config.selection.ids));
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: ISelectionToolDefaults | undefined): ISelectionToolConfig {
        const config: ISelectionToolConfig = <ISelectionToolConfig> super.serialize(defaults);

        // serialize the selection
        const selection: IMapSelection | null = this.getSelection();
        if(selection && selection.getSrcIds().length > 0) {
            config.selection = {
                tool: selection.getTool().getId(),
                ids: selection.getSrcIds()
            };
        }

        return config;
    }

    /**
     * It returns the selection property of the tool state.
     */
    public getSelection(): IMapSelection | null {
        return this.selection;
    }

    /**
     * It sets the selection property of the tool state.
     * 
     * @param selection
     */
    public setSelection(selection: IMapSelection | null): void {
       this.selection = selection;
    }
}
export default SelectionToolState;