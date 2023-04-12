// Geovisto core
import {
    CountAggregationFunction,
    EqFilterOperation,
    IIntegerRangeManager,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterManager,
    IMapFilterOperation,
    IMapTypeDimension,
    IntegerRangeManager,
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

import IBubbleLayerToolDefaults from "../../types/tool/IBubbleLayerToolDefaults";
import IBubbleLayerToolDimensions from "../../types/tool/IBubbleLayerToolDimensions";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Vladimir Korencik
 */
class BubbleLayerToolDefaults
    extends LayerToolDefaults
    implements IBubbleLayerToolDefaults {
    public static TYPE = "geovisto-tool-layer-bubble";

    public getType(): string {
        return BubbleLayerToolDefaults.TYPE;
    }

    public getLayerName(): string {
        return "Bubble layer";
    }

    public getLabel(): string {
        return this.getLayerName();
    }

    public getIcon(): string {
        return '<i class="fa fa-pie-chart"></i>';
    }

    public getFiltersManager(): IMapFilterManager {
        return new MapFiltersManager([
            new EqFilterOperation(),
            new NeqFilterOperation(),
            new RegFilterOperation(),
        ]);
    }


    public getDimensions(map?: IMap): IBubbleLayerToolDimensions {
        return {
            latitude: this.getLatitudeDimension(map),
            longitude: this.getLongitudeDimension(map),
            category: this.getCategoryDimension(map),
            value: this.getValueDimension(map),
            aggregation: this.getAggregationDimension(),
            color: this.getColorDimension(),
            bubbleSize: this.getBubbleSizeDimension(),
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

    public getBubbleSizeDimension(): IMapTypeDimension<
        number,
        IIntegerRangeManager
    > {
        return new MapTypeDimension<number, IIntegerRangeManager>(
            "Bubble Size",
            new IntegerRangeManager(0, 20),
            0
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

export default BubbleLayerToolDefaults;
