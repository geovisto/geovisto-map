// Geovisto core
import {
    IMapLegend,
    IMapTool,
    MapLayerToolLegend
} from "../../../../../../index.core";

import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolState from "../../types/tool/IChoroplethLayerToolState";

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
    public getContent(tool: IChoroplethLayerTool): HTMLElement | undefined {
        const div = document.createElement('div');
        div.className = "legend";
        // Get scale
        const scale = tool?.getState().mapObject.getScale();
        if (scale[0] == undefined) {
            // If legend is already created
            if (this.htmlContent != undefined) {
                div.id = "geovisto-tool-layer-choropleth-legend";
                div.innerHTML += '<span style="font-weight: bold;">Unknown values</span><br>';
                this.htmlContent = div;
                return this.htmlContent;
            }
            // No available scales - dont create legend
            return undefined;
        }
        // Get colors
        const color_opacities: Array<number> = [];
        const color = tool?.getState().getDimensions().color.getValue();
        // Compute color intensity
        for (let i = 0; i < scale.length; i++) {
            color_opacities.push(tool?.getState().mapObject.computeColorIntensity(scale[i], scale));
        }
        // Shift the array
        color_opacities.push(color_opacities.shift());
        // Separate thousands for numerical ranges
        const separateThousands = (num: number): string => {
            const numParts = num.toString().split(".");
            numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return numParts.join(".");
        };
        // Conver values to string
        const categories = scale;
        const opacities = color_opacities.map(String);
        // Check if rounding is set
        if (tool.getState().getDimensions().round.getValue() != undefined) {
            for (let i = 0; i < categories.length; i++) {
                categories[i] = tool.roundValues(categories[i], <number>tool.getState().getDimensions().round.getValue());
            }
        }
        for (let i = 0; i < scale.length; i++) {
            categories[i] = separateThousands(categories[i]);
        }
        div.id = "geovisto-tool-layer-choropleth-legend";
        let units = tool.getState().getDimensions().units.getValue();
        if (tool.getState().getDimensions().unitsEnabled.getValue() == false) {
            units = "";
        }
        // Create categories
        for (let i = 0; i < categories.length; i++) {
            if (categories.length == i + 1) {
                div.innerHTML += '<i style="opacity: ' + opacities[i] +
                    '; background: ' + color + '"></i><span>' + categories[i] + ' - ' + categories[i] + ' ' +
                    units + '</span><br>';
            } else {
                div.innerHTML += '<i style="opacity: ' + opacities[i] +
                    '; background: ' + color + '"></i><span>' + categories[i] + ' - ' + categories[i+1] + ' ' +
                    units + '</span><br>';
            }
        }
        // Check if longer units are available and allowed
        if(tool.getState().getDimensions().unitsDesc.getValue() != "" && tool.getState().getDimensions().unitsEnabled.getValue() == true) {
            div.innerHTML += "<span>Units: " + tool.getState().getDimensions().unitsDesc.getValue() + "</span>";
        }
        this.htmlContent = div;
        return this.htmlContent;
    }
}
export default ChoroplethLayerToolMapLegend;