// Geovisto core
import { IMapToolConfig } from "../../../../../index.core";

/**
 * This type provides specification of the data provider tool config model.
 *
 * @author Petr Knetl
 */
type IDataProviderToolConfig = IMapToolConfig & {
  dataSourceEndpoint?: string;
};
export default IDataProviderToolConfig;
