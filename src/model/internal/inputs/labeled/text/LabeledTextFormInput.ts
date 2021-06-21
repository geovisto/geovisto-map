import ILabeledMapFormInputProps from "../../../../types/inputs/labeled/text/ILabeledTextFormInputProps";
import IMapFormInput from "../../../../types/inputs/IMapFormInput";
import TextFormInput from "../../basic/text/TextFormInput";

const ID = "geovisto-input-text-labeled";

/**
 * This class represents labeled text form input.
 * 
 * @author Jiri Hynek
 */
class LabeledTextFormInput extends TextFormInput implements IMapFormInput {
    
    /**
     * The input element is created when required.
     */
    private div?: HTMLDivElement;

    public constructor(props: ILabeledMapFormInputProps) {
        super(props);
        
        this.div = undefined;
    }

    /**
     * Static function returns identifier of the input type.
     */
    public static ID(): string {
        return ID;
    }

    /**
     * It returns input element.
     */
    public create(): HTMLElement {
        if(this.div == undefined) {
            // create input element
            const input: HTMLElement = super.create();

            // create div block
            this.div = document.createElement("div");

            // append label
            const props = <ILabeledMapFormInputProps> this.getProps();
            if(props.label) {
                this.div.appendChild(document.createTextNode(props.label + ": "));
            }

            // append input element
            this.div.appendChild(input);
        }
        
        return this.div;
    }

}
export default LabeledTextFormInput;