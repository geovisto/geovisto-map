import IMapObject from "../object/IMapObject";
import IMapToolDefaults from "./IMapToolDefaults";
import IMapToolState from "./IMapToolState";
import IMapToolConfig from "./IMapToolConfig";
import IMap from "../map/IMap";
import IMapEvent from "../event/IMapEvent";
import IMapToolProps from "./IMapToolProps";

/**
 * This interface declares functions for using map tool which can be identified by uniquie string.
 * 
 * @author Jiri Hynek
 */
interface IMapTool<
    TProps extends IMapToolProps = IMapToolProps,
    TDefaults extends IMapToolDefaults = IMapToolDefaults,
    TState extends IMapToolState = IMapToolState,
    TConfig extends IMapToolConfig = IMapToolConfig
> extends IMapObject<TProps, TDefaults, TState, TConfig> {

    /**
     * It returns a logical value whether the tool type is singleton.
     */
    isSingleton(): boolean;

    /**
     * It initializes the tool before it is created.
     * It processes the serialized config and sets the Geovisto map which manages the tools.
     * 
     * This cannot be done in the tool constructor
     * since the tool can be created before the Geovisto map is created.
     * 
     * This cannot be done in the tool create function
     * since there can be possible dependencies between the tools
     * (the tool might depend on other tools which needs to be initialized).
     * 
     * @param initProps
     */
    initialize(initProps: { config: TConfig | undefined, map: IMap }): this;

    /**
     * Help function which returns map which uses this tool.
     */
    getMap(): IMap | undefined;

    /**
     * It creates a tool.
     */
    create(): this;

    /**
     * Help getter which returns enabled property of state.
     */
    isEnabled(): boolean

    /**
     * Some tools might be dynamicaly enabled/disabled.
     * This function is called externally when the tool is enabled/disabled.
     * 
     * @param enabled 
     */
    setEnabled(enabled: boolean): void

    /**
     * Help function which switches the enabled state (enabled/disabled).
     */
    switchEnabled(): void;

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event
     */
    handleEvent(event: IMapEvent): void;
}
export default IMapTool;