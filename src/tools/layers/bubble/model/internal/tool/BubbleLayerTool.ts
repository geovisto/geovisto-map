import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "../../../style/bubbleLayer.scss";

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
import {
    ISelectionToolAPI,
    ISelectionToolAPIGetter,
} from "../../../../../selection";
import IBubbleLayerTool from "../../types/tool/IBubbleLayerTool";
import { IBubbleLayerToolConfig } from "../../types/tool/IBubbleLayerToolConfig";
import IBubbleLayerToolDefaults from "../../types/tool/IBubbleLayerToolDefaults";
import IBubbleLayerToolProps from "../../types/tool/IBubbleLayerToolProps";
import IBubbleLayerToolState, {
    IWorkData,
} from "../../types/tool/IBubbleLayerToolState";
import BubbleLayerToolMapForm from "../form/BubbleLayerToolMapForm";
import BubbleLayerToolDefaults from "./BubbleLayerToolDefaults";
import BubbleLayerToolState from "./BubbleLayerToolState";
import IBubbleLayerToolDimensions from "../../types/tool/IBubbleLayerToolDimensions";
import BubbleIcon from "../bubble/BubbleIcon";
import {
    IBubbleIconOptions,
    IBubbleIconValues,
} from "../../types/bubble/IBubbleIcon";

