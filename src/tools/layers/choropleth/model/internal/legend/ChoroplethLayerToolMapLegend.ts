// Geovisto core
import {
    IMapLegend,
    IMapTool,
    MapLayerToolLegend
} from "../../../../../../index.core";

import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";

/**
 * This class provides controls for management of the layer legend.
 *
 * @author Tomas Koscielniak
 */
class ChoroplethLayerToolMapLegend extends MapLayerToolLegend<IChoroplethLayerTool> implements IMapLegend {

    private htmlContent!: HTMLElement;

    /**
     * It creates new map Legend with respect to the given props.
     *
     * @param tool
     */
    public constructor(tool: IChoroplethLayerTool) {
        super(tool);
    }

    /**
     * It returns the legend.
     */
    public getContent(tool: IMapTool): HTMLElement | undefined {
        const div = document.createElement('div');
        div.className = "legend";
        const scale = tool?.getState().mapObject.getScale();
        if (scale[0] == undefined) {
            // No available scales - dont create legend
            return undefined;
        }
        const color_opacities: Array<number> = [];
        const color = tool?.getState().dimensions.color.getValue();
        for (let i = 0; i < scale.length; i++) {
            color_opacities.push(tool?.getState().mapObject.computeColorIntensity(scale[i], scale));
        }
        color_opacities.push(color_opacities.shift());
        const categories = scale.map(String);
        const opacities = color_opacities.map(String);
        div.id = "geovisto-tool-layer-choropleth-legend";
        for (let i = 0; i < categories.length; i++) {
            if (categories.length == i + 1) {
                div.innerHTML += '<i style="opacity: ' + opacities[i] +
                    '; background: ' + color + '"></i><span>' + categories[i] + ' - ' + categories[i] + '</span><br>';
            } else {
                div.innerHTML += '<i style="opacity: ' + opacities[i] +
                    '; background: ' + color + '"></i><span>' + categories[i] + ' - ' + categories[i+1] + '</span><br>';
            }
        }
        this.htmlContent = div;
        return this.htmlContent;
    }
}
export default ChoroplethLayerToolMapLegend;