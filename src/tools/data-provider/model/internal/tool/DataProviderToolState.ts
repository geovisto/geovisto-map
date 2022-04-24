// Geovisto core
import { IMapToolInitProps, MapToolState } from "../../../../../index.core";

import IDataProviderToolState from "../../types/tool/IDataProviderToolState";
import IDataProviderTool from "../../types/tool/IDataProviderTool";
import IDataProviderToolConfig from "../../types/tool/IDataProviderToolConfig";
import IDataProviderToolProps from "../../types/tool/IDataProviderToolProps";
import IDataProviderToolDefaults from "../../types/tool/IDataProviderToolDefaults";

/**
 * This class provide functions for using data provider.
 *
 * @author Petr Knetl
 */
class DataProviderToolState
  extends MapToolState
  implements IDataProviderToolState
{
  private dataSourceEndpoint!: string;

  /**
   * It creates a tool state.
   *
   * @param tool
   */
  public constructor(tool: IDataProviderTool) {
    super(tool);
  }

  /**
   * It resets state with respect to initial props.
   */
  public initialize(
    defaults: IDataProviderToolDefaults,
    props: IDataProviderToolProps,
    initProps: IMapToolInitProps<IDataProviderToolConfig>
  ): void {
    this.setDataSourceEndpoint(
      props.dataSourceEndpoint == undefined
        ? defaults.getDataSourceEndpoint()
        : props.dataSourceEndpoint
    );

    // set super props
    super.initialize(defaults, props, initProps);
  }

  /**
   * The metod takes config and deserializes the values.
   *
   * @param config
   */
  public deserialize(config: IDataProviderToolConfig): void {
    super.deserialize(config);

    // set backend endpoint path
    if (config.dataSourceEndpoint) {
      this.setDataSourceEndpoint(config.dataSourceEndpoint);
    }
  }

  /**
   * It returns path to data provider API endpoint.
   */
  public getDataSourceEndpoint(): string {
    return this.dataSourceEndpoint;
  }

  /**
   * It updates path to data provider API endpoint.
   *
   * @param dataSourceEndpoint
   */
  public setDataSourceEndpoint(dataSourceEndpoint: string): void {
    this.dataSourceEndpoint = dataSourceEndpoint;
  }
}
export default DataProviderToolState;
