// Geovisto core
import { IMapToolDefaults } from "../../../../../index.core";

import IDataProviderToolConfig from "./IDataProviderToolConfig";
/**
 * This interface declares functions which return the default state values of data provider tool.
 *
 * @author Petr Knetl
 */
interface IDataProviderToolDefaults extends IMapToolDefaults {
  /**
   * It returns default config if no config is given.
   */
  getConfig(): IDataProviderToolConfig;

  /**
   * It returns path to data provider API endpoint.
   */
  getDataSourceEndpoint(): string;
}
export default IDataProviderToolDefaults;
