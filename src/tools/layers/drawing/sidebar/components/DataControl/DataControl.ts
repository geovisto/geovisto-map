import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import { MappingModel } from "../../../model/types/tool/IDrawingLayerToolDefaults";
import { createButton } from "../../../util/inputs";
import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";
import DataControlState from "./DataControlState";
import { TDataControlState } from "./types";

class DataControl extends AbstractControl {
  public state: TDataControlState;

  public constructor(props: ControlProps) {
    super();

    this.state = new DataControlState({
      tabControl: props.tabControl,
      control: this,
    });
  }

  // ************************* Data Inputs ***************************************

  /**
   * creates a field for picking column name where to choose identifier from
   */
  public createPickIdentifier = (model: MappingModel): IMapFormInput => {
    const { data } = this.state;

    const idOpts = data[0]
      ? Object.keys(data[0]).map((k) => ({ value: k, label: k }))
      : [];

    const result = model.idKey.input({
      ...model.idKey.props,
      onChangeAction: this.state.changeWhichIdUseAction,
      options: [{ value: "", label: "" }, ...idOpts],
    });

    return result;
  };

  /**
   * creates a field for identier input
   */
  public createIdentifierInput = (model: MappingModel): IMapFormInput => {
    const { data } = this.state;

    const idKey = this.state.getIdentifierType();

    let idOpts = data && data[0][idKey] ? data.map((d) => d[idKey]) : [];
    idOpts = Array.from(new Set(idOpts));

    const result = model.identifier.input({
      ...model.identifier.props,
      onChangeAction: (e: Event) =>
        this.state.changeIdentifierAction((e.target as HTMLInputElement).value),
      options: idOpts,
      placeholder: "e.g. CZ",
    });

    return result;
  };

  public renderDataInputs = (
    elem: HTMLDivElement,
    model: MappingModel
  ): void => {
    const disableTextFields = !this.state._getSelected();
    // Select Pick Identifier
    const inputPickIdentifier = this.createPickIdentifier(model);
    elem.appendChild(inputPickIdentifier.create() as Node);
    inputPickIdentifier.setDisabled(disableTextFields);
    inputPickIdentifier.setValue(this.state.getIdentifierType());
    // textfield Identifier
    const inputId = this.createIdentifierInput(model);
    elem.appendChild(inputId.create() as Node);
    inputId.setDisabled(disableTextFields);
    inputId.setValue(this.state._getSelected()?.identifier || "");
    // textarea Description
    const inputDesc = model.description.input({
      ...model.description.props,
      onChangeAction: this.state.changeDescriptionAction,
    });
    elem.appendChild(inputDesc.create() as Node);
    inputDesc.setValue(
      DataControl.convertDescfromPopText(
        (this.state._getSelected()?.getPopup()?.getContent() || "") as string
      )
    );
    inputDesc.setDisabled(disableTextFields);
  };

  // ************************* Data Inputs END ***************************************

  /**
   * for linebreak in poup text we use '<br>' tag
   */
  public static convertDescToPopText = (descText: string): string => {
    if (!descText) return "";
    return descText.replaceAll("\n", "<br />");
  };

  /**
   * for linebreak in field we use '\n' character
   */
  public static convertDescfromPopText = (popText: string): string => {
    if (!popText) return "";
    return popText.replaceAll("<br />", "\n");
  };

  // ************************* Filter Inputs ***************************************

  private setDataKey = (e: InputEvent, index: number): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.state.setFiltersKey(index, val);
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  private setDataValue = (e: InputEvent, index: number): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.state.setFiltersValue(index, val);
    this.state.callIdentifierChange();
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  /**
   * creates the filter fields
   */
  public renderDataFilters = (
    elem: HTMLDivElement,
    model: MappingModel
  ): void => {
    const { data } = this.state;

    const idOpts = data[0]
      ? Object.keys(data[0]).map((k) => ({ value: k, label: k }))
      : [];

    for (let index = 0; index < this.state.filtersAmount; index++) {
      const filtersKey = this.state.getFiltersKey(index);
      // * input for key
      const inputKey = model.dataFilterKey.input({
        ...model.dataFilterKey.props,
        onChangeAction: (e: InputEvent) => this.setDataKey(e, index),
        options: [{ value: "", label: "" }, ...idOpts],
      });

      // ***********************************************************
      let valueOpts =
        data && data[0][filtersKey] ? data.map((d) => d[filtersKey]) : [];
      valueOpts = Array.from(new Set(valueOpts));
      // * input for value
      const inputValue = model.dataFilterValue.input({
        ...model.dataFilterValue.props,
        onChangeAction: (e: InputEvent) => this.setDataValue(e, index),
        options: ["", ...valueOpts],
      });

      // * append elements
      elem.appendChild(document.createElement("hr"));
      elem.appendChild(inputKey.create() as Node);
      elem.appendChild(inputValue.create() as Node);

      inputKey.setValue(filtersKey);
      inputValue.setValue(this.state.getFiltersValue(index));
    }
  };

  private addFilter = (): void => {
    this.state.increaseFilters();
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  private removeFilter = (): void => {
    this.state.decreaseFilters();
    this.state.callIdentifierChange();
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  /**
   * creates the buttons for adding/removing buttons
   */
  public renderFilterInputs = (elem: HTMLDivElement): void => {
    const disabled = !this.state._getSelected();

    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    const addFilterBtn = createButton("Add Filter", this.addFilter, disabled);
    const removeFilterBtn = createButton(
      "Remove Filter",
      this.removeFilter,
      disabled
    );
    wrapper.appendChild(addFilterBtn);
    wrapper.appendChild(removeFilterBtn);
    elem.appendChild(wrapper);
  };

  // ************************* Filter Inputs END ***************************************
}

export default DataControl;
