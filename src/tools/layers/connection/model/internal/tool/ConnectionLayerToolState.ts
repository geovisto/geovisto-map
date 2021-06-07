import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IConnectionLayerToolState from "../../types/tool/IConnectionLayerToolState";
import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";
import IConnectionLayerToolProps from "../../types/tool/IConnectionLayerToolProps";
import IConnectionLayerToolDefaults from "../../types/tool/IConnectionLayerToolDefaults";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
import { IConnectionLayerToolConfig, IConnectionLayerToolDimensionsConfig } from "../../types/tool/IConnectionLayerToolConfig";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import { IMapToolInitProps } from "../../../../../../model/types/tool/IMapToolProps";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolState extends LayerToolState implements IConnectionLayerToolState {

    private centroids: unknown;
    private svgLayer: L.SVG | undefined;
    private bucketData!: { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> };

    /**
     * It creates a tool state.
     */
    public constructor(tool: IConnectionLayerTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    public initialize(defaults: IConnectionLayerToolDefaults, props: IConnectionLayerToolProps, initProps: IMapToolInitProps<IConnectionLayerToolConfig>): void {
        // sets map dimensions
        if(props.dimensions) {
            this.setDimensions({
                from: props.dimensions.from == undefined ? defaults.getFromDimension(initProps.map) : props.dimensions.from,
                to: props.dimensions.to == undefined ? defaults.getToDimension(initProps.map) : props.dimensions.to
            });
        } else {
            this.setDimensions(defaults.getDimensions(initProps.map));
        }

        // the layer tool properties
        this.setCentroids(props.centroids == undefined ? defaults.getCentroids(initProps.map) : props.centroids);
        this.setBucketData({ nodes: new Set<string>(), connections: new Map<string, IMapAggregationBucket>() });
        
        // initialize bucket data
        this.bucketData = {
            nodes: new Set<string>(),
            connections: new Map<string, IMapAggregationBucket>()
        };

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IConnectionLayerToolConfig): void {
        super.deserialize(config);
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param from 
     * @param to
     */
    public deserializeDimensions(dimensionsConfig: IConnectionLayerToolDimensionsConfig): void {
        const dimensions = this.getDimensions();
        if(dimensionsConfig.from) dimensions.from.setDomain(dimensions.from.getDomainManager().getDomain(dimensionsConfig.from));
        if(dimensionsConfig.to) dimensions.to.setDomain(dimensions.to.getDomainManager().getDomain(dimensionsConfig.to));
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: IConnectionLayerToolDefaults | undefined): IConnectionLayerToolConfig {
        const config: IConnectionLayerToolConfig = <IConnectionLayerToolConfig> super.serialize(defaults);

        // serialize the layer tool properties
        const dimensions = this.getDimensions();
        config.data = {
            from: dimensions.from.getDomain()?.getName(),
            to: dimensions.to.getDomain()?.getName()
        };

        return config;
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): IConnectionLayerToolDimensions {
        return super.getDimensions() as IConnectionLayerToolDimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    public setDimensions(dimensions: IConnectionLayerToolDimensions): void {
       super.setDimensions(dimensions);
    }

    /**
     * It returns a Leaflet SVG layer.
     */
    public getSVGLayer(): L.SVG | undefined {
        return this.svgLayer;
    }

    /**
     * It sets a Leaflet SVG layer.
     * 
     * @param layer 
     */
    public setSVGLayer(svgLayer: L.SVG): void {
        this.svgLayer = svgLayer;
    }

    /**
     * It returns the centroids.
     * 
     * TODO: specify the type
     */
    public getCentroids(): unknown {
        return this.centroids;
    }

    /**
     * It sets the centroids.
     * 
     * TODO: specify the type
     * 
     * @param centroids 
     */
    public setCentroids(centroids: unknown): void {
        this.centroids = centroids;
    }

    /**
     * It returns work data for the force layout algorithm.
     */
    public getBucketData(): { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> } {
        return this.bucketData;
    }

    /**
     * It sets the work data for the force layout algorithm.
     * 
     * @param workData 
     */
    public setBucketData(bucketData: { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> }): void {
        this.bucketData = bucketData;
    }
}
export default ConnectionLayerToolState;