import { IMapForm, IMapFormControl, IMapToolConfig, IMapToolInitProps, IMapToolProps, MapTool } from "../../../../index.core";
import IDownloaderTool from "../types/IDownloaderTool";
import IDownloaderToolDefaults from "../types/IDownloaderToolDefaults";
import IDownloaderToolState from "../types/IDownloaderToolState";
import DownloaderToolDefaults from "./DownloaderToolDefaults";
import DownloaderToolState from "./DownloaderToolState";
import DownloaderToolMapForm from "./forms/DownloaderToolMapForm";


class DownloaderTool extends MapTool implements IMapFormControl, IDownloaderTool {
    private mapForm!: DownloaderToolMapForm;                         
   
    public constructor(props?: IMapToolProps) {
        super(props);
    }

    public getMapForm(): IMapForm {
        if (this.mapForm == undefined) {
            this.mapForm = this.createMapForm() as DownloaderToolMapForm;
        }
        return this.mapForm;
    }

    public getDefaults(): IDownloaderToolDefaults {
        return <IDownloaderToolDefaults>super.getDefaults();
    }

    public createDefaults(): IDownloaderToolDefaults {
        return new DownloaderToolDefaults();
    }

    protected createMapForm(): IMapForm {
        return new DownloaderToolMapForm(this);
    }

    public initialize(initProps: IMapToolInitProps<IMapToolConfig>): this {
        return super.initialize(initProps);
    }

    public getState(): IDownloaderToolState {
        return <IDownloaderToolState>super.getState();
    }

    public createState(): IDownloaderToolState {
        return new DownloaderToolState(this);
    }

    public copy(): IDownloaderTool {
        return new DownloaderTool(this.getProps());
    }

    public create(): this {
        // Bind event listener for zoom to show current zoom level.
        this.changeForm();
        this.getMap()?.getState().getLeafletMap()?.addEventListener("zoom" , this.changeForm, this);

        return this;
    }
    
    /**
     * Update displayed zoom level in form.
     */
    private changeForm() : void {
        if (this.mapForm) {
            const temp = this.getMap()?.getState().getLeafletMap()?.getZoom();
            if (temp) {
                this.mapForm.changeCurrentZoom(temp);
            }
        }
    }
}

export default DownloaderTool;