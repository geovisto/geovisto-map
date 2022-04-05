import HeatLayerTool from "./HeatLayerTool";
import AbstractLayerToolDefaults from "../abstract/AbstractLayerToolDefaults";
import AutocompleteSidebarInput from "../../../inputs/input/AutocompleteSidebarInput";
import TextSidebarInput from "../../../inputs/input/TextSidebarInput";
import LabeledTextSidebarInput from "../../../inputs/input/LabeledTextSidebarInput";
import LabeledSelectSidebarInput from "../../../inputs/select/LabeledSelectSidebarInput";

/**
 * TODO: refactorization needed!
 */
const TYPE = 'heat';

const INPUT_ID_PREFIX = "geovisto-input-" + TYPE;

const ZOOM_DEFAULT = 'normal';

/**
 * Data mapping model which can be used in the sidebar form.
 */
const MAPPING_MODEL = {
    latitude: {
        id: INPUT_ID_PREFIX + "-input-latitude",
        name: "latitude",
        label: "Latitude",
        input: AutocompleteSidebarInput.ID()
    },
    longitude: {
        id: INPUT_ID_PREFIX + "-input-longitude",
        name: "longitude",
        label: "Longitude",
        input: AutocompleteSidebarInput.ID()
    },
    intensity: {
        id: INPUT_ID_PREFIX + "-input-intensity",
        name: "intensity",
        label: "Intensity",
        input: AutocompleteSidebarInput.ID()
    },
    radius: {
        id: INPUT_ID_PREFIX + "-input-radius",
        name: "radius",
        label: "Radius",
        input: LabeledTextSidebarInput.ID()
    },
    gradient: {
        id: INPUT_ID_PREFIX + "input-gradient",
        name: "gradient",
        label: "Gradient",
        input: AutocompleteSidebarInput.ID()
    },
    blur: {
        id: INPUT_ID_PREFIX + "input-blur",
        name: "blur",
        label: "Blur",
        input: LabeledTextSidebarInput.ID()
    },
    opacity: {
        id: INPUT_ID_PREFIX + "input-opacity",
        name: "opacity",
        label: "Opacity",
        input: AutocompleteSidebarInput.ID()
    },
    zoom: {
        id: INPUT_ID_PREFIX + "input-zoom",
        name: "zoom",
        label: "Zoom/Intensity",
        input: AutocompleteSidebarInput.ID()
    }

}

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class HeatLayerToolDefaults extends AbstractLayerToolDefaults {

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-layer-heatmap";

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return HeatLayerToolDefaults.TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Heatmap layer";
    }

    /**
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return this.getLayerName();
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-th-large"></i>';
    }

    /**
     * It returns the default mapping of data domains to chart dimensions.
     */
    public getDataMapping(): any {
        const dataMapping = {};
        
        const dataMappingModel = this.getDataMappingModel();
        const implicitDataDomainLabel = this.getMapObject().getMap().getState().getMapData().getDataDomainLabels()[0];
        
        dataMapping[dataMappingModel.latitude.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.longitude.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.intensity.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.radius.name] = '10';
        dataMapping[dataMappingModel.gradient.name] = 'Default';
        dataMapping[dataMappingModel.blur.name] = '10';
        dataMapping[dataMappingModel.zoom.name] = ZOOM_DEFAULT;

        return dataMapping;
    }

    /**
     * It returns the data mapping model.
     */
    public getDataMappingModel(): any {
        return MAPPING_MODEL;
    }
}
export default HeatLayerToolDefaults;