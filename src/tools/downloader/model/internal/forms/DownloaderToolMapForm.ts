import {
    IMapForm,
    MapObjectForm,
    TabDOMUtil,
} from "../../../../../index.core";
import IDownloaderTool from "../../types/IDownloaderTool";
import DownloaderToolMapControl from "./DownloaderToolMapControl";

/**
 * Form for DownloaderTool.
 * 
 * @author Vojtěch Malý
 */
class DownloaderToolMapForm extends MapObjectForm<IDownloaderTool> implements IMapForm {
    private htmlContent!: HTMLDivElement;                                       // Main content div
    private currentZoom : HTMLDivElement = document.createElement('div');       // Curent zoom indicator
    private control : DownloaderToolMapControl;                                 // Controler
    public searchBtn : HTMLButtonElement | null = null;
    
    public constructor(tool: IDownloaderTool) {
        super(tool);
        const mapLeaflet = this.getMapObject().getMap()?.getState().getLeafletMap();
        this.control = new DownloaderToolMapControl(mapLeaflet);
    }

    /**
     * Returns html div elemnt of hierarchy tool. If not defined, creates one. 
     * 
     * @returns Main div form element.
     */
    public getContent(): HTMLDivElement {
        if (this.htmlContent == undefined) {
            // Create main div
            this.htmlContent = document.createElement('div');
            this.htmlContent.setAttribute('id','downloaderDiv');

            // Create zoom level div where current zoom level is displayed.
            const currentZoom = document.createElement('div');
            currentZoom.setAttribute("id", "currentZoom");
            this.currentZoom = currentZoom;
            this.htmlContent.appendChild(currentZoom);
            
            // Create selecetion of countries and admin levels
            this.htmlContent.appendChild(this.control.createSelection());
            this.htmlContent.appendChild(this.control.createAdminLevelSelection());
            
            // Creates object type selection
            this.htmlContent.appendChild(document.createElement("div"));
            this.htmlContent.appendChild(this.control.objectTypeInput.create());

            // Creates simplify scale
            this.htmlContent.appendChild(this.control.createSimplifyNumberInput());
            this.control.simplifyDisable();

            // Creates download button
            this.htmlContent.appendChild(this.createFetchButton());
            this.htmlContent.appendChild(document.createElement("div"));

            // Creates DownloadGeo button
            this.htmlContent.appendChild(this.control.downloadGeojsonBTN);
            //Creates progress bar of download.
            this.htmlContent.appendChild(this.control.progressBar);
            // Creates hierarchy edit div.
            this.htmlContent.appendChild(this.control.hierarchyEditToolDiv);
            // Creates download hierarchy button.
            this.htmlContent.appendChild(this.control.downloadHierarchyBTN);            
        }

        return this.htmlContent;
    }

    /**
     * Change displayed zoom number. 
     * 
     * @param newZoom 
     * @returns 
     */
    public changeCurrentZoom(newZoom : number) : void{
        this.currentZoom.innerHTML = "Current zoom level: " + newZoom;
        return;
    }

    /**
     * Creates button, on click fetches selected value.
     * 
     * @returns Button
     */
    protected createFetchButton() : HTMLButtonElement {
        const btn = TabDOMUtil.createButton("Download", () => {
            this.control.fetchHandle();
        },"downloadBtn");
        this.searchBtn = btn;
        return btn;
    }
}

export default DownloaderToolMapForm;