const ID = 'geovisto-timeline-slider';
const CLASSNAME = 'slider';
const enum SLIDER_COLORS {
    BG = '#fff',
    BG_PLAYED= '#cde5f6',
}


interface ISliderProps {
    onChange: (event: Event) => void;
    min: string;
    max: string;
    value: string;
}

class Slider {
    private container?: HTMLDivElement;
    private slider?: HTMLInputElement;
    private props: ISliderProps;

    public constructor(props: ISliderProps) {
        this.props = props;
    }

    public static ID(): string {
        return ID;
    }


    public create(): HTMLElement {
        const {min, max, onChange, value} = this.props;

        if (this.container === undefined) {
            // create input element
            this.container = document.createElement('div');
            this.container.className = 'slider-container';

            this.slider = document.createElement('input');    
            // set props
            this.slider.type = 'range';
            this.slider.onchange = (event) => {onChange(event); this.fillLower();};
            this.slider.max = max;
            this.slider.min = min;
            this.slider.value = value;
            this.slider.className = CLASSNAME;
            this.container.id = ID;    

            this.container.appendChild(this.slider);
            this.fillLower();    
        }

     
        return this.container;

    }

    public getValue(): string {
        return this.slider ? this.slider.value : ""; 
    }

    public getMax(): string {
        return this.slider ? this.slider.max : ""; 
    }

    public getMin(): string {
        return this.slider ? this.slider.min : ""; 
    }

    public setValue(value: string): void {
        if(this.slider) {           
            this.slider.value = value;
        }
    }

    public triggerChange(): void {
        const changeEvent = new Event("change");
        if (this.slider) {
            this.slider.dispatchEvent(changeEvent);
      
        }
    }


    public fillLower(): void {
        const percentage = 100 * (parseFloat(this.getValue()) - parseFloat(this.props.min)) / (parseFloat(this.props.max) - parseFloat(this.props.min));
        const bg = `linear-gradient(90deg, ${SLIDER_COLORS.BG_PLAYED} ${percentage}%, ${SLIDER_COLORS.BG} ${percentage+0.1}%)`;

        if (this.slider) {
            this.slider.style.background = bg;
        }
    }
}

export default Slider;