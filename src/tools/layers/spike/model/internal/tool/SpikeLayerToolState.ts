// Geovisto core
import {
    IMapFilterManager,
    IMapToolInitProps,
    LayerToolState,
} from "../../../../../../index.core";

import { ICategoryColorRules } from "../../types/categoryColor/ICategoryColor";
import ISpikeLayerTool from "../../types/tool/ISpikeLayerTool";
import {
    ISpikeLayerToolConfig,
    ISpikeLayerToolDimensionsConfig,
} from "../../types/tool/ISpikeLayerToolConfig";
import ISpikeLayerToolDefaults from "../../types/tool/ISpikeLayerToolDefaults";
import ISpikeLayerToolDimensions from "../../types/tool/ISpikeLayerToolDimensions";
import ISpikeLayerToolProps from "../../types/tool/ISpikeLayerToolProps";
import ISpikeLayerToolState, {
    IWorkData,
} from "../../types/tool/ISpikeLayerToolState";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Vladimir Korencik
 */
class SpikeLayerToolState
    extends LayerToolState
    implements ISpikeLayerToolState {
    private layer?: L.LayerGroup;
    private markers: L.Marker[];
    private workData: IWorkData[];
    private categoryColorRules!: ICategoryColorRules[];
    private manager!: IMapFilterManager;

    public constructor(tool: ISpikeLayerTool) {
        super(tool);

        this.markers = [];
        this.workData = [];
        this.categoryColorRules = [];
    }

    public initialize(
        defaults: ISpikeLayerToolDefaults,
        props: ISpikeLayerToolProps,
        initProps: IMapToolInitProps<ISpikeLayerToolConfig>
    ): void {
        if (props.dimensions) {
            this.setDimensions({
                latitude:
                    props.dimensions.latitude === undefined
                        ? defaults.getLatitudeDimension(initProps.map)
                        : props.dimensions.latitude,
                longitude:
                    props.dimensions.longitude === undefined
                        ? defaults.getLongitudeDimension(initProps.map)
                        : props.dimensions.longitude,
                category:
                    props.dimensions.category === undefined
                        ? defaults.getCategoryDimension(initProps.map)
                        : props.dimensions.category,
                value:
                    props.dimensions.value === undefined
                        ? defaults.getValueDimension(initProps.map)
                        : props.dimensions.value,
                aggregation:
                    props.dimensions.aggregation == undefined
                        ? defaults.getAggregationDimension()
                        : props.dimensions.aggregation,
                color:
                    props.dimensions.color == undefined
                        ? defaults.getColorDimension()
                        : props.dimensions.color,
                categoryColorOp:
                    props.dimensions.categoryColorOp === undefined
                        ? defaults.getCategoryColorOperationDimension()
                        : props.dimensions.categoryColorOp,
                categoryColorValue:
                    props.dimensions.categoryColorValue === undefined
                        ? defaults.getCategoryColorValueDimension()
                        : props.dimensions.categoryColorValue,
                categoryColor:
                    props.dimensions.categoryColor == undefined
                        ? defaults.getCategoryColorDimension()
                        : props.dimensions.categoryColor,
            });
        } else {
            this.setDimensions(defaults.getDimensions(initProps.map));
        }

        this.setFiltersManager(defaults.getFiltersManager());

        super.initialize(defaults, props, initProps);
    }

    public deserialize(config: ISpikeLayerToolConfig): void {
        super.deserialize(config);

        const rules: ICategoryColorRules[] = [];
        if (!config.categoryColorRules) {
            return;
        }

        config.categoryColorRules.forEach((filter) => {
            const operationName = filter.operation?.getName();
            if (operationName) {
                const operation = this
                    .getFiltersManager()
                    .getDomain(operationName);
                if (operation) {
                    rules.push({
                        operation,
                        value: filter.value,
                        color: filter.color,
                    });
                }
            }
        });
        config.categoryColorRules = rules;
        this.setCategoryColorRules(config.categoryColorRules);
    }

    public deserializeDimensions(
        dimensionsConfig: ISpikeLayerToolDimensionsConfig
    ): void {
        const dimensions = this.getDimensions();

        if (dimensionsConfig.latitude)
            dimensions.latitude.setValue(
                dimensions.latitude
                    .getDomainManager()
                    .getDomain(dimensionsConfig.latitude)
            );
        if (dimensionsConfig.longitude)
            dimensions.longitude.setValue(
                dimensions.longitude
                    .getDomainManager()
                    .getDomain(dimensionsConfig.longitude)
            );
        if (dimensionsConfig.category)
            dimensions.category.setValue(
                dimensions.category
                    .getDomainManager()
                    .getDomain(dimensionsConfig.category)
            );
        if (dimensionsConfig.value)
            dimensions.value.setValue(
                dimensions.value.getDomainManager().getDomain(dimensionsConfig.value)
            );
        if (dimensionsConfig.aggregation)
            dimensions.aggregation.setValue(
                dimensions.aggregation
                    .getDomainManager()
                    .getDomain(dimensionsConfig.aggregation)
            );
        if (dimensionsConfig.color)
            dimensions.color.setValue(dimensionsConfig.color);

        if (dimensionsConfig.categoryColorOp)
            dimensions.categoryColorOp.setValue(
                dimensions.categoryColorOp
                    .getDomainManager()
                    .getDomain(dimensionsConfig.categoryColorOp)
            );
        if (dimensionsConfig.categoryColorValue)
            dimensions.categoryColorValue.setValue(
                dimensionsConfig.categoryColorValue
            );

        if (dimensionsConfig.categoryColor)
            dimensions.categoryColor.setValue(dimensionsConfig.categoryColor);
    }

    public serialize(
        defaults: ISpikeLayerToolDefaults | undefined
    ): ISpikeLayerToolConfig {
        const config: ISpikeLayerToolConfig = <ISpikeLayerToolConfig>(
            super.serialize(defaults)
        );

        config.categoryColorRules = [];
        this.categoryColorRules.forEach((filter: ICategoryColorRules) => {
            config.categoryColorRules?.push({
                operation: filter.operation,
                value: filter.value,
                color: filter.color,
            });
        });

        const dimensions = this.getDimensions();

        config.data = {
            latitude: dimensions.latitude.getValue()?.getName(),
            longitude: dimensions.longitude.getValue()?.getName(),
            category: dimensions.category.getValue()?.getName(),
            value: dimensions.value.getValue()?.getName(),
            aggregation: dimensions.aggregation.getValue()?.getName(),
            color: dimensions.color.getValue(),
            categoryColorOp: dimensions.categoryColorOp.getValue()?.getName(),
            categoryColorValue: dimensions.categoryColorValue.getValue(),
            categoryColor: dimensions.categoryColor.getValue(),
        };

        return config;
    }

    public getFiltersManager(): IMapFilterManager {
        return this.manager;
    }

    public setFiltersManager(manager: IMapFilterManager): void {
        this.manager = manager;
    }


    public getDimensions(): ISpikeLayerToolDimensions {
        return super.getDimensions() as ISpikeLayerToolDimensions;
    }

    public setDimensions(dimensions: ISpikeLayerToolDimensions): void {
        super.setDimensions(dimensions);
    }

    public getLayer(): L.LayerGroup | undefined {
        return this.layer;
    }

    public setLayer(layer: L.LayerGroup): void {
        this.layer = layer;
    }

    public getMarkers(): L.Marker[] {
        return this.markers;
    }

    public setMarkers(markers: L.Marker[]): void {
        this.markers = markers;
    }

    public setCategoryColorRules(rules: ICategoryColorRules[]): void {
        this.categoryColorRules = rules;
    }

    public getCategoryColorRules(): ICategoryColorRules[] {
        return this.categoryColorRules;
    }

    public setWorkData(workData: Array<IWorkData>): void {
        this.workData = workData;
    }

    public getWorkData(): Array<IWorkData> {
        return this.workData;
    }
}

export default SpikeLayerToolState;
