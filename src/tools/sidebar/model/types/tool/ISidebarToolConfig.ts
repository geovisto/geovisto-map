import IMapToolConfig from "../../../../../model/types/tool/IMapToolConfig";
import ISidebarTabConfig from "../tab/ISidebarTabConfig";

/**
 * This interface provides specification of sidebar tool config model.
 * 
 * @author Jiri Hynek
 */
type ISidebarToolConfig = IMapToolConfig & {
    tabs: ISidebarTabConfig[] | undefined;
}
export default ISidebarToolConfig;