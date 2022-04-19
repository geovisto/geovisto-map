import {
    IMapForm,
    MapObjectForm,
    TabDOMUtil,
} from "../../../../../index.core";
import IDownloaderTool from "../../types/IDownloaderTool";
import DownloaderToolMapControl from "./DownloaderToolMapControl";

/**
 * Hierarchy tool form
 */
class DownloaderToolMapForm extends MapObjectForm<IDownloaderTool> implements IMapForm {
    // Form content element
    private htmlContent!: HTMLDivElement;
    private currentZoom : HTMLDivElement = document.createElement('div');
    private control : DownloaderToolMapControl;
    public searchBtn : HTMLButtonElement | null = null;
    
    public constructor(tool: IDownloaderTool) {
        super(tool);
        const mapx = this.getMapObject().getMap()?.getState().getLeafletMap();
        this.control = new DownloaderToolMapControl(mapx);
    }

    /**
     * Returns html div elemnt of hierarchy tool. If not defined, creates one. 
     * @returns 
     */
    public getContent(): HTMLDivElement {
        if (this.htmlContent == undefined) {
            // Create main div
            this.htmlContent = document.createElement('div');
            // Create zoom level div where current zoom level is displayed.
            const currentZoom = document.createElement('div');
            currentZoom.setAttribute("id", "currentZoom");
            this.currentZoom = currentZoom;
            this.htmlContent.appendChild(currentZoom);
            
            // Create selecetion
            this.htmlContent.appendChild(this.control.createSelection());
            this.htmlContent.appendChild(this.control.createAdminLevelSelection());
            // Input?
            this.htmlContent.appendChild(document.createElement("div"));
            this.htmlContent.appendChild(this.control.polygonOrPointSelect.create());

            this.htmlContent.appendChild(this.control.createSimplifyNumberInput());
            this.control.simplifyDisable();

            this.htmlContent.appendChild(this.createFetchButton());
            this.htmlContent.appendChild(document.createElement("div"));
            this.htmlContent.appendChild(this.control.downloadGeoButton);
            this.htmlContent.appendChild(this.control.progressBar);
            this.htmlContent.appendChild(this.control.hierarchyEditToolDiv);
            this.htmlContent.appendChild(this.control.downloadHierarchyButton);            
        }
        return this.htmlContent;
    }

    public changeCurrentZoom(newZoom : number) : void{
        this.currentZoom.innerHTML = "Current zoom level: " + newZoom;
        return;
    }

    /**
     * Creates button, on click fetches selected value.
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