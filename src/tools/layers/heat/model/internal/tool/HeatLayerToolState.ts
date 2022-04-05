// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDefaults,
    LayerToolState,
} from '../../../../../../index.core';
import HeatLayerToolDefaults from "./HeatLayerToolDefaults";
// Tools import
import {
    FiltersToolDefaults,
} from '../../../../../index';
import {
    IHeatLayerTool,
    IHeatLayerToolConfig,
    IHeatLayerToolDefaults,
    IHeatLayerToolDimensions,
    IHeatLayerToolState
} from "../../../index";

const GRADIENT_DEFAULT = {0.4:"#0000FF", 0.6:"#00FFFF", 0.7:"#00FF00", 0.8:"#FFFF00", 0.9:"#FF0000"};

const GRADIENT_PROTANO_DEUTRAN_A = { 0.4: "#00B9F1", 0.6: "#00A875", 0.7: "#ECDE38", 0.8: "#F7931D", 0.9: "#F15A22"};

const GRADIENT_PROTAN_DEUTRAN_B = { 0.4: "#7CB3F5", 0.6: "#648FFF", 0.7: "#DCC112", 0.8: "#A97821", 0.9: "#5F320C"};

const GRADIENT_TRITAN = { 0.4: "#00e6e6", 0.6: "#009999", 0.7: "#C38D87", 0.8: "#FF0000", 0.9: "#660004"};

const GRADIENT_MONOCHROMATIC = { 0.4: "#BDBDBD", 0.6: "#888888", 0.7: "#565656", 0.8: "#353535", 0.9: "#000000"};

const ZOOM_MIN = 1;
const ZOOM_NORMAL = 7;
const ZOOM_MAX = 14;

const ZOOM_LEVELS = [
    {name: "min", value: ZOOM_MIN},
    {name: "normal", value: ZOOM_NORMAL},
    {name: "max", value: ZOOM_MAX}
];

const GRADIENTS = [
    {name: "Default", values: GRADIENT_DEFAULT},
    {name: "Protanopia/Deuteranopia A", values: GRADIENT_PROTANO_DEUTRAN_A},
    {name: "Protanopia/Deuteranopia B", values: GRADIENT_PROTAN_DEUTRAN_B},
    {name: "Tritanopia", values: GRADIENT_TRITAN},
    {name: "Monochromatic", values: GRADIENT_MONOCHROMATIC}
];

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Petr Kaspar
 */
class HeatLayerToolState extends LayerToolState implements IHeatLayerToolState {
    private radiusRules: any[];
    private filterManager: any;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IHeatLayerTool ) {
        super(tool);
        this.radiusRules = [];
        this.filterManager = new FiltersToolDefaults().getFiltersManager();
    }

    /**
     * It resets state with respect to initial props. Optionally, defaults can be set if property is undefined.
     * 
     * @param {HeatLayerToolDefaults} defaults
     */
    public initialize(defaults: any): any {
        super.initialize(defaults);

        // the layer tool properties
        this.setLayers([]);
        // TODO
    }

    /**
     * Help function which initialize state properties realated with map.
     */
    public resetMapVariables(map: any, defaults: any): any {
        super.resetMapVariables(map, defaults);
    }

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {*} config 
     */
    public deserialize(config: IHeatLayerToolConfig) {
        super.deserialize(config);

        const rules = [];
        if ( ! config.radiusRules) {
            return;
        }

        config.radiusRules.forEach((filter) => {
            const operation = this.getFilterManager().getOperation(filter.operation)[0];
            if (operation) {
                rules.push({
                    operation,
                    value: filter.value,
                    radius: filter.radius
                });
            }
        })
        config.radiusRules = rules;
        this.setReactiveRadiusRules(config.radiusRules);
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param {HeatLayerToolDefaults} defaults
     */
    public serialize(defaults: IHeatLayerToolDefaults | undefined): IHeatLayerToolConfig {
        const config = super.serialize(defaults);

        config.radiusRules = [];
        this.radiusRules.forEach((filter) => {
            config.radiusRules.push({
                operation: filter.operation.toString(),
                value: filter.value,
                radius: filter.radius
            });
        });

        return config;
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): IHeatLayerToolDimensions {
        return super.getDimensions() as IHeatLayerToolDimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     *
     * @param dimensions
     */
    public setDimensions(dimensions: IHeatLayerToolDimensions): void {
        super.setDimensions(dimensions);
    }

    /**
     * It returns a Leaflet layer group.
     */
    public getLayer() {
        return this.layer;
    }

    /**
     * It sets a Leaflet layer group.
     * 
     * @param {L.layerGroup} layer 
     */
    public setLayer(layer) {
        this.layer = layer;
    }

    /**
     * It returns the heat layers.
     */
    public getLayers() {
        return this.layers;
    }

    /**
     * It sets the layers.
     * 
     * @param {*} layers
     */
    public setLayers(layers) {
        this.layers = layers;
    }

    public getFilterManager() {
        return this.filterManager;
    }

    /**
     * Gets array of all gradients
     *
     * @returns {(string|*)[]}
     */
    public getGradients() {
        return GRADIENTS.map(gradient => gradient.name);
    }

    /**
     * Gets selected gradient by name
     *
     * @param name
     * @returns {*}
     */
    public getGradient(name: any) {
        for (let i = 0; i < GRADIENTS.length; i++) {
            if(name === GRADIENTS[i].name) {
                return  GRADIENTS[i].values;
            }
        }
    }

    /**
     * Returns array of all zoom/intensity ratio levels
     *
     * @returns {(string|*)[]}
     */
    public getZoomLevels() {
        return ZOOM_LEVELS.map(zoom => zoom.name);
    }

    /**
     * Gets selected zoom/intensity ratio by name
     *
     * @returns {number}
     */
    public getZoomLevel(name: any) {
        for (let i = 0; i < ZOOM_LEVELS.length; i++) {
            if(name === ZOOM_LEVELS[i].name) {
                return ZOOM_LEVELS[i].value;
            }
        }
    }

    public setReactiveRadiusRules(rules: any) {
        this.radiusRules = rules;
    }

    public getReactiveRadiusRules() {
        return this.radiusRules;
    }
}
export default HeatLayerToolState;