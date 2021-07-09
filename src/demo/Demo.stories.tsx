import { Meta, Story } from "@storybook/react/types-6-0";
import React, { Component } from "react";
import ReactGeovistoMap from "../react/ReactGeovistoMap";
import FlattenedMapData from "../model/data/basic/FlattenedMapData";

import SettingsTool from "../tools/settings/SettingsTool";
import FiltersTool from "../tools/filters/FiltersTool";
import BasicMapConfig from "../model/config/basic/BasicMapConfig";
import SidebarTool from "../tools/sidebar/SidebarTool";
import ToolsManager from "../model/tool/generic/ToolsManager";
import ThemesManager from "../tools/themes/model/theme/generic/ThemesManager";
import ThemesTool from "../tools/themes/ThemesTool";
import SelectionTool from "../tools/selection/SelectionTool";
import TimelineTool from "../tools/timeline/TimelineTool";
import MapLayerTool from "../tools/layers/map/MapLayerTool";
import ChoroplethLayerTool from "../tools/layers/choropleth/ChoroplethLayerTool";
import MarkerLayerTool from "../tools/layers/marker/MarkerLayerTool";
import ConnectionLayerTool from "../tools/layers/connection/ConnectionLayerTool";
import Dark1Theme from "../tools/themes/model/theme/basic/dark1/Dark1Theme";
import Dark2Theme from "../tools/themes/model/theme/basic/dark2/Dark2Theme";
import Dark3Theme from "../tools/themes/model/theme/basic/dark3/Dark3Theme";
import Light1Theme from "../tools/themes/model/theme/basic/light1/Light1Theme";
import Light2Theme from "../tools/themes/model/theme/basic/light2/Light2Theme";
import Light3Theme from "../tools/themes/model/theme/basic/light3/Light3Theme";
import FiltersManager from "../tools/filters/model/generic/FiltersManager";
import {
  EqFilterOperation,
  GreaterThanEqualFilterOperation,
  GreaterThanFilterOperation,
  LessThanFilterOperation,
  NeqFilterOperation,
  RegFilterOperation,
} from "../tools";

import "font-awesome/css/font-awesome.min.css";
import "./Demo.scss";

/* example of screen component with grid layout and card wrapper usage */

const C_ID_select_data = "leaflet-combined-map-select-data";
const C_ID_check_data = "leaflet-combined-map-check-data";
const C_ID_input_data = "leaflet-combined-map-input-data";
const C_ID_select_geo = "leaflet-combined-map-select-geo";
const C_ID_check_config = "leaflet-combined-map-check-config";
const C_ID_input_config = "leaflet-combined-map-input-config";
const C_ID_input_import = "leaflet-combined-map-input-import";
const C_ID_input_export = "leaflet-combined-map-input-export";

class Demo extends Component {

  constructor(props) {
    super(props);

    // initialize geo objects
    const jsonPolygons = require("/static/geo/country_polygons.json");
    const jsonCentroids = require("/static/geo/country_centroids.json");

    // // implicit file
    const jsonData = require("/static/data/demo1.json");

    // // implicit config
    const jsonConfig = require("/static/config/config.json");

    // reference to the rendered map
    this.map = React.createRef();

    // data and config can be changed
    this.state = {
      data: jsonData,
      config: jsonConfig,
      centroids: jsonCentroids,
      polygons: jsonPolygons,
    };
  }

