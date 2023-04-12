// Geovisto core
import {
    IMapFilterOperation,
    IMapFormInput,
} from "../../../../../../index.core";

/**
 * Provides type definition for inputs for reactive radius
 * 
 * @author Vladimir Korencik
 */
type IReactiveRadiusInputs = {
    zoom: IMapFormInput;
    operation: IMapFormInput;
    radius: IMapFormInput;
};

/**
 * Provides type definition for reactive radius form
 * 
 * @author Vladimir Korencik
 */
type IReactiveRadiusForm = {
    inputs?: IReactiveRadiusInputs;
    container: HTMLDivElement;
};

/**
 * Type for input values for reactive radius
 * 
 * @author Vladimir Korencik
 */
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
