import { 
    Feature, 
    FeatureCollection, 
    GeoJsonProperties, 
    Geometry 
} from "geojson";

import L, { LatLngBounds, Layer } from "leaflet";
import osmtogeojson from "osmtogeojson";
import * as turf from "@turf/turf";

import { 
    GeoDataFactory, 
    GeoJSONTypes, 
    LabeledAutocompleteFormInput, 
    LabeledCheckboxFormInput, 
    LabeledSliderFormInput, 
    TabDOMUtil 
} from "../../../../../index.core";

import { AllGeoJSON, Polygon, Properties } from "@turf/turf";

/**
 * Controler for Downloader tool. 
 * Manages almost everything around downloading geo objects from Overpass API.
 * Can generate automatic hierarchy definition from downloaded objects.
 * @author Vojtěch Malý
 */
class GeoDownloaderToolMapControl {
    // HTML elements and inputs
    public objectTypeInput : LabeledAutocompleteFormInput;
    public downloadGeojsonBTN : HTMLButtonElement;
    public downloadHierarchyBTN : HTMLButtonElement;
    public hierarchyEditToolDiv = document.createElement('div');
    public progressBar = document.createElement('progress');
    private countryInput : LabeledAutocompleteFormInput;
    private adminLevelDIV : HTMLElement = document.createElement('div');
    private adminLevelMAP : Map<LabeledCheckboxFormInput, string> = new Map();
    private simplifyInputScale : HTMLDivElement = document.createElement('input');
    private simplifyInputScaleRange : LabeledSliderFormInput;
    private hierarchyPreviewButtons : LabeledCheckboxFormInput[] = [];
    private hierarchySliders : LabeledSliderFormInput[] = [];

    private inProcess = false;
    private countriesList : countriesTYPE[];
    private selectedValue = "";
    private data : { level : number[], geo : any[], geoFIltered : FeatureCollection[] } = {
        level: [],
        geo: [],
        geoFIltered : []
    };
    private valueNameMap : Map<string, string> = new Map();
    private hierarchy : hierarchyConfig = {hierarchy:[]};
    private tableOfLevels : administrativeLevelsTYPE[];
    private levelMap : Map<string, administrativeLevelsTYPE> = new Map();
    private previewGeo : Map<number, L.GeoJSON> = new Map();

    private leafletMap : L.Map | undefined;


    public constructor(map : L.Map | undefined) {
        if (map) {
            this.leafletMap = map;
        }
        // Load countries from file
        this.countriesList = require("../../../static/iso3166_countries.json");
        this.tableOfLevels = require("../../../static/admin_levels.json");
        this.tableOfLevels.forEach((val) => {
            this.levelMap.set(val["Country"], val);
        });

        // Create and bind download geojson button.
        this.downloadGeojsonBTN = TabDOMUtil.createButton("Download GeoJSON", () => {
            this.downloadGeo();
        },"downloadGeo");
        this.downloadGeojsonBTN.setAttribute("disabled", "true");

        // Create and bind download button.
        this.downloadHierarchyBTN = TabDOMUtil.createButton("Download hierarchy", () => {
            this.downloadHierarchy();
        },"downloadHier");
        this.downloadHierarchyBTN.setAttribute("disabled", "true");

        // Create polygon or point selection
        this.objectTypeInput = new LabeledAutocompleteFormInput({
            label: "Object type:",
            options: ["Polygons", "Points"],
            onChangeAction: () => {
                this.simplifyDisable();
            }
        });

        // Create simplify scale
        this.simplifyInputScaleRange =  new LabeledSliderFormInput({
            label: "Simplify level:",
            defaultValue: "3",
            minValue: "0",
            maxValue: "5",
            onChangeAction: null
        });

        const countries = this.countriesList;
        countries.forEach(country => {
            this.valueNameMap.set(country["name"], country["alpha-2"]);
        });
        const tempName = Array.from(this.valueNameMap.keys());

        // Create country selection input.
        this.countryInput =  new LabeledAutocompleteFormInput({
            label: "Country:",
            options: tempName,
            onChangeAction: () => {
                this.createAdminLevelSelection();
            }
        });

        // Initialize progressBar
        this.progressBar.setAttribute('max', "100");
        this.progressBar.setAttribute('value', "0");
        this.progressBar.setAttribute('disabled', 'true');
    }

