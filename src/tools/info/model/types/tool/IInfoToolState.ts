// Geovisto core
import {
    IMapToolState
} from "../../../../../index.core";

import IInfoToolConfig from "./IInfoToolConfig";
import IInfoToolDefaults from "./IInfoToolDefaults";
import IInfoToolProps from "./IInfoToolProps";

/**
 * This indetrface declares functions for using filters.
 * 
 * @author Jiri Hynek
 */
interface IInfoToolState<
    TProps extends IInfoToolProps = IInfoToolProps,
    TDefaults extends IInfoToolDefaults = IInfoToolDefaults,
    TConfig extends IInfoToolConfig = IInfoToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {
    getContent(): void;
}
export default IInfoToolState;