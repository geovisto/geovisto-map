import {
    IMapForm,
    MapObjectForm,
} from "../../../../../index.core";
import IHierarchyTool from "../../types/IHierarchyTool";

/**
 * Hierarchy tool map form.
 * @author Vojtěch Malý
 */
class HierarchyToolMapForm extends MapObjectForm<IHierarchyTool> implements IMapForm {
    // Form content element
    private htmlContent!: HTMLDivElement;
    
    public constructor(tool: IHierarchyTool) {
        super(tool);
    }

    /**
     * Returns html div elemnt of hierarchy tool. If not defined, creates one. 
     * @returns 
     */
    public getContent(): HTMLDivElement {
        if (this.htmlContent == undefined) {
            // Create main div
            this.htmlContent = document.createElement('div');      
        }
        return this.htmlContent;
    }

}

export default HierarchyToolMapForm;