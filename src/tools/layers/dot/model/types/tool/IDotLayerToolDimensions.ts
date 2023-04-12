// Geovisto core
import {
    ILayerToolDimensions,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterOperation,
    IMapTypeDimension,
} from "../../../../../../index.core";

/**
 * This type provides the specification of the dot layer tool dimensions model.
 * 
 * @author Vladimir Korencik
 */
type IDotLayerToolDimensions = ILayerToolDimensions & {
    latitude: IMapDomainDimension<IMapDataDomain>;
    longitude: IMapDomainDimension<IMapDataDomain>;
    category: IMapDomainDimension<IMapDataDomain>;
    color: IMapTypeDimension<string>;
    categoryColorOp: IMapDomainDimension<IMapFilterOperation>;
    categoryColorValue: IMapTypeDimension<string>;
    categoryColor: IMapTypeDimension<string>;
};

export default IDotLayerToolDimensions;
