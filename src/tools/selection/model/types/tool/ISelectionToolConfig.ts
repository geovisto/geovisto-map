import IMapToolConfig from "../../../../../model/types/tool/IMapToolConfig";

/**
 * This interface provides specification of the selection tool config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface ISelectionToolConfig extends IMapToolConfig {
    selection: { 
        tool: string;
        ids: string[];
    } | undefined;
}
export default ISelectionToolConfig;