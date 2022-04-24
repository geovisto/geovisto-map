import IDataProviderTool from "./model/types/tool/IDataProviderTool";
import IDataProviderToolProps from "./model/types/tool/IDataProviderToolProps";
import DataProviderTool from "./model/internal/tool/DataProviderTool";
import DataProviderToolDefaults from "./model/internal/tool/DataProviderToolDefaults";

/**
 * Geovisto wrapper for DataProviderTool.
 *
 * @author Petr Knetl
 */

export const GeovistoDataProviderTool: {
  getType: () => string;
  createTool: (props?: IDataProviderToolProps) => IDataProviderTool;
} = {
  getType: () => DataProviderToolDefaults.TYPE,
  createTool: (props) => new DataProviderTool(props),
};
