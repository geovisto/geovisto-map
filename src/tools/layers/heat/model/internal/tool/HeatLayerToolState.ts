// Leaflet
import { HeatLatLngTuple, HeatLayer, HeatMapOptions, LatLng } from "leaflet";

// Geovisto core
import {
    IMapFilterManager,
    IMapToolInitProps,
    LayerToolState,
} from "../../../../../../index.core";

// Internal
import { IReactiveRadiusRules } from "../../types/reactiveRadius/IReactiveRadius";
import IHeatLayerTool from "../../types/tool/IHeatLayerTool";
import {
    IHeatLayerToolConfig,
    IHeatLayerToolDimensionsConfig,
} from "../../types/tool/IHeatLayerToolConfig";
import IHeatLayerToolDefaults from "../../types/tool/IHeatLayerToolDefaults";
import IHeatLayerToolDimensions from "../../types/tool/IHeatLayerToolDimensions";
import IHeatLayerToolProps from "../../types/tool/IHeatLayerToolProps";
import IHeatLayerToolState from "../../types/tool/IHeatLayerToolState";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Vladimir Korencik
 */
class HeatLayerToolState extends LayerToolState implements IHeatLayerToolState {
    private layer?: L.LayerGroup;
    private layers: HeatLayer[];
    private radiusRules!: IReactiveRadiusRules[];
    private latlngs!: Array<LatLng | HeatLatLngTuple>;
    private options: HeatMapOptions;
    private manager!: IMapFilterManager;

    public constructor(tool: IHeatLayerTool) {
        super(tool);
        this.layers = [];
        this.radiusRules = [];
        this.latlngs = [];
        this.options = {};
    }

