// Geovisto core
import { IMapTool, IMapToolInitProps } from "../../../../../index.core";
import { IDataset } from "../dataset/TDatasets";

import IDataProviderToolConfig from "./IDataProviderToolConfig";
import IDataProviderToolDefaults from "./IDataProviderToolDefaults";
import IDataProviderToolProps from "./IDataProviderToolProps";
import IDataProviderToolState from "./IDataProviderToolState";

/**
 * This interface declares the data provider tool.
 * It provides methods for data provider management.
 *
 * @author Petr Knetl
 */
interface IDataProviderTool<
  TProps extends IDataProviderToolProps = IDataProviderToolProps,
  TDefaults extends IDataProviderToolDefaults = IDataProviderToolDefaults,
  TState extends IDataProviderToolState = IDataProviderToolState,
  TConfig extends IDataProviderToolConfig = IDataProviderToolConfig,
  TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends IMapTool<TProps, TDefaults, TState, TConfig, TInitProps> {
  /**
   * It creates a copy of the uninitialized tool.
   */
  copy(): IDataProviderTool;

  /**
   * It applies dataset geospatial data to the main map state.
   */
  importDatasetToMapState(dataset: IDataset): void;
}
export default IDataProviderTool;
