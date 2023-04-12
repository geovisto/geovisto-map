// Geovisto core
import {
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapFilterOperation,
    IMapForm,
    IMapFormInput,
    IMapTypeDimension,
    LayerToolRenderType,
    MapLayerToolForm,
    TabDOMUtil,
} from "../../../../../../index.core";

// Internal
import {
    ICategoryColorForm,
    ICategoryColorInputs,
    ICategoryColorRules,
} from "../../types/categoryColor/ICategoryColor";
import ISpikeLayerTool from "../../types/tool/ISpikeLayerTool";
import ISpikeLayerToolDimensions from "../../types/tool/ISpikeLayerToolDimensions";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Vladimir Korencik
 */
class SpikeLayerToolMapForm
    extends MapLayerToolForm<ISpikeLayerTool>
    implements IMapForm {
    private htmlContent!: HTMLDivElement;
    private tool: ISpikeLayerTool;
    private btnGroup: HTMLDivElement | null;
    private categoryColor!: HTMLDivElement;

    private inputs?: {
        latitude: IMapFormInput;
        longitude: IMapFormInput;
        category: IMapFormInput;
        value: IMapFormInput;
        aggregation: IMapFormInput;
        color: IMapFormInput;
    };

    private categoryColorInputs?: ICategoryColorInputs;
    private categoryColorForm?: ICategoryColorForm[];

    public constructor(tool: ISpikeLayerTool) {
        super(tool);
        this.btnGroup = null;
        this.tool = tool;

        this.categoryColorForm = [];
    }

    public getTool(): ISpikeLayerTool {
        return this.tool;
    }

    public setInputValues(dimensions: ISpikeLayerToolDimensions): void {
        this.inputs?.latitude.setValue(
            dimensions.latitude.getValue()?.getName() ?? ""
        );
        this.inputs?.longitude.setValue(
            dimensions.longitude.getValue()?.getName() ?? ""
        );
        this.inputs?.category.setValue(
            dimensions.category.getValue()?.getName() ?? ""
        );
        this.inputs?.value.setValue(dimensions.value.getValue()?.getName() ?? "");
        this.inputs?.aggregation.setValue(
            dimensions.aggregation.getValue()?.getName() ?? ""
        );
        this.inputs?.color.setValue(dimensions.color.getValue() ?? "");
        this.categoryColorInputs?.operation.setValue(
            dimensions.categoryColorOp.getValue() ?? ""
        );
        this.categoryColorInputs?.value.setValue(
            dimensions.categoryColorValue.getValue() ?? ""
        );
        this.categoryColorInputs?.color.setValue(
            dimensions.categoryColor.getValue() ?? ""
        );
    }

    public getContent(): HTMLDivElement {
        if (this.htmlContent === undefined) {
            this.htmlContent = document.createElement("div");
            const elem = this.htmlContent.appendChild(document.createElement("div"));

            const dimensions: ISpikeLayerToolDimensions = this.getMapObject()
                .getState()
                .getDimensions();

            this.inputs = {
                latitude: this.getInputLatitude(dimensions.latitude),
                longitude: this.getInputLongtitude(dimensions.longitude),
                category: this.getInputCategory(dimensions.category),
                value: this.getInputValue(dimensions.value),
                aggregation: this.getInputAggregation(dimensions.aggregation),
                color: this.getInputColor(dimensions.color),
            };

            elem.appendChild(this.inputs.latitude.create());
            elem.appendChild(this.inputs.longitude.create());
            elem.appendChild(this.inputs.category.create());
            elem.appendChild(this.inputs.value.create());
            elem.appendChild(this.inputs.aggregation.create());
            elem.appendChild(this.inputs.color.create());

            elem.appendChild(this.getCategoryColorContent());

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
            elem.setAttribute("class", "categoryClassesGroup");

            const minusButton = TabDOMUtil.createButton(
                '<i class="fa fa-minus-circle"></i>',
                (e: MouseEvent) => {
                    this.removeSelectItem(e);
                },
                "minusBtn"
            );

            elem.appendChild(minusButton);

            const dimensions: ISpikeLayerToolDimensions = this.getMapObject()
                .getState()
                .getDimensions();

            this.categoryColorInputs = {
                operation: this.getInputCategoryColorOperation(
                    dimensions.categoryColorOp
                ),
                value: this.getInputCategoryColorValue(dimensions.categoryColorValue),
                color: this.getInputCategoryColor(dimensions.categoryColor),
            };

            elem.appendChild(this.categoryColorInputs.operation.create());
            elem.appendChild(this.categoryColorInputs.value.create());
            elem.appendChild(this.categoryColorInputs.color.create());

            this.categoryColorForm?.push({
                inputs: this.categoryColorInputs,
                container: elem,
            });
        }
    }

    private removeSelectItem(e: MouseEvent): void {
        if (e.target) {
            const form = (<HTMLInputElement>e.target).closest(
                ".categoryClassesGroup"
            );

            this.categoryColorForm = this.categoryColorForm?.filter(
                (item) => item.container !== form
            );

            form?.remove();
        }
    }

    private applyFilters(): void {
        const rules: ICategoryColorRules[] = [];
        if (this.categoryColorForm) {
            this.categoryColorForm.forEach((form) => {
                const operationName = form.inputs?.operation.getValue() as string;
                const operation = this.getTool().getDefaults()
                    .getFiltersManager()
                    .getDomain(operationName);
                const value = form.inputs?.value.getValue() as string;
                const color = form.inputs?.color?.getValue() as string;

                if (operation && value && color) {
                    rules.push({
                        operation,
                        value: value,
                        color: color,
                    });
                }
            });
        }
        this.getTool()
            .getState()
            .setCategoryColorRules(rules as ICategoryColorRules[]);

        this.getTool().render(LayerToolRenderType.DATA);
    }

    private getCategoryColorContent(): HTMLDivElement {
        if (this.categoryColor === undefined) {
            const categoryColor = (this.categoryColor =
                document.createElement("div"));
            categoryColor.setAttribute("class", "categoryClasses");

            categoryColor.appendChild(document.createElement("hr"));

            const header = document.createElement("h2");
            header.innerText = "Category colors";
            categoryColor.appendChild(header);
        }

        this.btnGroup = this.htmlContent.appendChild(document.createElement("div"));

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

        return this.categoryColor;
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

    public getInputCategory(
        dimension: IMapDomainDimension<IMapDataDomain>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    public getInputValue(
        dimension: IMapDomainDimension<IMapDataDomain>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    public getInputAggregation(
        dimension: IMapDomainDimension<IMapAggregationFunction>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    public getInputColor(dimension: IMapTypeDimension<string>): IMapFormInput {
        return this.getColorInput(dimension);
    }

    public getInputCategoryColorOperation(
        dimension: IMapDomainDimension<IMapFilterOperation>
    ): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }
    public getInputCategoryColorValue(
        dimension: IMapTypeDimension<string>
    ): IMapFormInput {
        return this.getTextInput(dimension);
    }
    public getInputCategoryColor(
        dimension: IMapTypeDimension<string>
    ): IMapFormInput {
        return this.getColorInput(dimension);
    }
}

export default SpikeLayerToolMapForm;
