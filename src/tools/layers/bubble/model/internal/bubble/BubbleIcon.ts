import * as d3 from "d3";
import { arc } from "d3";
import L from "leaflet";
import { IBubbleIconOptions } from "../../types/bubble/IBubbleIcon";

const BubbleIcon: (new (options?: IBubbleIconOptions) => L.DivIcon) &
    typeof L.Class = L.DivIcon.extend({
    options: {
        className: "div-country-icon",
        isGroup: false,
    },

    createIcon: function (oldIcon: HTMLElement) {
        const div =
                oldIcon && oldIcon.tagName === "DIV"
                    ? oldIcon
                    : document.createElement("div"),
            options = this.options;

        const range = options.bubbleSize
            ? [10 + options.bubbleSize * 3, 80 + options.bubbleSize * 3]
            : [10, 80];

        const scale = d3.scaleSqrt().domain([0, options.max]).range(range);

        let size = scale(options.values.value);

        const zoom = options.map().getState().getLeafletMap()._zoom;
        size = (size * zoom) / 4;

        options.iconSize = [size, size];
        options.iconAnchor = [size / 2, size / 2];
        const divContent = div.appendChild(document.createElement("div"));

        const element = d3.select(divContent);
        const svg = element.append("svg");
        svg.attr("width", size).attr("height", size);

        if (options.values.value != null && options.values.value !== 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pie = d3.pie().value((d: any) => {
                return d[1];
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const values_ready = pie(Object.entries(options.values.subvalues) as any);
            const colors = options.values.colors;

            const d3arc = arc<d3.PieArcDatum<number | { valueOf(): number }>>();

            // pie chart
            svg
                .append("g")
                .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")
                .selectAll("abc")
                .data(values_ready)
                .enter()
                .append("path")
                .attr("d", d3arc.innerRadius(0).outerRadius(size / 2))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr("fill", (d: any) => {
                    const key = d.data[0];
                    if (colors && colors[key]) {
                        return colors[key];
                    }
                    return options.bubbleColor ?? "red";
                })
                .attr("opacity", 0.5)
                .append("title")
                .text(options.values.value);
        }
        this._setIconStyles(div, "icon");

        return div;
    },
});

export default BubbleIcon;
