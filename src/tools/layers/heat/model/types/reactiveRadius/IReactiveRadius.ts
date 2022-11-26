import {
    IMapFilterOperation,
    IMapFormInput,
} from "../../../../../../index.core";

type IReactiveRadiusInputs = {
    zoom: IMapFormInput;
    operation: IMapFormInput;
    radius: IMapFormInput;
};

type IReactiveRadiusForm = {
    inputs?: IReactiveRadiusInputs;
    container: HTMLDivElement;
};

type IReactiveRadiusRules = {
    operation?: IMapFilterOperation;
    zoom?: number;
    radius?: number;
};

export type {
    IReactiveRadiusInputs,
    IReactiveRadiusForm,
    IReactiveRadiusRules,
};
