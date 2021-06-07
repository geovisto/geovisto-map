import IMapObject from "../../../../../model/types/object/IMapObject";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarTabConfig from "./ISidebarTabConfig";
import ISidebarTabDefaults from "./ISidebarTabDefaults";
import { ISidebarTabProps, ISidebarTabInitProps } from "./ISidebarTabProps";
import ISidebarTabState from "./ISidebarTabState";
import ISidebarFragment from "../fragment/ISidebarFragment";

/**
 * This interface declares functions for the sidebar tab.
 * It contains enable button which enables the sidebar and tool.
 *
 * @author Jiri Hynek
 */
interface ISidebarTab<
    TProps extends ISidebarTabProps = ISidebarTabProps,
    TDefaults extends ISidebarTabDefaults = ISidebarTabDefaults,
    TState extends ISidebarTabState = ISidebarTabState,
    TConfig extends ISidebarTabConfig = ISidebarTabConfig,
    TInitProps extends ISidebarTabInitProps<TConfig> = ISidebarTabInitProps<TConfig>
> extends IMapObject<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * Help function which returns the tool from the state.
     */
    getTool(): IMapTool;

    /**
     * Functions changes layer state to enabled/disabled.
     *
     * @param checked
     */
    setChecked(checked: boolean): void;

    /**
     * It returns the fragments property of the sidebar tab state.
     */
    getFragments(): ISidebarFragment[] | undefined;

    /**
     * It creates the sidebar tab
     */
    create(): this;
}
export default ISidebarTab;