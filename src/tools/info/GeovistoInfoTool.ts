import IInfoData from "./model/types/infodata/IInfoData";
import IInfoDataFactory from "./model/types/infodata/IInfoDataFactory";
import IInfoDataManager from "./model/types/infodata/IInfoDataManager";
import IInfoTool from "./model/types/tool/IInfoTool";
import IInfoToolProps from "./model/types/tool/IInfoToolProps";
import InfoDataFactory from "./model/internal/infodata/InfoDataFactory";
import InfoDataManager from "./model/internal/infodata/InfoDataManager";
import InfoTool from "./model/internal/tool/InfoTool";
import InfoToolDefaults from "./model/internal/tool/InfoToolDefaults";

export const GeovistoInfoTool: {
    getType: () => string,
    createTool: (props?: IInfoToolProps) => IInfoTool,
    createInfoManager: (infoDataArray: IInfoData[]) => IInfoDataManager,
    getInfoDataFactory: () => IInfoDataFactory
} = {
    getType: () => InfoToolDefaults.TYPE,
    createTool: (props) => new InfoTool(props),
    createInfoManager: (infoDataArray) => new InfoDataManager(infoDataArray),
    getInfoDataFactory: () => new InfoDataFactory()
};