    /**
     * Create chcekboxes with custom labels based on OpenStreetMap table.
     * If not defined in table, creates clasic number labels.
     * 
     * @returns Div element containing buttons.
     */
    public createAdminLevelSelection() : HTMLElement {
        this.adminLevelDIV.innerHTML = "";
        if (this.countryInput.getValue() === "") {
            return this.adminLevelDIV;
        }

        if (this.levelMap.has(this.countryInput.getValue())) {
            // Create and filter OSM table.
            const countryPos = this.levelMap.get(this.countryInput.getValue());
            const countryPosMap : Map<number,string> = new Map();
            if (countryPos) {
                countryPosMap.set(2, countryPos.Country);
                countryPosMap.set(3, countryPos.FIELD2);
                countryPosMap.set(4, countryPos.FIELD3);
                countryPosMap.set(5, countryPos.FIELD4);
                countryPosMap.set(6, countryPos.FIELD5);
                countryPosMap.set(7, countryPos.FIELD6);
                countryPosMap.set(8, countryPos.FIELD7);
                countryPosMap.set(9, countryPos.FIELD8);
                countryPosMap.set(10, countryPos.FIELD9);
            }
            countryPosMap.forEach((val, ind) => {
                if (val === "N/A" || val === "") {
                    countryPosMap.delete(ind);
                }
            });

            // Create checkboxes and append them to civ container.
            for (let cnt = 2 ; cnt <= 10; cnt++) {
                const checkBox = new LabeledCheckboxFormInput({
                    label: countryPosMap.get(cnt) ?? cnt.toString(),
                    name: cnt.toString(),                           
                    onChangeAction: null
                });
                this.adminLevelMAP.set(checkBox, cnt.toString());

                const createdCheckBox = checkBox.create();
                createdCheckBox.setAttribute("style", "height:100%;align-items:start;");  

                if (createdCheckBox.firstChild) {
                    const checkBoxLabel = createdCheckBox.firstChild as HTMLDivElement;
                    checkBoxLabel.setAttribute("style", "height: 100%;width: 75%;");
                }
                this.adminLevelDIV.appendChild(createdCheckBox);
            }
        } else {
            // Create clasical checkbox input. 
            for (let cnt = 2 ; cnt <= 10; cnt++) {
                const label : string = cnt.toString();
                const temp = new LabeledCheckboxFormInput({
                    label: label,
                    name: cnt.toString(),                           
                    onChangeAction: null
                });
                this.adminLevelMAP.set(temp, cnt.toString());
                this.adminLevelDIV.appendChild(temp.create());
            }
        }

        return this.adminLevelDIV;
    }


    /**
     * Call back function for start of download.
     */
    public fetchHandle = () : void => {
        // Check if tool is already in download. 
        if (this.inProcess) {
            return;
        }

        if (this.valueNameMap.has(this.countryInput?.getValue())) {
            const temp = this.valueNameMap.get(this.countryInput?.getValue());
            if (temp) {
                this.selectedValue = temp;
            }
        }
        
        // Check if all inputed values are valid. 
        if (this.selectedValue === "" ) {
            alert("Please select country.");
            return;
        } else if (this.objectTypeInput.getValue() === "") {
            alert("Please select if you want to download Polygons or Points.");
            return;
        }

        // Get all levels to be downloaded.
        const selectedLevels = this.getSelectedValuesFromMutliple();
        const selectedLevelsInt : number[] = [];
        selectedLevels.forEach(lev => {
            selectedLevelsInt.push(parseInt(lev));
        });

        // Change visual attributes to indicate downloading. 
        this.changeToWait();
        this.progressBar.setAttribute('value', "0");
        this.progressBar.removeAttribute('disabled');
       
        // Clear data structers.
        this.data.geo = [];
        this.data.geoFIltered = [];
        this.data.level = [];
        this.hierarchy.hierarchy = [];
        this.hierarchyEditToolDiv.innerHTML = "";

        // Fetch all data
        const prom : Promise<any> = this.fetchGeo(this.selectedValue, selectedLevelsInt);
        
        // Finalize, filter, generate and process downloaded data.
        prom.finally(() => {
            this.filterGeo();
            this.makeIDsPretty();
            if (this.objectTypeInput.getValue() == "Polygons") {
                this.generateHierarchy();
                this.generateHierarchyEdit();
            } else {
                this.generateHierarchyEdit();
            }
            this.mergeToGeo();

            this.changeToNormal();
            this.progressBar.setAttribute('value', "100");
        });
    };

