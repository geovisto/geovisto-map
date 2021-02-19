// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapForm from "../../../../../../model/types/form/IMapForm";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import MapLayerToolForm from "../../../../../../model/internal/form/MapLayerToolForm";

import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolMapForm extends MapLayerToolForm<IMarkerLayerTool> implements IMapForm {
    
    private htmlContent!: HTMLDivElement;
    
    private inputs?: {
        geoData: IMapFormInput,
        geoId: IMapFormInput,
        value: IMapFormInput,
        aggregation: IMapFormInput,
        category: IMapFormInput
    };

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IMarkerLayerTool) {
        super(tool);
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public setInputValues(dimensions: IMarkerLayerToolDimensions): void {
        // update inputs
        this.inputs?.geoData.setValue((dimensions.geoData.getDomain()?.getName())?? "");
        this.inputs?.geoId.setValue((dimensions.geoId.getDomain()?.getName())?? "");
        this.inputs?.value.setValue((dimensions.value.getDomain()?.getName())?? "");
        this.inputs?.aggregation.setValue((dimensions.aggregation.getDomain()?.getName())?? "");
        this.inputs?.category.setValue((dimensions.category.getDomain()?.getName())?? "");
    }

    /**
     * It returns the sidebar tab pane.
     */
    public getContent(): HTMLDivElement {
        if(this.htmlContent == undefined) {
            // tab content
            this.htmlContent = document.createElement('div');
            const elem = this.htmlContent.appendChild(document.createElement('div'));
    
            // get data mapping model
            const dimensions: IMarkerLayerToolDimensions = this.getMapObject().getState().getDimensions();

            // create inputs
            this.inputs = {
                geoData: this.getInputGeoData(dimensions.geoData),
                geoId: this.getInputGeoId(dimensions.geoId),
                value: this.getInputValue(dimensions.value),
                aggregation: this.getInputAggregation(dimensions.aggregation),
                category: this.getInputCategory(dimensions.category)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geoData.create());  
            elem.appendChild(this.inputs.geoId.create());        
            elem.appendChild(this.inputs.value.create());            
            elem.appendChild(this.inputs.aggregation.create());
            elem.appendChild(this.inputs.category.create());
    
            // set input values
            this.setInputValues(dimensions);
        }
        
        return this.htmlContent;
    }

    /**
     * It returns new input for the geo data dimension.
     * 
     * @param dimension
     */
    public getInputGeoData(dimension: IMapDimension<IGeoData>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo id dimension.
     * 
     * @param dimension
     */
    public getInputGeoId(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputValue(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputAggregation(dimension: IMapDimension<IMapAggregationFunction>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputCategory(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

}
export default MarkerLayerToolMapForm;