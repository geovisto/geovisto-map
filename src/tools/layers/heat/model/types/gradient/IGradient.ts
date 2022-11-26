import { ColorGradientConfig } from "leaflet";
import { IMapDomain } from "../../../../../../index.core";

enum Gradients {
    DEFAULT = "Default",
    PROTANO_DEUTRAN_A = "Protanopia/Deuteranopia A",
    PROTANO_DEUTRAN_B = "Protanopia/Deuteranopia B",
    TRITAN = "Tritanopia",
    MONOCHROMATIC = "Monochromatic",
}

type IGradientType = {
    name: Gradients;
    values: ColorGradientConfig;
};

interface IGradient extends IMapDomain {
    getGradient(): ColorGradientConfig;
}

export { Gradients };
export type { IGradient, IGradientType };