    /**
     * Generate hierarchy editation interface
     */
    protected generateHierarchyEdit() : void {
        // Iterate over every downloaded level of geo-objects.
        for (let cnt = 0; cnt < this.data.level.length; cnt++) {
            // Create prewiew buttons.
            const temp = new LabeledCheckboxFormInput({
                label: "Preview " + cnt.toString(),
                name: cnt.toString(),                           
                onChangeAction: () => {
                    this.togglePreview(cnt);
                }
            });

            this.hierarchyPreviewButtons.push(temp);
            this.hierarchyEditToolDiv.appendChild(temp.create());
            
            // Create hierarchy level slider if downloaded polygons
            if (this.objectTypeInput.getValue() === "Polygons") {
                const temp2 = new LabeledSliderFormInput({
                    label: "Hierarchy level",
                    defaultValue: cnt.toString(),
                    minValue: "0",
                    maxValue: "20",
                    onChangeAction: () => {
                        this.changeLevel(cnt);
                    }
                });
                this.hierarchySliders.push(temp2);
                this.hierarchyEditToolDiv.appendChild(temp2.create());
            }
        }
    }

    /**
     * Show or clear prewiev of downloaded data. 
     * @param level 
     */
    protected togglePreview(level : number) : void {
        if (this.objectTypeInput.getValue() === "Polygons") {
            // Show
            if (this.hierarchyPreviewButtons[level].getValue()) {
                const geoPrew = L.geoJSON(this.data.geoFIltered[level]);
                this.previewGeo.set(level, geoPrew);
                if (this.leafletMap) {
                    geoPrew.addTo(this.leafletMap);
                }
            // Remove
            } else {
                if (this.leafletMap) {
                    if (this.previewGeo.has(level)) {
                        this.previewGeo.get(level)?.removeFrom(this.leafletMap);
                    }
                }
            }

        } else {
            // Add
            if (this.hierarchyPreviewButtons[level].getValue()) {
                // Show with basic leaflet icons
                const geoPrew =this.data.geoFIltered[level];
                const icon = new L.Icon({
                    iconUrl: require("leaflet/dist/images/marker-icon.png"),
                    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
                    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
                });

                const points =  L.geoJSON(geoPrew, {
                    pointToLayer: function (feature, latlng) {
                        const toVis = L.latLng(latlng.lng, latlng.lat);
                        return L.marker(toVis, {icon : icon});
                    }
                });

                this.previewGeo.set(level, points);
                if (this.leafletMap) {
                    points.addTo(this.leafletMap);
                }

            // Remove
            } else {
                if (this.leafletMap) {
                    if (this.previewGeo.has(level)) {
                        this.previewGeo.get(level)?.removeFrom(this.leafletMap);
                    }
                }
            }
        }

    }

    /**
     * Change zoom level in hierarchy for certain administrative level.
     * @param level 
     */
    protected changeLevel(level : number) : void {
        const levelNow = this.data.level[level];
        const newLevel = this.hierarchySliders[level];
        this.hierarchy.hierarchy.forEach(val => {
            const splittedId = val.id.split("_");
            if (splittedId[1] === levelNow.toString()) {
                val.zoomLevel = parseInt(newLevel.getValue());
            }
        });
    }


