// Leaflet
import { LeafletEvent } from "leaflet";

// Geovisto core
import {
    IMapDataDomain,
    IMapDomainDimension,
    IMapForm,
    IMapFormInput,
    IMapTypeDimension,
    MapLayerToolForm,
    TabDOMUtil,
    LayerToolRenderType,
    IMapFilterOperation,
} from "../../../../../../index.core";

// Internal
import { IGradient } from "../../types/gradient/IGradient";
import {
    IReactiveRadiusForm,
    IReactiveRadiusInputs,
    IReactiveRadiusRules,
} from "../../types/reactiveRadius/IReactiveRadius";
import IHeatLayerTool from "../../types/tool/IHeatLayerTool";
import IHeatLayerToolDimensions from "../../types/tool/IHeatLayerToolDimensions";
import { IZoomLevel } from "../../types/zoom/IZoomLevel";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Vladimir Korencik
 */
class HeatLayerToolMapForm
    extends MapLayerToolForm<IHeatLayerTool>
    implements IMapForm {
    private htmlContent!: HTMLDivElement;
    private reactiveRadius!: HTMLDivElement;
    private tool: IHeatLayerTool;
    private btnGroup: HTMLDivElement | null;

    private inputs?: {
        latitude: IMapFormInput;
        longitude: IMapFormInput;
        intensity: IMapFormInput;
        radius: IMapFormInput;
        gradient: IMapFormInput;
        blur: IMapFormInput;
        zoom: IMapFormInput;
        currentZoom: IMapFormInput;
    };

    private reactiveRadiusInputs?: IReactiveRadiusInputs;

    private reactiveRadiusForm?: IReactiveRadiusForm[];

    public constructor(tool: IHeatLayerTool) {
        super(tool);
        this.btnGroup = null;
        this.tool = tool;
        this.reactiveRadiusForm = [];
    }

    public getTool(): IHeatLayerTool {
        return this.tool;
    }

    public setInputValues(dimensions: IHeatLayerToolDimensions): void {
        this.inputs?.latitude.setValue(
            dimensions.latitude.getValue()?.getName() ?? ""
        );
        this.inputs?.longitude.setValue(
            dimensions.longitude.getValue()?.getName() ?? ""
        );
        this.inputs?.intensity.setValue(
            dimensions.intensity.getValue()?.getName() ?? ""
        );
        this.inputs?.radius.setValue(dimensions.radius.getValue() ?? "");
        this.inputs?.gradient.setValue(
            dimensions.gradient.getValue()?.getName() ?? ""
        );
        this.inputs?.blur.setValue(dimensions.blur.getValue() ?? "");
        this.inputs?.zoom.setValue(dimensions.zoom.getValue() ?? "");
        this.inputs?.currentZoom.setValue(
            dimensions.currentZoom.getValue() ??
            this.getTool().getMap()?.getState().getLeafletMap()?.getZoom()
        );
        this.inputs?.currentZoom.setDisabled(true);
        this.reactiveRadiusInputs?.operation.setValue(
            dimensions.reactiveOp.getValue() ?? ""
        );
        this.reactiveRadiusInputs?.radius.setValue(
            dimensions.reactiveRadius.getValue() ?? ""
        );
        this.reactiveRadiusInputs?.zoom.setValue(
            dimensions?.reactiveZoom.getValue() ?? ""
        );
    }

    public getContent(): HTMLDivElement {
        if (this.htmlContent === undefined) {
            this.htmlContent = document.createElement("div");
            const elem = this.htmlContent.appendChild(
                document.createElement("div")
            );

            const dimensions: IHeatLayerToolDimensions = this.getMapObject()
                .getState()
                .getDimensions();

            this.inputs = {
                latitude: this.getInputLatitude(dimensions.latitude),
                longitude: this.getInputLongtitude(dimensions.longitude),
                intensity: this.getInputIntensity(dimensions.intensity),
                radius: this.getInputRadius(dimensions.radius),
                gradient: this.getInputGradient(dimensions.gradient),
                blur: this.getInputBlur(dimensions.blur),
                zoom: this.getInputZoom(dimensions.zoom),
                currentZoom: this.getCurrentZoom(dimensions.currentZoom),
            };

            elem.appendChild(this.inputs.latitude.create());
            elem.appendChild(this.inputs.longitude.create());
            elem.appendChild(this.inputs.intensity.create());
            elem.appendChild(this.inputs.radius.create());
            elem.appendChild(this.inputs.gradient.create());
            elem.appendChild(this.inputs.blur.create());
            elem.appendChild(this.inputs.zoom.create());

            elem.appendChild(this.getReactiveRadiusContent());
            const zoomInput = this.inputs.currentZoom.create();
            zoomInput.classList.add("zoomLevelWindow");
            elem.appendChild(zoomInput);

            this.btnGroup = this.htmlContent.appendChild(
                document.createElement("div")
            );
            this.btnGroup.setAttribute("class", "filterButtons");

            this.btnGroup.appendChild(
                TabDOMUtil.createButton(
                    '<i class="fa fa-plus-circle"></i>',
                    () => {
                        this.addSelectItem();
                    },
                    "plusBtn"
                )
            );

            this.btnGroup.appendChild(
                TabDOMUtil.createButton(
                    "Apply",
                    () => {
                        this.applyFilters();
                    },
                    "applyBtn"
                )
            );

            this.setInputValues(dimensions);
        }

        return this.htmlContent;
    }

    private addSelectItem(): void {
        if (this.htmlContent) {
            const elem: HTMLDivElement = this.htmlContent.insertBefore(
                document.createElement("div"),
                this.btnGroup
            );

            elem.setAttribute("class", "radiusSelectorGroup");

            const minusButton = TabDOMUtil.createButton(
                '<i class="fa fa-minus-circle"></i>',
                (e: MouseEvent) => {
                    this.removeSelectItem(e);
                },
                "minusBtn"
            );

            elem.appendChild(minusButton);

            const dimensions: IHeatLayerToolDimensions = this.getMapObject()
                .getState()
                .getDimensions();

            this.reactiveRadiusInputs = {
                operation: this.getInputReactiveRadiusOperation(
                    dimensions.reactiveOp
                ),
                zoom: this.getInputReactiveRadiusZoom(dimensions.reactiveZoom),
                radius: this.getInputReactiveRadius(dimensions.reactiveRadius),
            };

            elem.appendChild(this.reactiveRadiusInputs.operation.create());
            elem.appendChild(this.reactiveRadiusInputs.zoom.create());
            elem.appendChild(this.reactiveRadiusInputs.radius.create());

            this.reactiveRadiusForm?.push({
                inputs: this.reactiveRadiusInputs,
                container: elem,
            });
        }
    }

    private removeSelectItem(e: MouseEvent): void {
        if (e.target) {
            const form = (<HTMLInputElement>e.target).closest(
                ".radiusSelectorGroup"
            );

            this.reactiveRadiusForm = this.reactiveRadiusForm?.filter(
                (item) => item.container !== form
            );

            form?.remove();
        }
    }

    private applyFilters(): void {
        const rules: IReactiveRadiusRules[] = [];
        if (this.reactiveRadiusForm) {
            this.reactiveRadiusForm.forEach((form) => {
                const operationName =
                    form.inputs?.operation.getValue() as string;
                const operation = this.getTool()
                    .getDefaults()
                    .getFiltersManager()
                    .getDomain(operationName);
                const zoom = form.inputs?.zoom.getValue() as string;
                const radius = form.inputs?.radius?.getValue() as string;

                if (operation && zoom && radius) {
                    rules.push({
                        operation,
                        zoom: parseInt(zoom),
                        radius: parseInt(radius),
                    });
                }
            });
        }
        this.getTool()
            .getState()
            .setReactiveRadiusRules(rules as IReactiveRadiusRules[]);

        this.getTool().render(LayerToolRenderType.STYLE);
    }

    private getReactiveRadiusContent(): HTMLDivElement {
        if (this.reactiveRadius === undefined) {
            const reactiveRadius = (this.reactiveRadius =
                document.createElement("div"));
            reactiveRadius.setAttribute("class", "radiusSelector");

            reactiveRadius.appendChild(document.createElement("hr"));

            const header = document.createElement("h2");
            header.innerText = "Reactive radius settings";
            reactiveRadius.appendChild(header);

            this.getTool()
                .getMap()
                ?.getState()
                .getLeafletMap()
                ?.on("zoomend", (e) => this.setCurrentZoom(e));
        }

        return this.reactiveRadius;
    }

    private setCurrentZoom(e?: LeafletEvent): void {
        this.inputs?.currentZoom.setValue(e?.target._zoom);
    }

    public getInputLatitude(
        dimension: IMapDomainDimension<IMapDataDomain>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    public getInputLongtitude(
        dimension: IMapDomainDimension<IMapDataDomain>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    public getInputIntensity(
        dimension: IMapDomainDimension<IMapDataDomain>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    public getInputRadius(dimension: IMapTypeDimension<number>): IMapFormInput {
        return this.getNumberInput(dimension);
    }
    public getInputGradient(
        dimension: IMapDomainDimension<IGradient>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }
    public getInputBlur(dimension: IMapTypeDimension<number>): IMapFormInput {
        return this.getNumberInput(dimension);
    }
    public getInputZoom(
        dimension: IMapDomainDimension<IZoomLevel>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    public getCurrentZoom(dimension: IMapTypeDimension<number>): IMapFormInput {
        return this.getNumberInput(dimension);
    }

    public getInputReactiveRadiusOperation(
        dimension: IMapDomainDimension<IMapFilterOperation>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }
    public getInputReactiveRadiusZoom(
        dimension: IMapTypeDimension<number>
    ): IMapFormInput {
        return this.getNumberInput(dimension);
    }
    public getInputReactiveRadius(
        dimension: IMapTypeDimension<number>
    ): IMapFormInput {
        return this.getNumberInput(dimension);
    }
}

export default HeatLayerToolMapForm;
