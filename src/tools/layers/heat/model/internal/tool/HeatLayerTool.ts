// Leaflet
import L, { HeatLatLngTuple, HeatMapOptions, LatLng } from "leaflet";
import "leaflet.markercluster";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

// onw styles
import "../../../style/heatLayer.scss";

// Geovisto core
import {
    AbstractLayerTool,
    DataChangeEvent,
    IMapData,
    IMapDataDomain,
    IMapDataManager,
    IMapDomain,
    IMapDomainDimension,
    IMapEvent,
    IMapForm,
    IMapFormControl,
    IMapToolInitProps,
    LayerToolRenderType,
} from "../../../../../../index.core";

// Geovisto Selection Tool API
import {
    ISelectionToolAPI,
    ISelectionToolAPIGetter,
} from "../../../../../selection";

// Internal
import IHeatLayerTool from "../../types/tool/IHeatLayerTool";
import { IHeatLayerToolConfig } from "../../types/tool/IHeatLayerToolConfig";
import IHeatLayerToolDefaults from "../../types/tool/IHeatLayerToolDefaults";
import IHeatLayerToolDimensions from "../../types/tool/IHeatLayerToolDimensions";
import IHeatLayerToolProps from "../../types/tool/IHeatLayerToolProps";
import IHeatLayerToolState from "../../types/tool/IHeatLayerToolState";
import HeatLayerToolMapForm from "../form/HeatLayerToolMapForm";
import HeatLayerToolDefaults from "./HeatLayerToolDefaults";
import HeatLayerToolState from "./HeatLayerToolState";

