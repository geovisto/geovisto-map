// Geovisto core
import {
    IMapForm,
    IMapDataManager,
    LabeledAutocompleteFormInput,
    MapObjectForm,
} from "../../../../../index.core";

import IInfoTool from "../../types/tool/IInfoTool";

import MarkdownIt from "markdown-it";
import IInfoDataManager from "../../types/infodata/IInfoDataManager";
import IInfoData from "../../types/infodata/IInfoData";

/**
 * This class provides controls for management of info map form inputs.
 * 
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
class InfoToolMapForm extends MapObjectForm<IInfoTool> implements IMapForm {
    
    /**
     * TODO: exclude class variables to the defaults and state.
     */
    private htmlContent!: HTMLDivElement;

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
        public constructor(tool: IInfoTool) {
        super(tool);
    }

    /**
     * A help function which returns data manager
     */
     protected getDataManager(): IMapDataManager | undefined {
        return this.getMapObject().getMap()?.getState().getMapData();
    }

    /**
     * It returns a HTML div element containing the form.
     */
    public getContent(): HTMLDivElement {
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
                md_div.setAttribute("style", "");
            } else {
                md_div.innerHTML = "";
                md_div.setAttribute("style", "background-color: rgba(240, 240, 240, 0);");
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


        return this.htmlContent;
    }

}
export default InfoToolMapForm;