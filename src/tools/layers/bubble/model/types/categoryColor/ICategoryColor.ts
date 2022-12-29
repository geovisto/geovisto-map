import { IMapFilterOperation, IMapFormInput } from "../../../../../../index.core";

type ICategoryColorInputs = {
    operation: IMapFormInput;
    value: IMapFormInput;
    color: IMapFormInput;
};

type ICategoryColorForm = {
    inputs?: ICategoryColorInputs;
    container: HTMLDivElement;
};

type ICategoryColorRules = {
    operation?: IMapFilterOperation;
    value?: string;
    color?: string;
};

export type { ICategoryColorInputs, ICategoryColorForm, ICategoryColorRules };
