// Geovisto core
import {
    EqFilterOperation,
    IMap,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterManager,
    IMapFilterOperation,
    IMapTypeDimension,
    LayerToolDefaults,
    MapDomainArrayManager,
    MapDomainDimension,
    MapDynamicDomainDimension,
    MapFiltersManager,
    MapTypeDimension,
    NeqFilterOperation,
    RegFilterOperation,
    StringTypeManager,
} from "../../../../../../index.core";

// Internal
import IDotLayerToolDefaults from "../../types/tool/IDotLayerToolDefaults";
import IDotLayerToolDimensions from "../../types/tool/IDotLayerToolDimensions";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Vladimir Korencik
 */
class DotLayerToolDefaults
    extends LayerToolDefaults
    implements IDotLayerToolDefaults {
    public static TYPE = "geovisto-tool-layer-dot";

    public getType(): string {
        return DotLayerToolDefaults.TYPE;
    }

    public getLayerName(): string {
        return "Dot layer";
    }

    public getLabel(): string {
        return this.getLayerName();
    }

    public getIcon(): string {
        return '<i class="fa fa-dot-circle-o"></i>';
    }

    public getFiltersManager(): IMapFilterManager {
        return new MapFiltersManager([
            new RegFilterOperation(),
            new EqFilterOperation(),
            new NeqFilterOperation(),
        ]);
    }


    public getDimensions(map?: IMap): IDotLayerToolDimensions {
        return {
            latitude: this.getLatitudeDimension(map),
            longitude: this.getLongitudeDimension(map),
            category: this.getCategoryDimension(map),
            color: this.getColorDimension(),
            categoryColorOp: this.getCategoryColorOperationDimension(),
            categoryColorValue: this.getCategoryColorValueDimension(),
            categoryColor: this.getCategoryColorDimension(),
        };
    }

    public getLatitudeDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Latitude",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getLongitudeDimension(
        map?: IMap
    ): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Longitude",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getCategoryDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Category",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getColorDimension(): IMapTypeDimension<string> {
        return new MapTypeDimension<string>(
            "Color",
            new StringTypeManager(),
            "#E32400"
        );
    }

    public getCategoryColorOperationDimension(): IMapDomainDimension<IMapFilterOperation> {
        const domainManager = new MapDomainArrayManager([
            new RegFilterOperation(),
            new EqFilterOperation(),
            new NeqFilterOperation(),
        ]);

        return new MapDomainDimension(
            "Operation",
            domainManager,
            domainManager.getDefault()
        );
    }

    public getCategoryColorValueDimension(): IMapTypeDimension<string> {
        return new MapTypeDimension<string>("Value", new StringTypeManager(), "");
    }

    public getCategoryColorDimension(): IMapTypeDimension<string> {
        return new MapTypeDimension<string>(
            "Color",
            new StringTypeManager(),
            "#E32400"
        );
    }
}

export default DotLayerToolDefaults;