class BubbleLayerTool
    extends AbstractLayerTool
    implements IBubbleLayerTool, IMapFormControl
{
    private selectionToolAPI: ISelectionToolAPI | undefined;
    private mapForm!: IMapForm;
    private max: number;

    public constructor(props?: IBubbleLayerToolProps) {
        super(props);

        this.max = 0;
    }

    public copy(): IBubbleLayerTool {
        return new BubbleLayerTool(this.getProps());
    }

    public getProps(): IBubbleLayerToolProps {
        return <IBubbleLayerToolProps>super.getProps();
    }

    public getDefaults(): IBubbleLayerToolDefaults {
        return <IBubbleLayerToolDefaults>super.getDefaults();
    }

    public getState(): IBubbleLayerToolState {
        return <IBubbleLayerToolState>super.getState();
    }

    protected createDefaults(): IBubbleLayerToolDefaults {
        return new BubbleLayerToolDefaults();
    }

    protected createState(): IBubbleLayerToolState {
        return new BubbleLayerToolState(this);
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
        return new BubbleLayerToolMapForm(this);
    }

    public initialize(
        initProps: IMapToolInitProps<IBubbleLayerToolConfig>
    ): this {
        return super.initialize(initProps);
    }

    protected createLayerItems(): L.MarkerClusterGroup[] {
        const layer = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            maxClusterRadius: 65,
            iconCreateFunction: (cluster) => {
                const markers = cluster.getAllChildMarkers();
                const options = markers[0]?.options?.icon
                    ?.options as IBubbleIconOptions;
                const map = options.map;
                const data = this.getClusterValues(markers);
                const max = this.max;

                // create custom icon
                return new BubbleIcon({
                    countryName: "<Group>",
                    values: data,
                    map,
                    max,
                    isGroup: true,
                    bubbleSize: options.bubbleSize,
                    bubbleColor: options.bubbleColor,
                });
            },
        });

        const map = this.getMap()?.getState().getLeafletMap();
        // create handlers for cluster popups

        if (map) {
            layer
                .on("clustermouseover", (c) => {
                    const markers = c.propagatedFrom.getAllChildMarkers();
                    const data = this.getClusterValues(markers);
                    const popupMsg = this.createPopupMessage(data);
                    L.popup()
                        .setLatLng(c.propagatedFrom.getLatLng())
                        .setContent(popupMsg)
                        .openOn(map);
                })
                .on("clustermouseout", function () {
                    map.closePopup();
                })
                .on("clusterclick", function () {
                    map.closePopup();
                });
        }
        // update state
        this.getState().setLayer(layer);

        this.render(LayerToolRenderType.LAYER);

        return [layer];
    }

    protected prepareMapData(): void {
        const dimensions: IBubbleLayerToolDimensions =
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
        let dataItem: IWorkData | undefined;
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

            for (let i = 0; i < dataLen; i++) {
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
                        subvalues: {},
                        colors: {},
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

                if (aggregationDimension?.getName() === "count") {
                    dataItem.value++;
                    this.max++;
                } else if (typeof foundValues[0] === "number") {
                    dataItem.value += foundValues[0];
                    this.max += foundValues[0];
                }

                foundCategories = mapData.getDataRecordValues(
                    categoryDimension,
                    data[i]
                );

                if (foundCategories.length !== 1) {
                    let sub = dataItem.subvalues["undefined"];
                    sub =
                        sub !== undefined && typeof foundValues[0] === "number"
                            ? sub + foundValues[0]
                            : 0;
                    dataItem.subvalues["undefined"] = sub;
                } else if (
                    typeof foundCategories[0] === "string" &&
                    typeof foundValues[0] === "number"
                ) {
                    dataItem.subvalues[foundCategories[0]] = foundValues[0];
                    dataItem.category = foundCategories[0];

                    const rules = this.getState().getCategoryColorRules();

                    for (let j = 0; j < rules.length; ++j) {
                        if (
                            dataItem &&
                            rules[j].operation?.match(dataItem.category, rules[j].value)
                        ) {
                            dataItem.colors = dataItem.colors ?? {};

                            dataItem.colors[foundCategories[0]] = rules[j].color ?? "red";
                            break;
                        }
                    }
                }
            }
        }
        this.getState().setWorkData(workData);
    }

    protected updateStyle(): void {
        const dimensions = this.getState().getDimensions();
        const bubbleSizeDimension = dimensions.bubbleSize.getValue();
        const colorDimension = dimensions.color.getValue();

        if (bubbleSizeDimension) {
            this.getState()
                .getMarkers()
                ?.every((item: L.Marker) => {
                    const options = item?.options?.icon?.options as IBubbleIconOptions;
                    options.bubbleSize = bubbleSizeDimension;
                });
        }

        if (colorDimension) {
            this.getState()
                .getMarkers()
                ?.every((item) => {
                    const options = item?.options?.icon?.options as IBubbleIconOptions;
                    options.bubbleColor = colorDimension;
                });
        }
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
                this.prepareMapData();
                this.createMarkers();
                this.updateStyle();
                break;
            default:
                this.createMarkers();
                this.updateStyle();
                break;
        }

        super.render(type);
    }

    protected createMarkers(): void {
        const data = this.getState().getWorkData();

        const markers = [];

        const layer = this.getState().getLayer();
        for (let i = 0; i < data.length; i++) {
            const point = this.createMarker(data[i]);
            if (point) {
                layer?.addLayer(point);
                markers.push(point);
            }
        }

        this.getState().setMarkers(markers);
    }

    protected createMarker(data: IWorkData): L.Marker | undefined {
        const popupMsg = this.createPopupMessage(data);
        const dimensions = this.getState().getDimensions();

        if (!data.lat || !data.lng) {
            return;
        }

        const point = L.marker([data.lat, data.lng], {
            icon: new BubbleIcon({
                values: data,
                max: this.max,
                map: () => this.getMap(),
                bubbleSize: dimensions.bubbleSize.getValue(),
                bubbleColor: dimensions.color.getValue(),
            }),
        }).bindPopup(popupMsg);

        point
            .on("mouseover", function () {
                point.openPopup();
            })
            .on("mouseout", () => {
                point.closePopup();
            });

        return point;
    }

    protected getClusterValues(childMarkers: L.Marker[]): IBubbleIconValues {
        const data: IBubbleIconValues = {
            id: "<Group>",
            value: 0,
            subvalues: {},
            colors: {},
        };

        for (let i = 0; i < childMarkers.length; i++) {
            const options = childMarkers[i]?.options?.icon
                ?.options as IBubbleIconOptions;
            data.value += options.values.value;

            for (const [key, value] of Object.entries(options.values.subvalues)) {
                if (data.subvalues[key] === undefined) {
                    data.subvalues[key] = value as number;
                } else {
                    data.subvalues[key] += value as number;
                }
                if (options.values.colors) {
                    data.colors[key] = options.values.colors[key];
                }
            }
        }

        return data;
    }

    protected createPopupMessage(data: IBubbleIconValues): string {
        function thousands_separator(num: number) {
            const num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return num_parts.join(".");
        }

        // build popup message
        let popupMsg = "<b>" + "Detail:" + "</b><br>";
        popupMsg +=
            (data.value != null
                ? "Aggregated: " + thousands_separator(data.value)
                : "N/A") + "<br>";
        for (const [key, value] of Object.entries(data.subvalues)) {
            if (key !== "undefined") {
                popupMsg += key + ": " + thousands_separator(value) + "<br>";
            }
        }

        return popupMsg;
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

export default BubbleLayerTool;
