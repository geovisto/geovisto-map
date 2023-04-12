// Leaflet
import { ColorGradientConfig } from "leaflet";

// Geovisto core
import { MapDomain } from "../../../../../../index.core";

// types
import {
    IGradient,
    IGradientType,
    Gradients,
} from "../../types/gradient/IGradient";

const GRADIENT_DEFAULT = {
    0.4: "#0000FF",
    0.6: "#00FFFF",
    0.7: "#00FF00",
    0.8: "#FFFF00",
    0.9: "#FF0000",
};

const GRADIENT_PROTANO_DEUTRAN_A = {
    0.4: "#00B9F1",
    0.6: "#00A875",
    0.7: "#ECDE38",
    0.8: "#F7931D",
    0.9: "#F15A22",
};

const GRADIENT_PROTAN_DEUTRAN_B = {
    0.4: "#7CB3F5",
    0.6: "#648FFF",
    0.7: "#DCC112",
    0.8: "#A97821",
    0.9: "#5F320C",
};

const GRADIENT_TRITAN = {
    0.4: "#00e6e6",
    0.6: "#009999",
    0.7: "#C38D87",
    0.8: "#FF0000",
    0.9: "#660004",
};

const GRADIENT_MONOCHROMATIC = {
    0.4: "#BDBDBD",
    0.6: "#888888",
    0.7: "#565656",
    0.8: "#353535",
    0.9: "#000000",
};

const GRADIENTS: IGradientType[] = [
    { name: Gradients.DEFAULT, values: GRADIENT_DEFAULT },
    { name: Gradients.PROTANO_DEUTRAN_A, values: GRADIENT_PROTANO_DEUTRAN_A },
    { name: Gradients.PROTANO_DEUTRAN_B, values: GRADIENT_PROTAN_DEUTRAN_B },
    { name: Gradients.TRITAN, values: GRADIENT_TRITAN },
    { name: Gradients.MONOCHROMATIC, values: GRADIENT_MONOCHROMATIC },
];

/**
 *  This class provides functions for using different color gradient in the heatmap form input.
 * 
 * @author Vladimir Korencik
 */
class Gradient extends MapDomain implements IGradient {
    private gradient: Gradients;

    public constructor(gradient: Gradients) {
        super(Gradient.TYPE(gradient));

        this.gradient = gradient;
    }

    public static TYPE(gradient: Gradients): string {
        return (
            GRADIENTS.find((grad) => grad.name === gradient)?.name ??
            GRADIENTS[0].name
        );
    }

    public getGradient(): ColorGradientConfig {
        return (
            GRADIENTS.find((grad) => grad.name === this.gradient)?.values ??
            GRADIENTS[0].values
        );
    }
}

export default Gradient;
