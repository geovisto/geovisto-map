// d3
import * as d3 from "d3";

// Leaflet
import L from "leaflet";

import { ISpikeIconOptions } from "../../types/icon/ISpikeIcon";

/**
 * Provides creation of spike icon 
 * 
 * @author Vladimir Korencik
 * @author Petr Kaspar
 */
const SpikeIcon: new (options?: ISpikeIconOptions) => L.DivIcon =
    L.DivIcon.extend({
        options: {
            className: "div-spike-icon",
        },

        createIcon: function () {
            const div = document.createElement("div");

            const divContent = div.appendChild(document.createElement("div"));
            const svg = d3.select(divContent).append("svg");

            const height = this.options.height;
            const width = this.options.width;
            svg.attr("width", width);
            svg.attr("height", height);
            svg
                .append("g")
                .attr("fill", this.options.color ?? "red")
                .attr("stroke", this.options.color ?? "red")
                .attr("transform", `translate(0,${height})`)
                .append("path")
                .attr("d", `M 0 0 L${width / 2} -${height} L ${width} 0`)
                .append("title")
                .text(this.options.value);

            this._setIconStyles(div, "icon");
            return div;
        },
    });

export default SpikeIcon;
