// Geovisto core
import {
    EqFilterOperation,
    GtEqFilterOperation,
    GtFilterOperation,
    IMap,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterManager,
    IMapFilterOperation,
    IMapTypeDimension,
    IntegerTypeManager,
    LayerToolDefaults,
    LtEqFilterOperation,
    LtFilterOperation,
    MapDomainArrayManager,
    MapDomainDimension,
    MapDynamicDomainDimension,
    MapFiltersManager,
    MapTypeDimension,
    NeqFilterOperation,
} from "../../../../../../index.core";

// Internal
import { Gradients, IGradient } from "../../types/gradient/IGradient";
import IHeatLayerToolDefaults from "../../types/tool/IHeatLayerToolDefaults";
import IHeatLayerToolDimensions from "../../types/tool/IHeatLayerToolDimensions";
import { IZoomLevel, ZoomLevels } from "../../types/zoom/IZoomLevel";
import Gradient from "../gradient/Gradient";
import ZoomLevel from "../zoom/ZoomLevel";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Vladimir Korencik
 */
class HeatLayerToolDefaults
    extends LayerToolDefaults
    implements IHeatLayerToolDefaults {
    public static TYPE = "geovisto-tool-layer-heat";

    public getType(): string {
        return HeatLayerToolDefaults.TYPE;
    }

    public getLayerName(): string {
        return "Heat layer";
    }

    public getLabel(): string {
        return this.getLayerName();
    }

    public getIcon(): string {
        return '<i class="fa fa-fire"></i>';
    }

    public getFiltersManager(): IMapFilterManager {
        return new MapFiltersManager([
            new EqFilterOperation(),
            new NeqFilterOperation(),
            new GtEqFilterOperation(),
            new LtEqFilterOperation(),
            new LtFilterOperation(),
            new GtFilterOperation(),
        ]);
    }

    public getDimensions(map?: IMap): IHeatLayerToolDimensions {
        return {
            latitude: this.getLatitudeDimension(map),
            longitude: this.getLongitudeDimension(map),
            intensity: this.getIntensityDimension(map),
            radius: this.getRadiusDimension(),
            gradient: this.getGradientDimension(),
            blur: this.getBlurDimension(),
            zoom: this.getZoomDimension(),
            currentZoom: this.getCurrentZoomDimension(),
            reactiveOp: this.getReactiveRadiusOperationDimension(),
            reactiveRadius: this.getReactiveRadiusDimension(),
            reactiveZoom: this.getReactiveRadiusZoomDimension(),
        };
    }

    public getLatitudeDimension(
        map?: IMap
    ): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Latitude",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getLongitudeDimension(
        map?: IMap
    ): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Longitude",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getIntensityDimension(
        map?: IMap
    ): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Intensity",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getRadiusDimension(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "Radius",
            new IntegerTypeManager(),
            10
        );
    }

    public getGradientDimension(): IMapDomainDimension<IGradient> {
        const domainManager = new MapDomainArrayManager([
            new Gradient(Gradients.DEFAULT),
            new Gradient(Gradients.PROTANO_DEUTRAN_A),
            new Gradient(Gradients.PROTANO_DEUTRAN_B),
            new Gradient(Gradients.MONOCHROMATIC),
            new Gradient(Gradients.TRITAN),
        ]);
        return new MapDomainDimension(
            "Gradient",
            domainManager,
            domainManager.getDefault()
        );
    }

    public getBlurDimension(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "Blur",
            new IntegerTypeManager(),
            10
        );
    }

    public getZoomDimension(): IMapDomainDimension<IZoomLevel> {
        const domainManager = new MapDomainArrayManager([
            new ZoomLevel(ZoomLevels.MIN),
            new ZoomLevel(ZoomLevels.NORMAL),
            new ZoomLevel(ZoomLevels.MAX),
        ]);
        return new MapDomainDimension(
            "Zoom",
            domainManager,
            domainManager.getDefault()
        );
    }
    public getCurrentZoomDimension(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "Current Zoom: ",
            new IntegerTypeManager(),
            undefined
        );
    }

    public getReactiveRadiusOperationDimension(): IMapDomainDimension<IMapFilterOperation> {
        const domainManager = new MapDomainArrayManager([
            new EqFilterOperation(),
            new NeqFilterOperation(),
            new GtEqFilterOperation(),
            new LtEqFilterOperation(),
            new LtFilterOperation(),
            new GtFilterOperation(),
        ]);

        return new MapDomainDimension(
            "Operation",
            domainManager,
            domainManager.getDefault()
        );
    }
    public getReactiveRadiusZoomDimension(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "Zoom Level",
            new IntegerTypeManager(),
            undefined
        );
    }
    public getReactiveRadiusDimension(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "Radius",
            new IntegerTypeManager(),
            undefined
        );
    }
}

export default HeatLayerToolDefaults;
