import IInfoTool from "./model/types/tool/IInfoTool";
import IInfoToolProps from "./model/types/tool/IInfoToolProps";
import InfoTool from "./model/internal/tool/InfoTool";
import InfoToolDefaults from "./model/internal/tool/InfoToolDefaults";

export const GeovistoInfoTool: {
    getType: () => string,
    createTool: (props?: IInfoToolProps) => IInfoTool
} = {
    getType: () => InfoToolDefaults.TYPE,
    createTool: (props) => new InfoTool(props),
};