    public initialize(
        defaults: IHeatLayerToolDefaults,
        props: IHeatLayerToolProps,
        initProps: IMapToolInitProps<IHeatLayerToolConfig>
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
                intensity:
                    props.dimensions.intensity === undefined
                        ? defaults.getIntensityDimension(initProps.map)
                        : props.dimensions.intensity,
                radius:
                    props.dimensions.radius === undefined
                        ? defaults.getRadiusDimension()
                        : props.dimensions.radius,
                gradient:
                    props.dimensions.gradient === undefined
                        ? defaults.getGradientDimension()
                        : props.dimensions.gradient,
                blur:
                    props.dimensions.blur === undefined
                        ? defaults.getBlurDimension()
                        : props.dimensions.blur,
                zoom:
                    props.dimensions.zoom === undefined
                        ? defaults.getZoomDimension()
                        : props.dimensions.zoom,
                currentZoom:
                    props.dimensions.currentZoom === undefined
                        ? defaults.getCurrentZoomDimension()
                        : props.dimensions.currentZoom,
                reactiveOp:
                    props.dimensions.reactiveOp === undefined
                        ? defaults.getReactiveRadiusOperationDimension()
                        : props.dimensions.reactiveOp,
                reactiveZoom:
                    props.dimensions.reactiveZoom === undefined
                        ? defaults.getReactiveRadiusZoomDimension()
                        : props.dimensions.reactiveZoom,
                reactiveRadius:
                    props.dimensions.reactiveRadius === undefined
                        ? defaults.getReactiveRadiusDimension()
                        : props.dimensions.reactiveRadius,
            });
        } else {
            this.setDimensions(defaults.getDimensions(initProps.map));
        }

        this.setFiltersManager(defaults.getFiltersManager());

        super.initialize(defaults, props, initProps);
    }

    public deserialize(config: IHeatLayerToolConfig): void {
        super.deserialize(config);

        const rules: IReactiveRadiusRules[] = [];
        if (!config.radiusRules) {
            return;
        }

        config.radiusRules.forEach((filter) => {
            const operationName = filter.operation?.getName();
            if (operationName) {
                const operation = this
                    .getFiltersManager()
                    .getDomain(operationName);
                if (operation) {
                    rules.push({
                        operation,
                        zoom: filter.zoom,
                        radius: filter.radius,
                    });
                }
            }
        });
        config.radiusRules = rules;
        this.setReactiveRadiusRules(config.radiusRules);
    }

    public deserializeDimensions(
        dimensionsConfig: IHeatLayerToolDimensionsConfig
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
        if (dimensionsConfig.intensity)
            dimensions.intensity.setValue(
                dimensions.intensity
                    .getDomainManager()
                    .getDomain(dimensionsConfig.intensity)
            );
        if (dimensionsConfig.radius)
            dimensions.radius.setValue(dimensionsConfig.radius);
        if (dimensionsConfig.gradient)
            dimensions.gradient.setValue(
                dimensions.gradient
                    .getDomainManager()
                    .getDomain(dimensionsConfig.gradient)
            );
        if (dimensionsConfig.blur)
            dimensions.blur.setValue(dimensionsConfig.blur);
        if (dimensionsConfig.zoom)
            dimensions.zoom.setValue(
                dimensions.zoom
                    .getDomainManager()
                    .getDomain(dimensionsConfig.zoom)
            );

        if (dimensionsConfig.reactiveOp)
            dimensions.reactiveOp.setValue(
                dimensions.reactiveOp
                    .getDomainManager()
                    .getDomain(dimensionsConfig.reactiveOp)
            );
        if (dimensionsConfig.reactiveZoom)
            dimensions.reactiveZoom.setValue(dimensionsConfig.reactiveZoom);

        if (dimensionsConfig.reactiveRadius)
            dimensions.reactiveRadius.setValue(dimensionsConfig.reactiveRadius);
    }

    public serialize(
        defaults: IHeatLayerToolDefaults | undefined
    ): IHeatLayerToolConfig {
        const config: IHeatLayerToolConfig = <IHeatLayerToolConfig>(
            super.serialize(defaults)
        );

        config.radiusRules = [];
        this.radiusRules.forEach((filter: IReactiveRadiusRules) => {
            config.radiusRules?.push({
                operation: filter.operation,
                zoom: filter.zoom,
                radius: filter.radius,
            });
        });

        const dimensions = this.getDimensions();

        config.data = {
            latitude: dimensions.latitude.getValue()?.getName(),
            longitude: dimensions.longitude.getValue()?.getName(),
            intensity: dimensions.intensity.getValue()?.getName(),
            radius: dimensions.radius.getValue(),
            gradient: dimensions.gradient.getValue()?.getName(),
            blur: dimensions.blur.getValue(),
            zoom: dimensions.zoom.getValue()?.getName(),
            reactiveOp: dimensions.reactiveOp.getValue()?.getName(),
            reactiveZoom: dimensions.reactiveZoom.getValue(),
            reactiveRadius: dimensions.reactiveRadius.getValue(),
        };

        return config;
    }

    public getFiltersManager(): IMapFilterManager {
        return this.manager;
    }


    public setFiltersManager(manager: IMapFilterManager): void {
        this.manager = manager;
    }


    public getDimensions(): IHeatLayerToolDimensions {
        return super.getDimensions() as IHeatLayerToolDimensions;
    }

    public setDimensions(dimensions: IHeatLayerToolDimensions): void {
        super.setDimensions(dimensions);
    }

    public getLayer(): L.LayerGroup | undefined {
        return this.layer;
    }

    public getLayers(): HeatLayer[] {
        return this.layers;
    }

    public setLayer(layer: L.LayerGroup): void {
        this.layer = layer;
    }

    public setLayers(layers: HeatLayer[]): void {
        this.layers = layers;
    }

    public setReactiveRadiusRules(rules: IReactiveRadiusRules[]): void {
        this.radiusRules = rules;
    }

    public getReactiveRadiusRules(): IReactiveRadiusRules[] {
        return this.radiusRules;
    }

    public setLatlngsData(latlngs: Array<LatLng | HeatLatLngTuple>): void {
        this.latlngs = latlngs;
    }

    public getLatlngsData(): Array<LatLng | HeatLatLngTuple> {
        return this.latlngs;
    }

    public setOptions(options: HeatMapOptions): void {
        this.options = options;
    }

    public getOptions(): HeatMapOptions {
        return this.options;
    }
}

export default HeatLayerToolState;