    /**
     * Returns selected administrative levels.
     * @returns 
     */
    protected getSelectedValuesFromMutliple() : string[] {
        const ans : string[] = [];
        this.adminLevelMAP.forEach((val, key) => {
            if (key.getValue()) {
                ans.push(val);
            }
        });
        return ans;
    }

    /**
     * Asynchronous function to download geoobjects.
     * @param countryID ID of country
     * @param admin_levels Array of levels to be downloaded.
     * @returns Promise
     */
    protected fetchGeo = async (countryID : string, admin_levels : number[]) : Promise<any> =>  {
        console.log("Download of geoobjects has started.");
        const adder = 100 / admin_levels.length;   
        let progress = 0;
        
        // Endpoint definiton
        const endPoint = "https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];";
        
        // For every selected level
        for (let cnt = 0; cnt < admin_levels.length; cnt++) {
            const query = `area["ISO3166-1"="${countryID}"]->.searchArea;(relation["admin_level"="${admin_levels[cnt]}"][boundary=administrative](area.searchArea););out;>;out skel qt;`;
            
            let temp : unknown;
            try {
                console.log("Fetch of administrative level: " + admin_levels[cnt]);
                // Since this whole function is async, program can await for response.
                const response = await fetch(endPoint + query);
                temp = await response.json();
                // Convert OSM data from response to GeoJSON.
                const geo = osmtogeojson(temp);

                this.data.level.push(admin_levels[cnt]);
                this.data.geo.push(geo);    

                // Update progress bar  
                progress = progress + adder;
                this.progressBar.setAttribute('value', progress.toString());

            } catch(erorr) {
                console.error(erorr);
            }
        }

        return this.data;
    }

    /**
     * Filters and simplify downloaded data.
     */
    protected filterGeo() : void {

        // Filtration loop
        for (let cnt = 0; cnt < this.data.level.length; cnt++) {
            if (this.data.geo[cnt]?.features.length < 1) {
                this.data.geo.splice(cnt,1);
                this.data.level.splice(cnt,1);
                cnt--;
                continue;
            }

            const factory = new GeoDataFactory;
            const name = this.selectedValue + "_" + this.data.level[cnt];
            const temp = factory.geojson(name, this.data.geo[cnt]);

            if (this.objectTypeInput.getValue() === "Polygons") {
                this.data.geoFIltered.push(temp.getFeatures([ GeoJSONTypes.Polygon ]));
            } else {
                this.data.geoFIltered.push(temp.getFeatures([ GeoJSONTypes.Point ]));
            }

            // Delete raw data
            delete this.data.geo[cnt];
        }
        
        // Simplification loop
        const simplifyIndex = this.simplifyInputScaleRange?.getValue();
        for (let cnt=0; cnt < this.data.geoFIltered.length; cnt++) {
            this.data.geoFIltered[cnt].features.forEach((feature, index) => {
                const simplified = this.simplifyFeature(feature as AllGeoJSON, this.getSimplifyScaled(parseInt(simplifyIndex)));
                this.data.geoFIltered[cnt].features[index] = simplified;
            });
        }
    }


    /**
     * Automatic generator of hierarchy definition. 
     */
    protected generateHierarchy() : void {
        const ans : hierarchyConfig = {
            hierarchy : []
        };

        for (let cnt = this.data.geoFIltered.length - 1; cnt >= 0; cnt--) {
            // Layer of childs
            const lowerLayer = L.geoJSON(this.data.geoFIltered[cnt]);

            lowerLayer.eachLayer(child => {
                const childExtended = child as LayerExtendedTYPE;
                const childID = childExtended.feature.id;
                const turfChild = childExtended.feature as turf.Feature;

                if (cnt > 0) {  // We are not on top layer.
                    const parentID = this.getParent(turfChild, cnt);
                    if (parentID != "") {   // Found parent
                        ans.hierarchy.push({
                            id : childID,
                            parent : parentID,
                            zoomLevel : cnt
                        });
                    } else {                // Didnt found, make it top level
                        ans.hierarchy.push({
                            id : childID,
                            parent : "",
                            zoomLevel : cnt
                        });
                    }
                } else {        // Top-layer
                    ans.hierarchy.push({
                        id : childID,
                        parent : "",
                        zoomLevel : cnt
                    });
                }
            });
        }

        this.hierarchy = ans;
    }

