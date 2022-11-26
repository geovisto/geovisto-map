import L, { CircleMarker } from "leaflet";

// onw styles
import "../../../style/dotLayer.scss";

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
import {
    ISelectionToolAPI,
    ISelectionToolAPIGetter,
} from "../../../../../selection";
import IDotLayerTool from "../../types/tool/IDotLayerTool";
import { IDotLayerToolConfig } from "../../types/tool/IDotLayerToolConfig";
import IDotLayerToolDefaults from "../../types/tool/IDotLayerToolDefaults";
import IDotLayerToolDimensions from "../../types/tool/IDotLayerToolDimensions";
import IDotLayerToolProps from "../../types/tool/IDotLayerToolProps";
import IDotLayerToolState, {
    IWorkData,
} from "../../types/tool/IDotLayerToolState";
import DotLayerToolMapForm from "../form/DotLayerToolMapForm";
import DotLayerToolDefaults from "./DotLayerToolDefaults";
import DotLayerToolState from "./DotLayerToolState";

class DotLayerTool
    extends AbstractLayerTool
    implements IDotLayerTool, IMapFormControl
{
    private selectionToolAPI: ISelectionToolAPI | undefined;
    private mapForm!: IMapForm;

    private radius: number;

    public constructor(props?: IDotLayerToolProps) {
        super(props);

        this.radius = 10;
    }

    public copy(): IDotLayerTool {
        return new DotLayerTool(this.getProps());
    }

    public getProps(): IDotLayerToolProps {
        return <IDotLayerToolProps>super.getProps();
    }

    public getDefaults(): IDotLayerToolDefaults {
        return <IDotLayerToolDefaults>super.getDefaults();
    }

    public getState(): IDotLayerToolState {
        return <IDotLayerToolState>super.getState();
    }

    protected createDefaults(): IDotLayerToolDefaults {
        return new DotLayerToolDefaults();
    }

    protected createState(): IDotLayerToolState {
        return new DotLayerToolState(this);
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
        return new DotLayerToolMapForm(this);
    }

    public initialize(initProps: IMapToolInitProps<IDotLayerToolConfig>): this {
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
            ?.on("zoomend", () => this.render(LayerToolRenderType.STYLE));

        return [layer];
    }

    protected prepareMapData(): void {
        const dimensions: IDotLayerToolDimensions = this.getState().getDimensions();

        const latitudeDimension: IMapDataDomain | undefined =
            dimensions.latitude.getValue();
        const longitudeDimension: IMapDataDomain | undefined =
            dimensions.longitude.getValue();
        const categoryDimension: IMapDataDomain | undefined =
            dimensions.category.getValue();

        const map = this.getMap();
        const workData: IWorkData[] = [];

        if (latitudeDimension && longitudeDimension && categoryDimension && map) {
            const mapData: IMapDataManager = map.getState().getMapData();
            const data: IMapData = map.getState().getCurrentData();
            const dataLen: number = data.length;

            let foundLats: unknown[],
                foundLongs: unknown[],
                foundCategories: unknown[];

            for (let i = 0; i < dataLen; i++) {
                foundLats = mapData.getDataRecordValues(latitudeDimension, data[i]);

                if (foundLats.length !== 1) {
                    foundLats = [];
                }
                foundLongs = mapData.getDataRecordValues(longitudeDimension, data[i]);

                if (foundLongs.length !== 1) {
                    foundLongs = [];
                }
                foundCategories = mapData.getDataRecordValues(
                    categoryDimension,
                    data[i]
                );

                if (foundCategories.length !== 1) {
                    foundCategories = [];
                }

                const dataItem: IWorkData = {
                    lat: undefined,
                    lng: undefined,
                    color: undefined,
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

                if (foundCategories.length === 1) {
                    const rules = this.getState().getCategoryColorRules();

                    rules.forEach((rule) => {
                        if (rule.operation?.match(foundCategories[0], rule.value)) {
                            dataItem.color = rule.color ?? (dataItem.color || "red");
                        }
                    });
                }

                if (dataItem) {
                    workData.push(dataItem);
                }
            }
        }

        this.getState().setWorkData(workData);
    }

    protected createDot(
        data: IWorkData,
        renderer: L.Canvas
    ): CircleMarker | undefined {
        const dimension = this.getState().getDimensions();
        const colorDimension = dimension.color.getValue();

        if (!data.lat || !data.lng) {
            return;
        }

        return L.circleMarker([data.lat, data.lng], {
            renderer: renderer,
            radius: this.radius,
            weight: 1,
            fillOpacity: 0.5,
            color: data.color ?? colorDimension,
        });
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
                this.prepareMapData();
                this.createMarkers();
                break;
            default:
                this.createMarkers();
                break;
        }

        super.render(type);
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

    private calculateRadius(): void {
        const zoomLevel = this.getMap()?.getState().getLeafletMap()?.getZoom();

        if (!zoomLevel) {
            this.radius = 1;
            return;
        }

        if (zoomLevel >= 1 && zoomLevel <= 7) {
            this.radius = 1;
        } else if (zoomLevel >= 8 && zoomLevel <= 9) {
            this.radius = 2;
        } else if (zoomLevel >= 10 && zoomLevel <= 11) {
            this.radius = 4;
        } else if (zoomLevel >= 12 && zoomLevel <= 14) {
            this.radius = 5;
        } else if (zoomLevel >= 15 && zoomLevel <= 17) {
            this.radius = 6;
        } else if (zoomLevel >= 18 && zoomLevel <= 19) {
            this.radius = 7;
        } else {
            this.radius = 1;
        }
    }

    protected createMarkers(): void {
        const data = this.getState().getWorkData();
        const markers = [];
        this.calculateRadius();
        const renderer = L.canvas({ padding: 0.5 });
        const layer = this.getState().getLayer();
        if (!layer) {
            return;
        }

        for (let i = 0; i < data.length; i++) {
            const point = this.createDot(data[i], renderer);
            if (point) {
                point.addTo(layer);
                markers.push(point);
            }
        }

        this.getState().setMarkers(markers);
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

export default DotLayerTool;
