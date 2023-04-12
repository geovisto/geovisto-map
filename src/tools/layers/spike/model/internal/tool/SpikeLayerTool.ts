// d3
import * as d3 from "d3";

// Leaflet
import L from "leaflet";
import { LayerGroup } from "leaflet";

// Geovisto core
import {
    AbstractLayerTool,
    DataChangeEvent,
    IMapAggregationFunction,
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
import ISpikeLayerTool from "../../types/tool/ISpikeLayerTool";
import { ISpikeLayerToolConfig } from "../../types/tool/ISpikeLayerToolConfig";
import ISpikeLayerToolDefaults from "../../types/tool/ISpikeLayerToolDefaults";
import ISpikeLayerToolDimensions from "../../types/tool/ISpikeLayerToolDimensions";
import ISpikeLayerToolProps from "../../types/tool/ISpikeLayerToolProps";
import ISpikeLayerToolState, {
    IWorkData,
} from "../../types/tool/ISpikeLayerToolState";
import SpikeLayerToolMapForm from "../form/SpikeLayerToolMapForm";
import SpikeIcon from "../icon/SpikeIcon";
import SpikeLayerToolDefaults from "./SpikeLayerToolDefaults";
import SpikeLayerToolState from "./SpikeLayerToolState";

const SPIKE_WIDTH = 7;

/**
* This class represents Heat layer tool. It works with d3 to create spike icons
* Icons are created {@link SpikeIcon}
*
* @author Vladimir Korencik
* @author Petr Kaspar
*/
class SpikeLayerTool
    extends AbstractLayerTool
    implements ISpikeLayerTool, IMapFormControl {
    private selectionToolAPI: ISelectionToolAPI | undefined;
    private mapForm!: IMapForm;
    private max: number;

    public constructor(props?: ISpikeLayerToolProps) {
        super(props);

        this.max = 0;
    }

    public copy(): ISpikeLayerTool {
        return new SpikeLayerTool(this.getProps());
    }

    public getProps(): ISpikeLayerToolProps {
        return <ISpikeLayerToolProps>super.getProps();
    }

    public getDefaults(): ISpikeLayerToolDefaults {
        return <ISpikeLayerToolDefaults>super.getDefaults();
    }

    public getState(): ISpikeLayerToolState {
        return <ISpikeLayerToolState>super.getState();
    }

    protected createDefaults(): ISpikeLayerToolDefaults {
        return new SpikeLayerToolDefaults();
    }

    protected createState(): ISpikeLayerToolState {
        return new SpikeLayerToolState(this);
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
        return new SpikeLayerToolMapForm(this);
    }

    public initialize(initProps: IMapToolInitProps<ISpikeLayerToolConfig>): this {
        return super.initialize(initProps);
    }

    protected createLayerItems(): LayerGroup[] {
        const layer = L.layerGroup([]);

        this.getState().setLayer(layer);

        this.render(LayerToolRenderType.LAYER);

        this.getMap()
            ?.getState()
            .getLeafletMap()
            ?.on("zoomend", () => this.render(LayerToolRenderType.STYLE));

        return [layer];
    }

    protected updateData(): void {
        const dimensions: ISpikeLayerToolDimensions =
            this.getState().getDimensions();

        const latitudeDimension: IMapDataDomain | undefined =
            dimensions.latitude.getValue();
        const longitudeDimension: IMapDataDomain | undefined =
            dimensions.longitude.getValue();
        const valueDimension: IMapDataDomain | undefined =
            dimensions.value.getValue();
        const categoryDimension: IMapDataDomain | undefined =
            dimensions.category.getValue();

        const aggregationDimension: IMapAggregationFunction | undefined =
            dimensions.aggregation.getValue();

        const map = this.getMap();
        let dataItem: IWorkData & { count?: number } | undefined;
        const workData: IWorkData[] = [];
        this.max = 0;

        if (
            latitudeDimension &&
            longitudeDimension &&
            categoryDimension &&
            valueDimension &&
            map
        ) {
            const mapData: IMapDataManager = map.getState().getMapData();
            const data: IMapData = map.getState().getCurrentData();
            const dataLen: number = data.length;

            let foundLats: unknown[],
                foundLongs: unknown[],
                foundCategories: unknown[],
                foundValues: unknown[];


            for (let i = 0; i < dataLen; ++i) {
                foundLats = mapData.getDataRecordValues(latitudeDimension, data[i]);

                if (foundLats.length !== 1) {
                    foundLats = [];
                }
                foundLongs = mapData.getDataRecordValues(longitudeDimension, data[i]);

                if (foundLongs.length !== 1) {
                    foundLongs = [];
                }
                foundValues = mapData.getDataRecordValues(valueDimension, data[i]);

                if (foundValues.length !== 1) {
                    foundValues = [];
                }

                dataItem = workData.find(
                    (item) => item.lat === foundLats[0] && item.lng === foundLongs[0]
                );

                if (!dataItem) {
                    dataItem = {
                        lat: undefined,
                        lng: undefined,
                        value: 0,
                        color: undefined,
                        height: 0,
                        width: 0,
                        aggregationCount: 0,
                        aggregationValue: 0,
                    };
                    if (
                        typeof foundLats[0] === "number" &&
                        typeof foundLongs[0] === "number" &&
                        foundLats.length === 1 &&
                        foundLongs.length === 1
                    ) {
                        dataItem.lat = foundLats[0];
                        dataItem.lng = foundLongs[0];
                    }

                    workData.push(dataItem);
                }


                if (aggregationDimension && typeof foundValues[0] === "number") {
                    this.aggregateValues(dataItem, aggregationDimension, foundValues[0]);
                }



                foundCategories = mapData.getDataRecordValues(
                    categoryDimension,
                    data[i]
                );

                if (
                    foundCategories.length === 1 &&
                    typeof foundCategories[0] === "string"
                ) {
                    this.setCategoryColor(dataItem, foundCategories[0]);
                }
            }
        }

        this.getState().setWorkData(workData);
    }

    private setCategoryColor(dataItem: IWorkData, category: string): void {
        dataItem.category = category;
        const rules = this.getState().getCategoryColorRules();

        for (let j = 0; j < rules.length; j++) {
            const filter = rules[j];
            if (filter.operation?.match(dataItem.category, filter.value)) {
                dataItem.color = filter.color ?? (dataItem.color || "red");
                break;
            }
        }
    }

    private aggregateValues(dataItem: IWorkData, aggregationDimension: IMapAggregationFunction, foundValue: number): void {
        switch (aggregationDimension?.getName()) {
            case 'count': {
                dataItem.value++;
                this.max++;
                break;
            }
            case 'sum': {
                dataItem.value += foundValue;
                this.max = this.max > dataItem.value ? this.max : dataItem.value;
                break;
            }
            case 'average': {
                if (dataItem.aggregationCount !== undefined && dataItem.aggregationValue !== undefined) {
                    dataItem.aggregationValue += foundValue;
                    dataItem.aggregationCount++;
                    dataItem.value = Math.floor(dataItem.aggregationValue / dataItem.aggregationCount);
                    this.max = this.max > dataItem.value ? this.max : dataItem.value;
                }
                break;
            }
        }
    }


    protected createMarkers(): void {
        const data = this.getState().getWorkData();

        const markers = [];

        const layer = this.getState().getLayer();

        for (let i = 0; i < data.length; ++i) {
            const point = this.createMarker(data[i]);
            if (point) {
                layer?.addLayer(point);
                markers.push(point);
            }
        }

        this.getState().setMarkers(markers);
    }

    protected createMarker(data: IWorkData): L.Marker | undefined {
        const dimensions: ISpikeLayerToolDimensions =
            this.getState().getDimensions();

        const colorDimension: string | undefined = dimensions.color.getValue();
        if (!data.lat || !data.lng) {
            return;
        }

        const scale = d3.scaleLinear().domain([0, this.max]).range([4, 48]);
        const height = this.calculateHeight(scale(data.value));
        const popup = `<b>Aggregated: ${data.value}</b>`;
        return L.marker([data.lat, data.lng], {
            // create spike icon
            icon: new SpikeIcon({
                iconAnchor: [SPIKE_WIDTH / 2, height],
                popupAnchor: [SPIKE_WIDTH / 2, -height],
                iconSize: [SPIKE_WIDTH, height],
                height,
                value: data.value,
                color: data.color ?? colorDimension,
                width: SPIKE_WIDTH,
            }),
        }).bindPopup(popup);
    }

    private calculateHeight(height: number): number {
        const currentZoom = this.getMap()?.getState().getLeafletMap()?.getZoom();

        return currentZoom ? (height * currentZoom) / 2 : 0;
    }

    public render(type: number): void {
        const layer = this.getState().getLayer();
        if (!this.getState().isEnabled() || !layer) {
            return;
        }

        layer.clearLayers();

        switch (type) {
            case LayerToolRenderType.LAYER:
            case LayerToolRenderType.DATA:
                this.updateData();
                this.createMarkers();
                break;
            default:
                this.createMarkers();
                break;
        }
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
                case dimensions.aggregation:
                case dimensions.value:
                case dimensions.category:
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

export default SpikeLayerTool;