    /**
     * Function to reslove childs parent in automatic generating of hierarchy.
     * @param centerCHild 
     * @param iterator 
     * @returns 
     */
    protected getParent(centerCHild : turf.Feature, iterator : number) : string {
        let answer = "";
        for (let cnt = (iterator - 1); cnt >= 0; cnt--) {
            // Layer of parent
            const upperLayer = L.geoJSON(this.data.geoFIltered[cnt]);
            let barrier = false;

            upperLayer.eachLayer(upperObject => {
                const upperObjectX = upperObject as LayerExtendedTYPE;
                const turfUpper = upperObjectX.feature as turf.Feature<Polygon,Properties>;
                
                if (!barrier) {    
                    const center = turf.centerMean(centerCHild);
                    const checkIfIn = turf.pointsWithinPolygon(center, centerCHild as turf.Feature<Polygon,Properties>);
                    
                    if (checkIfIn.features.length > 0) {
                        const check = turf.pointsWithinPolygon(center, turfUpper);
                        if (check.features.length > 0) {
                            barrier = true;
                            answer = upperObjectX.feature.id;
                        }
                    }
                }
            });

            if (barrier) {
                return answer;
            }
        }

        return answer;
    }

    /**
     * Generate new IDs for geoobjects.
     */
    protected makeIDsPretty() : void {
        for (let cnt = 0; cnt <  this.data.geoFIltered.length; cnt++) {
            const temp = this.data.geoFIltered[cnt];

            temp.features.forEach((ft,ind) => {
                const newID = this.selectedValue + "_" + this.data.level[cnt] + "_" + ind;
                ft.id = newID;
                if (ft.properties) {
                    // Copy name from polygon, if not (in case of point), generate same as ID.
                    if (ft.properties.name) {
                        (ft as FeatureExtendedTYPE).name = ft.properties.name ?? "";
                        ft.properties = {
                            name : ft.properties.name
                        };

                    } else {
                        ft.properties.name = newID;  
                        ft.properties = {
                            name : newID
                        };
                    }
                }
            });
        }
    }

    /**
     * Merge all administrative layers in one GeoJSON
     * @returns 
     */
    protected mergeToGeo() : string {
        const parent = L.geoJSON();
        const geoData = this.data.geoFIltered;

        for (let cnt = 0; cnt < geoData.length; cnt++) {
            let geo : L.GeoJSON;

            if (this.objectTypeInput.getValue() === "Points") {
                geo = L.geoJSON(geoData[cnt], {
                    onEachFeature : function(feature, layer) {
                        const extOver = feature.geometry as GeometryExtendedTYPE;
                        const tmp = extOver.coordinates[0];
                        extOver.coordinates[0] = extOver.coordinates[1];
                        extOver.coordinates[1] = tmp;
                        feature.geometry = extOver;
                    }
                });

            } else {
                geo = L.geoJSON(geoData[cnt]);
            }

            geo.eachLayer(layer => {
                parent.addLayer(layer);
            });
        }

        const data = parent.toGeoJSON();
        return JSON.stringify(data);
    }

    protected simplifyFeature = (feature: turf.AllGeoJSON, simplifyIndex?: number): GeoJSON.Feature => {
        const simplifyIndexConst = simplifyIndex ?? 0;
        const result = turf.simplify(feature, { tolerance : simplifyIndexConst }) as GeoJSON.Feature;
        return result;
    };

