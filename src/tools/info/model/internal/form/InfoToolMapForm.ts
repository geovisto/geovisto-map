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
import IInfoDataManager from "../../types/infodata/IInfoDataManager";
import IMapTheme from "../../../../themes/model/types/theme/IMapTheme";
import IInfoData from "../../types/infodata/IInfoData";

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
            const tool: IInfoTool = this.getMapObject();
            const dataManager: IInfoDataManager = tool.getState().getInfoDataManager();
            const md = MarkdownIt({
                typographer: true,
                quotes: '“”‘’',
            });
            if (dataManager.getDomains() != undefined) {
                if (dataManager.getDomains().length > 0) {
                    const defaultMarkdown = dataManager.getDomains()[0];
                    tool.getState().setMarkdown(defaultMarkdown);
                }
            }
            const changeInfoData = function(e: Event) {
                const newMarkdown: IInfoData | undefined = dataManager.getDomain((e.target as HTMLInputElement)?.value);
                const md_div = document.getElementById("md_wrapper");
                if(newMarkdown) {
                    tool.getState().setMarkdown(newMarkdown);
                    const data = tool.getState().getMarkdown().getInfoMD();
                    md_div.innerHTML = md.render(data);
                } else {
                    md_div.innerHTML = "";
                }
            };
            const themeInput = new LabeledAutocompleteFormInput({ label: "Info file:", options: dataManager.getDomainNames(), onChangeAction: changeInfoData });
            this.htmlContent = document.createElement('div');
            this.htmlContent.appendChild(themeInput.create());
            themeInput.setValue(tool.getState().getMarkdown().getName());

            const data = tool.getState().getMarkdown().getInfoMD();
            // tab pane
            const md_div = document.createElement('div');
            md_div.setAttribute("id", "md_wrapper");
            md_div.innerHTML = md.render(data);
            this.htmlContent.appendChild(md_div);

        //}

        return this.htmlContent;
    }

}
export default InfoToolMapForm;