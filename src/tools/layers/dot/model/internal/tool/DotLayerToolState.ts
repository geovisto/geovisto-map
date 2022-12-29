import { CircleMarker } from "leaflet";
import {
    IMapFilterManager,
    IMapToolInitProps,
    LayerToolState,
} from "../../../../../../index.core";
import { ICategoryColorRules } from "../../types/categoryColor.ts/ICategoryColor";
import IDotLayerTool from "../../types/tool/IDotLayerTool";
import {
    IDotLayerToolConfig,
    IDotLayerToolDimensionsConfig,
} from "../../types/tool/IDotLayerToolConfig";
import IDotLayerToolDefaults from "../../types/tool/IDotLayerToolDefaults";
import IDotLayerToolDimensions from "../../types/tool/IDotLayerToolDimensions";
import IDotLayerToolProps from "../../types/tool/IDotLayerToolProps";
import IDotLayerToolState, {
    IWorkData,
} from "../../types/tool/IDotLayerToolState";

class DotLayerToolState extends LayerToolState implements IDotLayerToolState {
    private layer?: L.LayerGroup;
    private markers: CircleMarker[];
    private categoryColorRules!: ICategoryColorRules[];
    private latlngs!: Array<IWorkData>;
    private manager!: IMapFilterManager;


    public constructor(tool: IDotLayerTool) {
        super(tool);

        this.markers = [];
        this.categoryColorRules = [];
        this.latlngs = [];
    }

    public initialize(
        defaults: IDotLayerToolDefaults,
        props: IDotLayerToolProps,
        initProps: IMapToolInitProps<IDotLayerToolConfig>
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
                color:
                    props.dimensions.color == undefined
                        ? defaults.getCategoryColorDimension()
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

    public deserialize(config: IDotLayerToolConfig): void {
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
        dimensionsConfig: IDotLayerToolDimensionsConfig
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
        defaults: IDotLayerToolDefaults | undefined
    ): IDotLayerToolConfig {
        const config: IDotLayerToolConfig = <IDotLayerToolConfig>(
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

    public getDimensions(): IDotLayerToolDimensions {
        return super.getDimensions() as IDotLayerToolDimensions;
    }

    public setDimensions(dimensions: IDotLayerToolDimensions): void {
        super.setDimensions(dimensions);
    }

    public getLayer(): L.LayerGroup | undefined {
        return this.layer;
    }

    public setLayer(layer: L.LayerGroup): void {
        this.layer = layer;
    }

    public getMarkers(): CircleMarker[] {
        return this.markers;
    }

    public setMarkers(markers: CircleMarker[]): void {
        this.markers = markers;
    }

    public setCategoryColorRules(rules: ICategoryColorRules[]): void {
        this.categoryColorRules = rules;
    }

    public getCategoryColorRules(): ICategoryColorRules[] {
        return this.categoryColorRules;
    }

    public setWorkData(latlngs: Array<IWorkData>): void {
        this.latlngs = latlngs;
    }

    public getWorkData(): Array<IWorkData> {
        return this.latlngs;
    }
}

export default DotLayerToolState;
