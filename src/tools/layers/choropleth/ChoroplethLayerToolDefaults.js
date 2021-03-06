import ChoroplethLayerTool from "./ChoroplethLayerTool";
import AbstractLayerToolDefaults from "../abstract/AbstractLayerToolDefaults";
import AutocompleteSidebarInput from "../../../inputs/input/AutocompleteSidebarInput";

/**
 * TODO: refactorization needed!
 */
const TYPE = 'choropleth';

const INPUT_ID_PREFIX = "geovisto-input-" + TYPE;

/**
 * Data mapping model which can be used in the sidebar form.
 */
const MAPPING_MODEL = {
    country: {
        id: INPUT_ID_PREFIX + "-country",
        name: "country",
        label: "Country",
        input: AutocompleteSidebarInput.ID()
    },
    value: {
        id: INPUT_ID_PREFIX + "-value",
        name: "value",
        label: "Value",
        input: AutocompleteSidebarInput.ID()
    },
    aggregation: {
        id: INPUT_ID_PREFIX + "-aggregation",
        name: "aggregation",
        label: "Agregation",
        options: [ "count", "sum" ],
        input: AutocompleteSidebarInput.ID()
    },
    color: {
        id: INPUT_ID_PREFIX + "-color",
        name: "color",
        label: "Color",
        options: [ "orange", "blue", "red" ],
        input: AutocompleteSidebarInput.ID()
    }
}

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolDefaults extends AbstractLayerToolDefaults {

    /**
     * It initializes tool defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    getType() {
        return ChoroplethLayerTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    getLayerName() {
        return "Choropleth layer";
    }

    /**
     * It returns the default mapping of data domains to chart dimensions.
     */
    getDataMapping() {
        let dataMapping = {};
        
        let dataMappingModel = this.getDataMappingModel();
        let implicitDataDomainLabel = this.getMapObject().getMap().getState().getMapData().getDataDomainLabels()[0];
        
        dataMapping[dataMappingModel.country.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.value.name] = implicitDataDomainLabel;
        dataMapping[dataMappingModel.aggregation.name] = dataMappingModel.aggregation.options[0];
        dataMapping[dataMappingModel.color.name] = dataMappingModel.color.options[0];

        return dataMapping;
    }

    /**
     * It returns the data mapping model.
     */
    getDataMappingModel() {
        return MAPPING_MODEL;
    }
    
    /**
     * It returns default centroids.
     */
    getPolygons() {
        return this.getMapObject().getMap().getState().getPolygons();
    }

    /**
     * It returns preferred z index for the choropoleth layer
     */
    getZIndex() {
        return 350;
    }
}
export default ChoroplethLayerToolDefaults;