import AbstractFormInput from "../text/TextFormInput";
import ISelectFormInputProps from "../../../../types/inputs/basic/select/ISelectFormInputProps";

const ID = "geovisto-input-select";

/**
 * This class represents a basic select form input composed of options.
 * 
 * @author Jiri Hynek
 */
class SelectFormInput extends AbstractFormInput {
    
    /**
     * the input element is initialized when required
     */
    private element: HTMLSelectElement | undefined;

    constructor(props: ISelectFormInputProps) {
        super(props);
    }
    
    /**
     * Static function returns identifier of the input type
     */
    public static ID(): string {
        return ID;
    }

    /**
     * It returns select element.
     */
    public create(): HTMLElement {
        if(this.element == undefined) {
            let props = (<ISelectFormInputProps> this.getProps());
            // create select element
            this.element = document.createElement('select');
            this.element.onchange = props.onChangeAction;
            // append options
            let option: HTMLOptionElement;
            let options: string[] = props.options;
            for(let i = 0; i < options.length; i++) {
                option = this.element.appendChild(document.createElement("option"));
                option.setAttribute("value", options[i]);
                option.innerHTML = options[i];
            }
        }
        return this.element;
    }

    /**
     * It returns value of the select element.
     */
    public getValue(): string {
        return this.element ? this.element.value : "";
    }

    /**
     * It sets value of the select element.
     * 
     * @param {string} value 
     */
    public setValue(value: string): void {
        if(this.element) {
            this.element.value = value;
        }
    }
}
export default SelectFormInput;