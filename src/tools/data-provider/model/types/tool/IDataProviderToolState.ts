// Geovisto core
import { IMapToolState } from "../../../../../index.core";

import IDataProviderToolConfig from "./IDataProviderToolConfig";
import IDataProviderToolDefaults from "./IDataProviderToolDefaults";
import IDataProviderToolProps from "./IDataProviderToolProps";

/**
 * This interface declares functions for using data provider tool.
 *
 * @author Petr Knetl
 */
interface IDataProviderToolState<
  TProps extends IDataProviderToolConfig = IDataProviderToolConfig,
  TDefaults extends IDataProviderToolDefaults = IDataProviderToolDefaults,
  TConfig extends IDataProviderToolProps = IDataProviderToolProps
> extends IMapToolState<TProps, TDefaults, TConfig> {
  /**
   * It returns path to data provider API endpoint.
   */
  getDataSourceEndpoint(): string;

  /**
   * It updates path to data provider API endpoint.
   *
   * @param dataSourceEndpoint
   */
  setDataSourceEndpoint(dataSourceEndpoint: string): void;
}
export default IDataProviderToolState;
