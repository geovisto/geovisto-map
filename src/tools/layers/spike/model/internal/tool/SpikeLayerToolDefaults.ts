import { ISpikeLayerToolDefaults, ISpikeLayerToolDimensions } from "../../..";
import {
    CountAggregationFunction,
    EqFilterOperation,
    IMap,
    IMapAggregationFunction,
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
    SumAggregationFunction,
} from "../../../../../../index.core";


class SpikeLayerToolDefaults
    extends LayerToolDefaults
    implements ISpikeLayerToolDefaults
{
    public static TYPE = "geovisto-tool-layer-bubble";

    public getType(): string {
        return SpikeLayerToolDefaults.TYPE;
    }

    public getLayerName(): string {
        return "Spike layer";
    }

    public getLabel(): string {
        return this.getLayerName();
    }

    public getIcon(): string {
        return '<i class="fa fa-arrow-up"></i>';
    }

    public getFiltersManager(): IMapFilterManager {
    return new MapFiltersManager([
      new EqFilterOperation(),
      new NeqFilterOperation(),
      new RegFilterOperation(),
    ]);
  }

    public getDimensions(map?: IMap): ISpikeLayerToolDimensions {
        return {
            latitude: this.getLatitudeDimension(map),
            longitude: this.getLongitudeDimension(map),
            category: this.getCategoryDimension(map),
            value: this.getValueDimension(map),
            aggregation: this.getAggregationDimension(),
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

    public getValueDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Value",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getAggregationDimension(): IMapDomainDimension<IMapAggregationFunction> {
        const domainManager = new MapDomainArrayManager([
            new CountAggregationFunction(),
            new SumAggregationFunction(),
        ]);

        return new MapDomainDimension(
            "Aggregation",
            domainManager,
            domainManager.getDefault()
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

export default SpikeLayerToolDefaults;
