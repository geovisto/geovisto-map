import AbstractSidebarInput from "./AbstractSidebarInput";
import TextSidebarInput from "./input/TextSidebarInput";
import LabeledTextSidebarInput from "./input/LabeledTextSidebarInput";
import SelectSidebarInput from "./select/SelectSidebarInput";
import LabeledSelectSidebarInput from "./select/LabeledSelectSidebarInput";
import FilterSelectSidebarInput from "./filter/FilterSelectSidebarInput";
import FilterAutocompleteSidebarInput from "./filter/FilterAutocompleteSidebarInput";
import AutocompleteSidebarInput from "./input/AutocompleteSidebarInput";
/**
 * Factory for sidebar inputs.
 * 
 * @author Jiri Hynek
 */
class SidebarInputFactory {

    /**
     * Static function creates new sidebar input of given identifier.
     * 
     * @param {*} id 
     */
    static createSidebarInput(id, settings) {
        let element = null;
        if(id == TextSidebarInput.ID()) {
            element = new TextSidebarInput(settings);
        } else if(id == LabeledTextSidebarInput.ID()) {
            element = new LabeledTextSidebarInput(settings);
        } else if(id == SelectSidebarInput.ID()) {
            element = new SelectSidebarInput(settings);
        } else if(id == LabeledSelectSidebarInput.ID()) {
            element = new LabeledSelectSidebarInput(settings);
        } else if(id == FilterSelectSidebarInput.ID()) {
            element = new FilterSelectSidebarInput(settings);
        } 
        
        else if(id == AutocompleteSidebarInput.ID()){
            element = new AutocompleteSidebarInput(settings);
        } else if(id == FilterAutocompleteSidebarInput.ID()){
            element = new FilterAutocompleteSidebarInput(settings);
        } 
        
        else {
            element = new AbstractSidebarInput(settings);
        }
        return element;
    }
}

export default SidebarInputFactory;