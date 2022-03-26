// Geovisto core
import {
    IMapForm,
    IMapDataManager,
    FilterAutocompleteFormInput,
    LabeledAutocompleteFormInput,
    MapObjectForm,
    TabDOMUtil
} from "../../../../../index.core";

import IInfoTool from "../../types/tool/IInfoTool";

import MarkdownIt from "markdown-it";

/**
 * This interface provides a help type which represents double (html element container, input).
 * 
 * @author Jiri Hynek
 */
interface InputItem {
    container: HTMLDivElement,
    input: FilterAutocompleteFormInput
}

/**
 * This class provides controls for management of filters map form inputs.
 * 
 * @author Jiri Hynek
 */
class InfoToolMapForm extends MapObjectForm<IInfoTool> implements IMapForm {
    
    /**
     * TODO: exclude class variables to the defaults and state.
     */
    private htmlContent!: HTMLDivElement;
    private btnGroup: HTMLDivElement | null;
    private inputs: InputItem[];

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
        public constructor(tool: IInfoTool) {
        super(tool);

        this.btnGroup = null;
        this.inputs = [];
    }

    /**
     * A help function which returns data manager
     */
     protected getDataManager(): IMapDataManager | undefined {
        return this.getMapObject().getMap()?.getState().getMapData();
    }

    /**
     * It returns a HTML div element conatining the form.
     */
    public getContent(): HTMLDivElement {
        //if(this.htmlContent == undefined) {
            // tab pane
            this.htmlContent = document.createElement('div');
            const md_div = document.createElement('div');
            md_div.setAttribute("id", "md_wrapper");
            const md = MarkdownIt({
                typographer: true,
                quotes: '“”‘’',
            });
            const file = require("../../../../../../static/info/test.md");
            md_div.innerHTML = md.render(file.default);
            this.htmlContent.appendChild(md_div);

        //}

        return this.htmlContent;
    }

}
export default InfoToolMapForm;