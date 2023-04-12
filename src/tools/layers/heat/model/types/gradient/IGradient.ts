// Leaflet
import { ColorGradientConfig } from "leaflet";

// Geovisto core
import { IMapDomain } from "../../../../../../index.core";

enum Gradients {
    DEFAULT = "Default",
    PROTANO_DEUTRAN_A = "Protanopia/Deuteranopia A",
    PROTANO_DEUTRAN_B = "Protanopia/Deuteranopia B",
    TRITAN = "Tritanopia",
    MONOCHROMATIC = "Monochromatic",
}

/**
 * Defines type for gradient
 * 
 * @author Vladimir Korencik
 */
type IGradientType = {
    name: Gradients;
    values: ColorGradientConfig;
};

/**
 * This intreface describes methods for working with gradients.
 * 
 * @author Vladimir Korencik
 */
interface IGradient extends IMapDomain {
    /**
     * Returns gradient config
     */
    getGradient(): ColorGradientConfig;
}

export { Gradients };
export type { IGradient, IGradientType };
