// Geovisto core
import {
    IMapLegend, IMapTool,
    MapLayerToolLegend,
} from "../../../../../../index.core";

import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";

/**
 * This class provides controls for management of the layer legend.
 * 
 * @author Tomas Koscielniak
 */
class MarkerLayerToolMapLegend extends MapLayerToolLegend<IMarkerLayerTool> implements IMapLegend {
    
    private htmlContent!: HTMLElement;
    
    /**
     * It creates new map Legend with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IMarkerLayerTool) {
        super(tool);
    }

    /**
     * It returns the legend.
     */
    public getContent(tool: IMapTool): HTMLElement  | undefined {
        // tab content
        const div = document.createElement('div');
        div.className = "legend";
        let category_name: string;
        const categories = tool.getState().currentDataCategories;
        const colors = ["#0006a7", "#c1c100", "#c10000"];
        try {category_name = tool?.getState().dimensions.category.value.name;}
        catch { category_name = tool?.getState().dimensions.category.domainName;}
        if (categories.length == 0) {
            div.innerHTML += '<span style="font-weight: bold;">Unknown category</span><br>';
        } else {
            div.innerHTML += '<span style="font-weight: bold;">' + category_name + '</span><br>';
        }
        div.id = "geovisto-tool-layer-marker-legend";
        for (let i = 0; i < categories.length; i++) {
            if (i > 2){
                // If there is more than 3 categories defined
                break;
            }
            div.innerHTML += '<i style="background: ' + colors[i] + '"></i><span>' + categories[i] + '</span><br>';
        }
        this.htmlContent = div;
        return this.htmlContent;
    }
}
export default MarkerLayerToolMapLegend;