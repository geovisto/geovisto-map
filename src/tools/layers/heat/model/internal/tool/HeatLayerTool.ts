import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import 'leaflet.Heatcluster/dist/HeatCluster.css';
//import 'leaflet.Heatcluster/dist/HeatCluster.Default.css';
import '../../../style/heatLayer.scss';
import HeatLayerToolDefaults from './HeatLayerToolDefaults';
import HeatLayerToolState from './HeatLayerToolState';

// Tools import
import {
    SelectionTool,
    ThemesToolEvent,
    SelectionToolEvent
} from '../../../../../index';

// Geovisto core
import {
    AbstractLayerTool,
    DataChangeEvent, IMapEvent,
} from '../../../../../../index.core';
import IHeatLayerToolProps from "../../types/tool/IHeatLayerToolProps";
import IHeatLayerTool from "../../types/tool/IHeatLayerTool";
import {IHeatLayerToolDefaults, IHeatLayerToolState} from "../../../index";

/**
 * This class represents Heatmap layer.
 * 
 * @author Petr Kaspar
 */
class HeatLayerTool extends AbstractLayerTool implements IHeatLayerTool {
    private maxValue: number;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param {*} props 
     */
    public constructor(props?: IHeatLayerToolProps) {
        super(props);
        this.workData = [];
        this.options = {};
        this.maxValue = undefined;
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IHeatLayerTool {
        return new HeatLayerTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IHeatLayerToolProps {
        return <IHeatLayerToolProps> super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IHeatLayerToolDefaults {
        return <IHeatLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IHeatLayerToolDefaults {
        return new HeatLayerToolDefaults();
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): IHeatLayerToolState {
        return <IHeatLayerToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): IHeatLayerToolState {
        return new HeatLayerToolState(this);
    }

    /**
     * Help function which acquires and returns the selection tool if available.
     */
    public getSelectionTool() {
        if(this.selectionTool == undefined) {
            let tools = this.getMap().getState().getTools().getByType(SelectionTool.TYPE());
            if(tools.length > 0) {
                this.selectionTool = tools[0];
            }
        }
        return this.selectionTool;
    }

    /**
     * It creates new tab control.
     */
    public createSidebarTabControl() {
        return new HeatLayerToolTabControl({ tool: this });
    }

    /**
     * It creates layer items.
     */
    public createLayerItems() {
        let layer = L.layerGroup([]);

        // update state
        this.getState().setLayer(layer);

        this.redraw();

        this.getMap().getState().getLeafletMap().on('zoomend', (e) => this.changeHeatRadius(e, this.options));

        return [ layer ];
    }

    /**
     * It deletes layer items.
     */
    public deleteLayerItems() {
        //console.log("marker");
        let layers = this.getState().getLayers();

        // delete the 'value' property of every geo feature object if defined
        let layer = this.getState().getLayer();
        for(let i = 0; i < layers.length; i++) {
            layer.removeLayer(layers[i]);
        }
        
        this.getState().setLayers([]);
    }

    public prepareHeatmapOptions() {
        let options = {};
        const dataMapping = this.getState().getDataMapping();
        const dataMappingModel = this.getDefaults().getDataMappingModel();
        let radius = dataMapping[dataMappingModel.radius.name];
        if (isNaN(radius) || radius === '') {
            return options;
        }
        radius = parseInt(radius);

        let blur = dataMapping[dataMappingModel.blur.name];
        if (isNaN(blur) || blur === '') {
            return options;
        }
        blur = parseInt(blur);

        const gradient = this.getState().getGradient(dataMapping[dataMappingModel.gradient.name]);
        const zoom = this.getState().getZoomLevel(dataMapping[dataMappingModel.zoom.name]);
        if ( ! gradient || ! zoom) {
            return options;
        }
        options = {radius, blur, gradient, zoom};

        return options;
    }

    /**
     * It prepares data for markers.
     */
    public prepareMapData() {
        // prepare data
        const mapData = this.getMap().getState().getMapData();
        const dataMappingModel = this.getDefaults().getDataMappingModel();
        const dataMapping = this.getState().getDataMapping();
        const latitudeDataDoman = mapData.getDataDomain(dataMapping[dataMappingModel.latitude.name]);
        const longitudeDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.longitude.name]);
        const intensityDataDomain = mapData.getDataDomain(dataMapping[dataMappingModel.intensity.name]);
        let foundLats, foundLongs, foundRadius, foundIntensity;
        const data = this.getMap().getState().getCurrentData();
        const dataLen = data.length;
        this.maxValue = 0;
        const workData = [];

        for (let i = 0; i < dataLen; i++) {
            foundLats = mapData.getItemValues(latitudeDataDoman, data[i]);
            if (foundLats.length !== 1 || isNaN(foundLats[0])) {
                foundLats = [];
            }
            foundLongs = mapData.getItemValues(longitudeDataDomain, data[i]);
            if (foundLongs.length !== 1 || isNaN(foundLongs[0])) {
                foundLongs = [];
            }
            foundIntensity = mapData.getItemValues(intensityDataDomain, data[i]);
            if (foundIntensity.length !== 1 || isNaN(foundIntensity[0])) {
                foundIntensity = [];
            }

            if (foundLats.length === 1 && foundLongs.length === 1 && foundIntensity.length === 1) {
                workData.push([foundLats[0],foundLongs[0], foundIntensity[0]]);
            }
            if (foundIntensity.length === 1 && foundIntensity[0] > this.maxValue) {
                this.maxValue = foundIntensity[0];
            }
        }

        return workData;
    }

    /**
     * It reloads data and redraw the layer.
     */
    public redraw(onlyStyle?) {
        if(this.getState().getLayer()) {
            // delete actual items
            this.deleteLayerItems();

            // prepare heat map options
            this.options = this.prepareHeatmapOptions();
            if ( ! onlyStyle) {
                // prepare data
                this.workData = this.prepareMapData();
            }

            let data = this.workData;
            if ( ! Object.keys(this.options).length) {

                // don't put any points on map if heat map options aren't specified
                data = [];
            }

            const workData = {...this.options, data: data};
            const layers = this.createHeatLayers(workData);
            const toolLayer = this.getState().getLayer();

            layers.forEach((layer) => {
                toolLayer.addLayer(layer);
            });

            // update state
            this.getState().setLayers(layers);
        }
    }

    /**
     * Creates heat layers. Should create only one at this time as multiple layers tend to be horribly slow for
     * bigger data sets.
     *
     * @param workData
     * @returns {[]}
     */
    public createHeatLayers(workData) {
        let layers = [];

        if ( ! workData.data.length) {
            return layers;
        }

        let data = workData.data;
        const zoom = this.getMap().getState().getLeafletMap()._zoom;
        const radius = this.getRadius(zoom, workData);
        console.log(workData);
        layers.push(L.heatLayer(data,
            {
                radius: radius,
                maxZoom: workData.zoom,
                blur: workData.blur,
                minOpacity: 0.4,
                gradient: workData.gradient,
                max: this.maxValue,
            })
        );

        return layers;
    }

    public changeHeatRadius(e, options) {
        const zoom = e.target._zoom;
        const heatLayer = this.getState().getLayers()[0];
        if ( ! options.blur || ! options.radius || ! options.gradient || ! options.zoom) {
            return;
        }
        const radius = this.getRadius(zoom, options);

        heatLayer.setOptions({
            radius: radius,
            maxZoom: options.zoom,
            blur: options.blur,
            minOpacity: 0.4,
            gradient: options.gradient,
            max: this.maxValue,
        });

        heatLayer.redraw();
    }

    public getRadius(zoom, options) {
        let rules = this.getState().getReactiveRadiusRules();
        rules = rules.filter(rule => rule.operation.match(zoom, rule.value));

        let radius = options.radius;
        if (rules.length) {
            //get last value of all rulesets that match
            radius = rules[rules.length - 1].radius;
        }

        return radius;
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param {AbstractEvent} event 
     */
    public handleEvent(event: IMapEvent) {
        if(event.getType() == DataChangeEvent.TYPE()) {
            // data change
            this.redraw();
        } else if(event.getType() == SelectionToolEvent.TYPE()) {
            this.redraw();
            // TODO
        } else if(event.getType() == ThemesToolEvent.TYPE()) {
            // theme change
            // TODO
        }
    }
}

export default HeatLayerTool;