    /**
     * Change state of tool to -> waiting for download to finish
     */
    protected changeToWait() : void {
        this.inProcess = true;
        (document.querySelector("#downloaderDiv") as HTMLDivElement).style.cursor = "wait";
        this.downloadGeojsonBTN.setAttribute("disabled", "");
        this.downloadHierarchyBTN.setAttribute("disabled", "");
    }

    /**
     * Change state of tool to normal -> download finished.
     */
    protected changeToNormal() : void {
        this.inProcess = false;
        (document.querySelector("#downloaderDiv") as HTMLDivElement).style.cursor = "";
        this.downloadGeojsonBTN.removeAttribute("disabled");
        if (this.objectTypeInput.getValue() === "Polygons") {
            this.downloadHierarchyBTN.removeAttribute("disabled");
        }
    }

    /**
     * Callback function for downloading GeoJSON
     */
    public downloadGeo = () : void => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.mergeToGeo()));
        element.setAttribute('download', "geoData.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    /**
     * Callback function for downloading Hierarchy definition.
     */
    public downloadHierarchy = () : void => {
        const hier = JSON.stringify(this.hierarchy);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(hier));
        element.setAttribute('download', "hierarchyConfig.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    public createSimplifyNumberInput() : HTMLDivElement {
        const slider = this.simplifyInputScaleRange.create();
        this.simplifyInputScale = slider;

        const div = document.createElement('div');
        const text = document.createElement('label');
        text.innerText = "Level of simplification downloaded objects. Higher level means less quality and less file size, therefore better performance.";
        text.setAttribute('for', 'simplifyScale');


        this.simplifyInputScale = slider;

        div.appendChild(text);
        div.appendChild(document.createElement('div'));
        div.appendChild(this.simplifyInputScale);
        div.appendChild(document.createElement('div'));
        return slider;
    }

    public simplifyDisable = () : void => {
        if (this.objectTypeInput.getValue() === "Polygons") {
            this.simplifyInputScaleRange.setDisabled(false);
        } else {
            this.simplifyInputScaleRange.setDisabled(true);
        }
    }

    /**
     * From input number (0 - 10) converts to coefficient of simplification compatible with @turf funciton.
     * @param input 
     * @returns 
     */
    protected getSimplifyScaled(input: number): number {
        let ans = 0.01;
        switch (input) {
            case 0:
                ans = 0;
                break;
            case 1:
                ans = 0.5;
                break;
            case 2:
                ans = 0.1;
                break;
            case 3:
                ans = 0.01;
                break;
            case 4:
                ans = 0.005;
                break;
            case 5:
                ans = 0.001;
                break;
            default:
                ans = 0.01;
                break;
        }
        return ans;
    }

    public createSelection() : HTMLElement {
        return this.countryInput.create();
    }
}
export default GeoDownloaderToolMapControl;

/**
 * Type reference of iso file containing list of countries.
 */
 type countriesTYPE = {
    "name" : string;
    "alpha-2" : string;
    "country-code" : string;
}

/**
 * Hierarchy configuration type, same as used in geovisto hierarchy tool config. 
 */
type hierarchyConfig = {
    hierarchy : {
        "id" : string,
        "zoomLevel" : number,
        "parent" : string
    }[]
}

/**
 * Type extending javascript objects of few elements.
 */
type LayerExtendedTYPE = Layer & {
    _bounds : LatLngBounds,
    feature : Feature & {
        id : string
    }
}


/**
 * OSM administrative levels table type.
 */
type administrativeLevelsTYPE = {
    "Country" : string,
    "FIELD2" : string,
    "FIELD3" : string,
    "FIELD4" : string,
    "FIELD5" : string,
    "FIELD6" : string,
    "FIELD7" : string,
    "FIELD8" : string,
    "FIELD9" : string
}

/**
 * Extension of GeoJSON feature type for name. Used to name polygons in Geovisto.
 */
type FeatureExtendedTYPE = Feature<Geometry, GeoJsonProperties> & {
    name : string;
}

/**
 * Extension of Geometry to read coordinates.
 */
type GeometryExtendedTYPE = Geometry & {
    coordinates : [number, number];
}