/**
* This class represents Heat layer tool. It works with leaflet.heat plugin
* provided for Leaflet
* 
* @author Vladimir Korencik
* @author Petr Kaspar
*/
class HeatLayerTool
    extends AbstractLayerTool
    implements IHeatLayerTool, IMapFormControl {
    private selectionToolAPI: ISelectionToolAPI | undefined;
    private mapForm!: IMapForm;
    private maxValue: number | undefined;

    public constructor(props?: IHeatLayerToolProps) {
        super(props);

        this.maxValue = undefined;
    }

    public copy(): IHeatLayerTool {
        return new HeatLayerTool(this.getProps());
    }

    public getProps(): IHeatLayerToolProps {
        return <IHeatLayerToolProps>super.getProps();
    }

    public getDefaults(): IHeatLayerToolDefaults {
        return <IHeatLayerToolDefaults>super.getDefaults();
    }

    public getState(): IHeatLayerToolState {
        return <IHeatLayerToolState>super.getState();
    }

    protected createDefaults(): IHeatLayerToolDefaults {
        return new HeatLayerToolDefaults();
    }

    protected createState(): IHeatLayerToolState {
        return new HeatLayerToolState(this);
    }

    private getSelectionTool(): ISelectionToolAPI | undefined {
        if (this.selectionToolAPI == undefined) {
            const api = this.getMap()
                ?.getState()
                .getToolsAPI() as ISelectionToolAPIGetter;
            if (api.getGeovistoSelectionTool) {
                this.selectionToolAPI = api.getGeovistoSelectionTool();
            }
        }
        return this.selectionToolAPI;
    }

    public getMapForm(): IMapForm {
        if (this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    protected createMapForm(): IMapForm {
        return new HeatLayerToolMapForm(this);
    }

    public initialize(
        initProps: IMapToolInitProps<IHeatLayerToolConfig>
    ): this {
        return super.initialize(initProps);
    }

    protected createLayerItems(): L.LayerGroup[] {
        const layer = L.layerGroup([]);

        // update state
        this.getState().setLayer(layer);

        this.render(LayerToolRenderType.LAYER);

        this.getMap()
            ?.getState()
            .getLeafletMap()
            ?.on("zoomend", () => this.changeHeatRadius());

        return [layer];
    }

    protected prepareHeatmapOptions(): void {
        const dimensions = this.getState().getDimensions();

        const radius = dimensions.radius.getValue();
        const blur = dimensions.blur.getValue();
        const gradient = dimensions.gradient.getValue()?.getGradient() ?? "";
        const maxZoom = dimensions.zoom.getValue()?.getZoom() ?? "";

        if (!gradient || !maxZoom || !blur || !radius) {
            return;
        }

        this.getState().setOptions({
            radius,
            blur,
            gradient,
            maxZoom,
            max: this.maxValue,
            minOpacity: 0.4,
        });
    }

    protected prepareMapData(): void {
        const dimensions: IHeatLayerToolDimensions =
            this.getState().getDimensions();

        const latitudeDimension: IMapDataDomain | undefined =
            dimensions.latitude.getValue();
        const longitudeDimension: IMapDataDomain | undefined =
            dimensions.longitude.getValue();
        const intensityDimension: IMapDataDomain | undefined =
            dimensions.intensity.getValue();

        const map = this.getMap();
        const workData: Array<LatLng | HeatLatLngTuple> = [];

        if (
            latitudeDimension &&
            longitudeDimension &&
            intensityDimension &&
            map
        ) {
            this.maxValue = 0;
            const mapData: IMapDataManager = map.getState().getMapData();
            const data: IMapData = map.getState().getCurrentData();
            const dataLen: number = data.length;

            let foundLats: unknown[],
                foundLongs: unknown[],
                foundIntensity: unknown[];

            for (let i = 0; i < dataLen; i++) {
                foundLats = mapData.getDataRecordValues(
                    latitudeDimension,
                    data[i]
                );

                if (foundLats.length !== 1) {
                    foundLats = [];
                }
                foundLongs = mapData.getDataRecordValues(
                    longitudeDimension,
                    data[i]
                );

                if (foundLongs.length !== 1) {
                    foundLongs = [];
                }
                foundIntensity = mapData.getDataRecordValues(
                    intensityDimension,
                    data[i]
                );

                if (foundIntensity.length !== 1) {
                    foundIntensity = [];
                }

                if (
                    typeof foundLats[0] === "number" &&
                    typeof foundLongs[0] === "number" &&
                    typeof foundIntensity[0] === "number" &&
                    foundLats.length === 1 &&
                    foundLongs.length === 1 &&
                    foundIntensity.length === 1
                ) {
                    workData.push([
                        foundLats[0],
                        foundLongs[0],
                        foundIntensity[0],
                    ]);
                }

                if (
                    typeof foundIntensity[0] === "number" &&
                    foundIntensity.length === 1 &&
                    (!this.maxValue || foundIntensity[0] > this.maxValue)
                ) {
                    this.maxValue = foundIntensity[0];
                }
            }
        }
        this.getState().setLatlngsData(workData);
    }

    public render(type: number): void {
        const layer = this.getState().getLayer();
        if (!layer) {
            return;
        }

        layer.clearLayers();

        switch (type) {
            case LayerToolRenderType.LAYER:
            case LayerToolRenderType.DATA:
                this.prepareHeatmapOptions();
                this.prepareMapData();
                this.createHeatLayers();
                break;
            default:
                this.prepareHeatmapOptions();
                this.createHeatLayers();
                break;
        }

        super.render(type);
    }

    protected createHeatLayers(): void {
        const state = this.getState();
        const layer = state.getLayer();
        const options = state.getOptions();
        const layers: L.HeatLayer[] = [];
        const latlngs: Array<LatLng | HeatLatLngTuple> = state.getLatlngsData();

        if (!latlngs.length) {
            return;
        }
        const zoom = this.getMap()?.getState().getLeafletMap()?.getZoom();

        const radius = this.getRadius(zoom);
        layers.push(
            L.heatLayer(latlngs, {
                ...options,
                radius: radius ?? options.radius,
            })
        );

        layers.forEach((toolLayer) => {
            layer?.addLayer(toolLayer);
        });

        this.getState().setLayers(layers);
    }

    public changeHeatRadius(): void {
        const zoom = this.getMap()?.getState().getLeafletMap()?.getZoom();
        const heatLayer = this.getState().getLayers()[0];
        const options = heatLayer?.options as HeatMapOptions;
        if (
            !options ||
            !options.blur ||
            !options.radius ||
            !options.gradient ||
            !options.maxZoom
        ) {
            return;
        }

        const radius =
            this.getRadius(zoom) ??
            this.getState().getDimensions().radius.getValue();
        heatLayer.setOptions({
            ...options,
            radius,
        });

        heatLayer.redraw();
    }

    public getRadius(zoom: number | undefined): number | undefined {
        const rules = this.getState().getReactiveRadiusRules();

        const filtered = rules.filter((rule) =>
            rule.operation?.match(zoom, rule?.zoom)
        );

        let radius = undefined;
        if (filtered.length) {
            radius = filtered[filtered.length - 1].radius;
        }

        return radius;
    }

    public updateDimension(
        dimension: IMapDomainDimension<IMapDomain>,
        value: string,
        redraw: number | undefined
    ): void {
        if (!redraw) {
            const dimensions = this.getState().getDimensions();
            switch (dimension) {
                case dimensions.latitude:
                case dimensions.longitude:
                    redraw = LayerToolRenderType.LAYER;
                    break;
                case dimensions.intensity:
                    redraw = LayerToolRenderType.DATA;
                    break;
                default:
                    redraw = LayerToolRenderType.STYLE;
                    break;
            }
        }
        super.updateDimension(dimension, value, redraw);
    }

    public handleEvent(event: IMapEvent): void {
        switch (event.getType()) {
            case DataChangeEvent.TYPE():
                this.render(LayerToolRenderType.DATA);
                break;
            case this.getSelectionTool()?.getChangeEventType():
                this.render(LayerToolRenderType.STYLE);
                break;
            default:
                break;
        }
    }
}

export default HeatLayerTool;
