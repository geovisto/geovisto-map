// Geovisto core
import {
    ILayerToolDimensions,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterOperation,
    IMapTypeDimension,
} from "../../../../../../index.core";

import { IGradient } from "../gradient/IGradient";
import { IZoomLevel } from "../zoom/IZoomLevel";

/**
 * This type provides the specification of the heat layer tool dimensions model.
 * 
 * @author Vladimir Korencik
 */
type IHeatLayerToolDimensions = ILayerToolDimensions & {
    latitude: IMapDomainDimension<IMapDataDomain>;
    longitude: IMapDomainDimension<IMapDataDomain>;
    intensity: IMapDomainDimension<IMapDataDomain>;
    radius: IMapTypeDimension<number>;
    gradient: IMapDomainDimension<IGradient>;
    blur: IMapTypeDimension<number>;
    zoom: IMapDomainDimension<IZoomLevel>;
    currentZoom: IMapTypeDimension<number>;
    reactiveZoom: IMapTypeDimension<number>;
    reactiveOp: IMapDomainDimension<IMapFilterOperation>;
    reactiveRadius: IMapTypeDimension<number>;
};

export default IHeatLayerToolDimensions;
