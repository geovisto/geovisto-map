// Geovisto core
import { IMapFilterOperation, IMapFormInput } from "../../../../../../index.core";

/**
 * Provides type definition for inputs for category colors
 * 
 * @author Vladimir Korencik
 */
type ICategoryColorInputs = {
    operation: IMapFormInput;
    value: IMapFormInput;
    color: IMapFormInput;
};

/**
 * Provides type definition for category colors form
 * 
 * @author Vladimir Korencik
 */
type ICategoryColorForm = {
    inputs?: ICategoryColorInputs;
    container: HTMLDivElement;
};

/**
 * Type for input values for category colors
 * 
 * @author Vladimir Korencik
 */
type ICategoryColorRules = {
    operation?: IMapFilterOperation;
    value?: string;
    color?: string;
};

export type { ICategoryColorInputs, ICategoryColorForm, ICategoryColorRules };