  componentDidMount() {
    // ------ enable check boxes ------ //
    const enableInput = (checked, id) => {
      if (checked) {
        document.getElementById(id).removeAttribute("disabled");
      } else {
        document.getElementById(id).setAttribute("disabled", "disabled");
      }
    };

    // enable data check box
    const enableDataInput = (e) => enableInput(e.target.checked, C_ID_input_data);
    document.getElementById(C_ID_input_data).setAttribute("disabled", "disabled");
    document.getElementById(C_ID_check_data).onchange = enableDataInput;

    // enable config check box
    const enableConfigInput = (e) => enableInput(e.target.checked, C_ID_input_config);;
    document.getElementById(C_ID_input_config).setAttribute("disabled", "disabled");
    document.getElementById(C_ID_check_config).onchange = enableConfigInput;

    // ------ process files ------ //

    // process path
    const pathSubmitted = function (file, result) {
      const reader = new FileReader();
      const onLoadAction = function (e) {
        try {
          console.log(e);
          //console.log(reader.result);
          result.json = JSON.parse(reader.result);
        } catch (ex) {
          console.log("unable to read file");
          // TODO: notify user
        }
      };
      reader.onload = onLoadAction;
      reader.readAsText(file);
    };

    // process data path
    const data = {
      json: undefined,
    };
    const dataPathSubmitted = function (e) {
      console.log(this.files);
      pathSubmitted(this.files[0], data);
    };
    document.getElementById(C_ID_input_data).addEventListener("change", dataPathSubmitted, false);

    // process config path
    const config = {
      json: undefined,
    };
    const configPathSubmitted = function (e) {
      console.log(this.files);
      pathSubmitted(this.files[0], config);
    };
    document.getElementById(C_ID_input_config).addEventListener("change", configPathSubmitted, false);

    // ------ import ------ //

    // import action
    const importAction = () => {
      // process data json
      if (!document.getElementById(C_ID_check_data).checked || data.json == undefined) {
        const fileName = document.getElementById(C_ID_select_data).value;
        data.json = require("/static/data/" + fileName);
      }

      const geoType = document.getElementById(C_ID_select_geo).value;
      const polygonsFileName = geoType === "czech_districts" ? "czech_districts_polygons" : "country_polygons";
      const centroidsFileName = geoType === "czech_districts" ? "czech_districts_centroids" : "country_centroids";
      const polygons = require("/static/geo/" + polygonsFileName + ".json");
      const centroids = require("/static/geo/" + centroidsFileName + ".json");
      console.log("POLYG", polygonsFileName);

      // process config json
      if (!document.getElementById(C_ID_check_config).checked || config.json == undefined) {
        config.json = require("/static/config/config.json");
      }

      // update state
      this.setState({
        data: data.json,
        config: config.json,
        polygons,
        centroids,
      });
    };
    document.getElementById(C_ID_input_import).addEventListener("click", importAction);

    // ------ export ------ //

    // export action
    const exportAction = () => {
      // expert map configuration
      const config = JSON.stringify(this.map.current.getMap().export(), null, 2);

      // download file
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(config));
      element.setAttribute("download", "config.json");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      console.log("rendered map:");
    };
    document.getElementById(C_ID_input_export).addEventListener("click", exportAction);
  }

  render() {
    console.log("rendering...");
    return (
      <div className="demo-container">

        <div className="demo-toolbar">
          <span>Data file: </span>
          <select id={C_ID_select_data}>
            <option value="demo1.json">demo1.json</option>
            <option value="demo2.json">demo2.json</option>
            <option value="timeData.json">timeData.json</option>
            <option value="covidCzechDistricts.json">covid czech districts</option>
            <option value="covidCzechDistrictsCumulative.json">covid czech districts (cumulative)</option>
            <option value="ovidCzechDistrictsCategoric.json">covid czech districts (categoric)</option>
            <option disabled></option>
          </select>

          <span> or <input id={C_ID_check_data} type="checkbox" /> custom file: </span>
          <input id={C_ID_input_data} type="file" accept=".json" size="3" />

          <span>Geo file: </span>
          <select id={C_ID_select_geo}>
            <option value="world">World</option>
            <option value="czech_districts">czech districts</option>
            <option disabled></option>
          </select> |

          <input id={C_ID_check_config} type="checkbox" />
          <span> Configuration file: </span>
          <input id={C_ID_input_config} type="file" accept=".json" size="3" />

          <input id={C_ID_input_import} type="submit" value="import" />
          <input id={C_ID_input_export} type="submit" value="export" />
        </div>
        <div className="demo-map">
          <ReactGeovistoMap
            ref={this.map}
            id="my-geovisto-map"
            polygons={this.state.polygons}
            centroids={this.state.centroids}
            data={new FlattenedMapData(this.state.data)}
            config={new BasicMapConfig(this.state.config)}
            globals={undefined}
            tools={new ToolsManager([
              new SidebarTool({ id: "geovisto-tool-sidebar" }),
              new SettingsTool({ id: "geovisto-tool-settings" }),
              new FiltersTool({
                // filter operations
                id: "geovisto-tool-filters",
                manager: new FiltersManager([
                  new EqFilterOperation(),
                  new NeqFilterOperation(),
                  new RegFilterOperation(),
                  new LessThanFilterOperation(),
                  new GreaterThanEqualFilterOperation(),
                  new GreaterThanFilterOperation(),
                ]),
              }),
              new ThemesTool({
                // style themes
                id: "geovisto-tool-themes",
                manager: new ThemesManager([
                  new Light1Theme(),
                  new Light2Theme(),
                  new Light3Theme(),
                  new Dark1Theme(),
                  new Dark2Theme(),
                  new Dark3Theme(),
                ]),
              }),
              new SelectionTool({ id: "geovisto-tool-selection" }),
              new MapLayerTool({ id: "geovisto-tool-layer-map" }),
              new ChoroplethLayerTool({ id: "geovisto-tool-layer-choropleth" }),
              new MarkerLayerTool({ id: "geovisto-tool-layer-marker" }),
              new ConnectionLayerTool({ id: "geovisto-tool-layer-connection" }),
              new TimelineTool({ id: "geovisto-tool-timeline" }),
            ])}
          />
        </div>
      </div>
    );
  }
}

export default {
  title: "Demo",
  component: Demo,
} as Meta;

export const GeovistoMap: Story = () => <Demo />;

