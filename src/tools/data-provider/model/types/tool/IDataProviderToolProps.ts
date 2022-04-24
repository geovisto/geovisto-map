// Geovisto core
import { IMapToolProps } from "../../../../../index.core";

/**
 * This type provides the specification of the data provider tool props model.
 *
 * @author Petr Knetl
 */
type IDataProviderToolProps = IMapToolProps & {
  dataSourceEndpoint?: string;
};
export default IDataProviderToolProps;
