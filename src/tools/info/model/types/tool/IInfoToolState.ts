// Geovisto core
import {
    IMapToolState
} from "../../../../../index.core";

import IInfoData from "../infodata/IInfoData";
import IInfoDataManager from "../infodata/IInfoDataManager";
import IInfoToolConfig from "./IInfoToolConfig";
import IInfoToolDefaults from "./IInfoToolDefaults";
import IInfoToolProps from "./IInfoToolProps";

/**
 * This indetrface declares functions for using info data.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
interface IInfoToolState<
    TProps extends IInfoToolProps = IInfoToolProps,
    TDefaults extends IInfoToolDefaults = IInfoToolDefaults,
    TConfig extends IInfoToolConfig = IInfoToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {
    getContent(): void;
    getInfoDataManager(): IInfoDataManager | undefined;
    getMarkdown(): IInfoData | undefined;
    setMarkdown(md: IInfoData): void;
    setInfoDataManager(manager: IInfoDataManager): void;
    getDefaultFile(): string;
}
export default IInfoToolState;