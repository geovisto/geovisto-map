import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISelectionToolProps from "./ISelectionToolProps";
import ISelectionToolDefaults from "./ISelectionToolDefaults";
import ISelectionToolState from "./ISelectionToolState";
import ISidebarFragmentControl from "../../../../sidebar/model/types/fragment/ISidebarFragmentControl";
import IMapSelection from "../selection/IMapSelection";

/**
 * This interface declares the selection tool.
 * 
 * @author Jiri Hynek
 */
interface ISelectionTool extends IMapTool, ISidebarFragmentControl {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ISelectionTool;

    /**
     * It returns the props given by the programmer.
     */
    getProps(): ISelectionToolProps;

    /**
     * It returns default values of the state properties.
     */
    getDefaults(): ISelectionToolDefaults;

    /**
     * It returns the sidebar tool state.
     */
    getState(): ISelectionToolState;

    /**
     * It updates selection and notifies listeners.
     * 
     * @param {IMapSelection} selection 
     */
    setSelection(selection: IMapSelection): void;
}
export default ISelectionTool;