import { TSearchControlState } from "./types";
import { AllGeoJSON, Feature, Geometry } from "@turf/turf";
import { LooseObject, DrawnObject } from "./../../../model/types/index";
import { ControlStateProps } from "./../AbstractControl/types";
import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import osmtogeojson from "osmtogeojson";
import { SearchTool, TopologyTool } from "../../../tools";
import { ADMIN_LEVELS, ICON_SRCS, normalStyles } from "../../../util/constants";
import { simplifyFeature } from "../../../util/polyHelpers";
import AbstractControlState from "../AbstractControl/AbstractControlState";

class SearchControlState
  extends AbstractControlState
  implements TSearchControlState {
  public countries: Array<{
    name: string;
    "alpha-2": string;
    "country-code": string;
  }>;
  public countryCode: string;
  public adminLevel: number;
  public searchOpts: LooseObject[];
  public highQuality: boolean;
  public connectActivated: boolean;

  public constructor(props: ControlStateProps) {
    super(props);

    this.countries = require("/static/geo/iso3166_countries.json");
    this.countryCode = "";

    this.adminLevel = ADMIN_LEVELS[1].value;
    this.searchOpts = [];

    this.highQuality = false;
    this.connectActivated = false;
  }

  /**
   * takes countries from static file and maps through them
   */
  public getSelectCountries(): { value: string; label: string }[] {
    const result = this.countries.map((c) => ({
      value: c["alpha-2"],
      label: c["name"],
    }));
    return [{ value: "", label: "" }, ...result];
  }

  /**
   * sets whether displayed polygon will be of high quality
   */
  public setHighQuality(val: boolean): void {
    this.highQuality = val;
  }

  /**
   * sets whether we are creating topology with search
   */
  public setConnectActivated(val: boolean): void {
    this.connectActivated = val;
  }

  /**
   * sets for what area we are searching for
   */
  public searchForAreaAction = (e: InputEvent): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.countryCode = val;
  };

  /**
   * sets for what administration level we are searching for
   */
  public pickAdminLevelAction = (e: InputEvent): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.adminLevel = Number(val);
  };

  /**
   * sets new options for place search
   */
  public searchAction = async (e: InputEvent): Promise<void> => {
    const value = (e.target as HTMLInputElement).value;
    const featureGroup = this.tool.getState().featureGroup;

    const opts = await SearchTool.geoSearch(featureGroup, value);

    this.searchOpts = opts || [];
    this.control.inputSearch.changeOptions(
      opts ? opts.map((opt) => opt.label || "") : []
    );
  };

  /**
   * called when user picks a place from displayed options
   */
  public onInputOptClick = (value: string): void => {
    const featureGroup = this.tabControl.getTool().getState().featureGroup;
    const { searchOpts: opts, connectActivated } = this;

    const found = opts.find((opt) => opt.label === value);

    const latlng = L.latLng(0, 0);
    latlng.lat = found?.y || 0;
    latlng.lng = found?.x || 0;
    const iconUrl = found?.raw?.icon || ICON_SRCS[0];
    const marker = SearchTool.putMarkerOnMap(
      featureGroup,
      latlng,
      found?.label,
      iconUrl,
      connectActivated
    );
    this.tool.applyEventListeners(marker);
    this.tabControl.getState().setSelectedIcon(iconUrl);
    this.tabControl.getState().appendToIconSrcs(iconUrl);
    if (connectActivated) {
      this.tool.drawingTools[TopologyTool.NAME()].plotTopology();
    }
    this._redrawSidebar("search");
  };

  /**
   * builds query from inputed values and send it to Overpass API
   *
   * @returns
   */
  public fetchAreas = async (): Promise<void> => {
    const { countryCode, adminLevel, highQuality } = this;

    if (!countryCode || !adminLevel) return;

    const toolState = this.tool.getState();

    const endPoint = "https://overpass-api.de/api/interpreter?data=[out:json];";
    const query = `area["ISO3166-1"="${countryCode}"]->.searchArea;(relation["admin_level"="${adminLevel}"](area.searchArea););out;>;out skel qt;`;

    (document.querySelector(
      ".leaflet-container"
    ) as HTMLDivElement).style.cursor = "wait";
    this.control.searchForAreasBtn.setAttribute("disabled", true);

    fetch(endPoint + query)
      .then((response) => response.json())
      .then((data) => {
        const gJSON = osmtogeojson(data);

        const opts = {
          color: this.tabControl.getState().getSelectedColor(),
          draggable: true,
          transform: true,
        };

        toolState.featureGroup.eachLayer((layer) => {
          const drawnLayer = layer as DrawnObject;
          if (drawnLayer.countryCode === countryCode)
            toolState.removeLayer(drawnLayer);
        });

        gJSON?.features
          ?.filter((feat) => feat?.geometry?.type === "Polygon")
          ?.forEach((feat) => {
            let coords = (feat.geometry as Geometry).coordinates;
            if (!highQuality) {
              const simplified = simplifyFeature(feat as AllGeoJSON, 0.01);
              coords = ((simplified as Feature).geometry as Geometry)
                .coordinates;
            }
            const latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
            const result = new (L as any).polygon(latlngs, {
              ...opts,
              ...normalStyles,
            });
            result?.dragging?.disable();
            result.layerType = "polygon";
            result.countryCode = countryCode;
            toolState.addLayer(result);
          });
        this.control.errorMsg.innerText = "";
      })
      .catch((err) => {
        this.control.errorMsg.innerText = "There was a problem, re-try later.";
        console.error(err);
      })
      .finally(() => {
        (document.querySelector(
          ".leaflet-container"
        ) as HTMLDivElement).style.cursor = "";
        this.control.searchForAreasBtn.removeAttribute("disabled");
      });
  };
}

export default SearchControlState;
