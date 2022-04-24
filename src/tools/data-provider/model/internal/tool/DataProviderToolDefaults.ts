// Geovisto core
import { MapToolDefaults } from "../../../../../index.core";

import IDataProviderToolConfig from "../../types/tool/IDataProviderToolConfig";

/**
 * This class provide functions which return the default state values.
 *
 * @author Petr Knetl
 */
class DataProviderToolDefaults extends MapToolDefaults {
  /**
   * It returns default config if no config is given.
   */
  public getConfig(): IDataProviderToolConfig {
    const config = <IDataProviderToolConfig>super.getConfig();
    config.dataSourceEndpoint = undefined;
    return config;
  }

  /**
   * Only one data provider tool instance should be present in the Geovisto map.
   */
  public isSingleton(): boolean {
    return true;
  }

  /**
   * Static tool type constant.
   */
  public static TYPE = "geovisto-tool-data-provider";

  /**
   * It returns a unique string of the tool type.
   */
  public getType(): string {
    return DataProviderToolDefaults.TYPE;
  }

  /**
   * It returns the label of the tool.
   */
  public getLabel(): string {
    return "Data Provider";
  }

  /**
   * It returns the icon of the tool.
   */
  public getIcon(): string {
    return '<i class="fa fa-database"></i>';
  }

  /**
   * It returns path to data provider API endpoint.
   */
  public getDataSourceEndpoint(): string {
    return "http://localhost:8000/datasets/";
  }
}
export default DataProviderToolDefaults;
