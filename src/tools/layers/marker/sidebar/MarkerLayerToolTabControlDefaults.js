import AbstractLayerToolTabControlDefaults from "../../abstract/sidebar/AbstractLayerToolTabControlDefaults";


/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolTabControlDefaults extends AbstractLayerToolTabControlDefaults {

    /**
     * It creates tab control defaults.
     */
    constructor() {
        super();
    }

    /**
     * It returns the icon of the tab pane.
     */
    getIcon() {
        return '<i class="fa fa-map-marker"></i>';
    }
}
export default MarkerLayerToolTabControlDefaults;