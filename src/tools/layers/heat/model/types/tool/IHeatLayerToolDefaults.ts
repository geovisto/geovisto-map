import {
    ILayerToolDefaults,
    IMap,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterManager,
    IMapFilterOperation,
    IMapTypeDimension,
} from "../../../../../../index.core";
import { IGradient } from "../gradient/IGradient";
import { IZoomLevel } from "../zoom/IZoomLevel";
import IHeatLayerToolDimensions from "./IHeatLayerToolDimensions";

interface IHeatLayerToolDefaults extends ILayerToolDefaults {
    getFiltersManager(): IMapFilterManager;

    getDimensions(map?: IMap): IHeatLayerToolDimensions;

    getLatitudeDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getLongitudeDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getIntensityDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getRadiusDimension(): IMapTypeDimension<number>;

    getGradientDimension(): IMapDomainDimension<IGradient>;

    getBlurDimension(): IMapTypeDimension<number>;

    getZoomDimension(): IMapDomainDimension<IZoomLevel>;

    getCurrentZoomDimension(): IMapTypeDimension<number>;

    getReactiveRadiusOperationDimension(): IMapDomainDimension<IMapFilterOperation>;

    getReactiveRadiusZoomDimension(): IMapTypeDimension<number>;

    getReactiveRadiusDimension(): IMapTypeDimension<number>;
}

export default IHeatLayerToolDefaults;
