import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import L, {LatLng, LatLngBounds, Layer } from "leaflet";
import osmtogeojson from "osmtogeojson";
import * as turf from "@turf/turf";
import { GeoDataFactory, GeoJSONTypes, LabeledAutocompleteFormInput, LabeledCheckboxFormInput, LabeledSliderFormInput, TabDOMUtil } from "../../../../../index.core";
import { AllGeoJSON } from "@turf/turf";

/**
 * Controler for hierarchy tool map form.
 * @author Vojtěch Malý
 */
class DownloaderToolMapControl {
    // HTML elements and inputs
    public polygonOrPointSelect : LabeledAutocompleteFormInput;
    public countrySelect : LabeledAutocompleteFormInput;
    public downloadGeoButton : HTMLButtonElement;
    public downloadHierarchyButton : HTMLButtonElement;
    public hierarchyEditToolDiv = document.createElement('div');
    public progressBar = document.createElement('progress');
    private adminMultipleSelect : HTMLElement = document.createElement('div');
    private administrationLevelSelect : Map<LabeledCheckboxFormInput, string> = new Map();
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


    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(map : L.Map | undefined) {
        if (map) {
            this.leafletMap = map;
        }
        this.countriesList = require("../../../iso3166_countries.json");
        this.tableOfLevels = require("../../../admin_levels.json");
        this.tableOfLevels.forEach((val) => {
            this.levelMap.set(val["Country"], val);
        });

        // Create and bind download geojson button.
        this.downloadGeoButton = TabDOMUtil.createButton("Download GeoJSON", () => {
            this.downloadGeo();
        },"downloadGeo");
        this.downloadGeoButton.setAttribute("disabled", "true");

        // Create and bind download button.
        this.downloadHierarchyButton = TabDOMUtil.createButton("Download hierarchy", () => {
            this.downloadHierarchy();
        },"downloadHier");
        this.downloadHierarchyButton.setAttribute("disabled", "true");

        // Create polygon or point selection
        this.polygonOrPointSelect = new LabeledAutocompleteFormInput({
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
        this.countrySelect =  new LabeledAutocompleteFormInput({
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
     * Create buttons with custom labels based on OpenStreetMap table.
     * If no entry, creates clasic number labels.
     * @returns Div element containing buttons.
     */
    public createAdminLevelSelection() : HTMLElement {
        this.adminMultipleSelect.innerHTML = "";
        if (this.levelMap.has(this.countrySelect.getValue())) {
            // Create and filter OSM table.
            const countryPos = this.levelMap.get(this.countrySelect.getValue());
            const countryPosMap : Map<number,string> = new Map();
            if (countryPos) {
                countryPosMap.set(2, countryPos.FIELD2);
                countryPosMap.set(3, countryPos.FIELD3);
                countryPosMap.set(4, countryPos.FIELD4);
                countryPosMap.set(5, countryPos.FIELD5);
                countryPosMap.set(6, countryPos.FIELD6);
                countryPosMap.set(7, countryPos.FIELD7);
                countryPosMap.set(8, countryPos.FIELD8);
                countryPosMap.set(9, countryPos.FIELD9);
            }
            countryPosMap.forEach((val, ind) => {
                if (val === "N/A" || val === "") {
                    countryPosMap.delete(ind);
                }
            });

            // Create checkboxes and append them to civ container.
            for (let cnt = 2 ; cnt < 10; cnt++) {
                const temp = new LabeledCheckboxFormInput({
                    label: countryPosMap.get(cnt) ?? cnt.toString(),
                    name: cnt.toString(),                           
                    onChangeAction: null
                });
                this.administrationLevelSelect.set(temp, cnt.toString());
                const x = temp.create();
                x.setAttribute("style", "height: 100%;align-items:start;");  
                if (x.firstChild) {
                    const p = x.firstChild as HTMLDivElement;
                    p.setAttribute("style", "height: 100%;width: 75%;");
                }
                this.adminMultipleSelect.appendChild(x);
            }

        } else {
            for (let cnt = 2 ; cnt < 10; cnt++) {
                const label : string = cnt.toString();
                const temp = new LabeledCheckboxFormInput({
                    label: label,
                    name: cnt.toString(),                           
                    onChangeAction: null
                });
                this.administrationLevelSelect.set(temp, cnt.toString());
                this.adminMultipleSelect.appendChild(temp.create());
            }
        }

        return this.adminMultipleSelect;
    }

    public createSelection() : HTMLElement {
        return this.countrySelect.create();
    }

    /**
     * On button click fetch from overpass API
     */
    public fetchHandle = () : void => {
        // Check if tool is already in download. 
        if (this.inProcess) {
            return;
        }

        if (this.valueNameMap.has(this.countrySelect?.getValue())) {
            const temp = this.valueNameMap.get(this.countrySelect?.getValue());
            if (temp) {
                this.selectedValue = temp;
            }
        }
        
        // Check if all inputed values are valid. 
        if (this.selectedValue === "" ) {
            alert("Please select country.");
            return;
        } else if (this.polygonOrPointSelect.getValue() === "") {
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
            if (this.polygonOrPointSelect.getValue() == "Polygons") {
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
        console.log("Generating edit to this data.leve.length. Are there empty data?");
        console.log(this.data);
        for (let cnt = 0; cnt < this.data.level.length; cnt++) {
            // Create prewiew buttons.
            const temp = new LabeledCheckboxFormInput({
                label: "Preview " + cnt.toString(),
                name: cnt.toString(),                           
                onChangeAction: () => {
                    this.togglePreview(cnt);
                }
            });

            // Create hierarchy level slider.
            const temp2 = new LabeledSliderFormInput({
                label: "Hierarchy level",
                defaultValue: cnt.toString(),
                minValue: "0",
                maxValue: "20",
                onChangeAction: () => {
                    this.changeLevel(cnt);
                }
            });
            this.hierarchyPreviewButtons.push(temp);
            this.hierarchySliders.push(temp2);
            this.hierarchyEditToolDiv.appendChild(temp.create());
            this.hierarchyEditToolDiv.appendChild(temp2.create());
        }
    }

    // Show or clear downloaded GeoJSON objects of prewiev.
    protected togglePreview(level : number) : void {
        if (this.polygonOrPointSelect.getValue() === "Polygons") {
            if (this.hierarchyPreviewButtons[level].getValue()) {
                const geoPrew = L.geoJSON(this.data.geoFIltered[level]);
                this.previewGeo.set(level, geoPrew);
                if (this.leafletMap) {
                    geoPrew.addTo(this.leafletMap);
                }
            } else {
                if (this.leafletMap) {
                    if (this.previewGeo.has(level)) {
                        this.previewGeo.get(level)?.removeFrom(this.leafletMap);
                    }
                }
            }
        } else {
            if (this.hierarchyPreviewButtons[level].getValue()) {
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
            } else {
                if (this.leafletMap) {
                    if (this.previewGeo.has(level)) {
                        this.previewGeo.get(level)?.removeFrom(this.leafletMap);
                    }
                }
            }
        }

    }

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

    protected getSelectedValuesFromMutliple() : string[] {
        const ans : string[] = [];
        this.administrationLevelSelect.forEach((val, key) => {
            if (key.getValue()) {
                ans.push(val);
            }
        });
        return ans;
    }

    protected fetchGeo = async (countryID : string, admin_levels : number[]) : Promise<any> =>  {
        console.log("__Fetching started");
        const adder = 100 / admin_levels.length;
        let progress = 0;
        const endPoint = "https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];";
        for (let cnt = 0; cnt < admin_levels.length; cnt++) {
            const query = `area["ISO3166-1"="${countryID}"]->.searchArea;(relation["admin_level"="${admin_levels[cnt]}"][boundary=administrative](area.searchArea););out;>;out skel qt;`;
            let temp : unknown;
            try {
                console.log("___Fetch through: ", endPoint + query);
                const response = await fetch(endPoint + query);
                temp = await response.json();
                const geo = osmtogeojson(temp);
                console.log("Fetched: ", geo);
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

    protected filterGeo() : void {
        // First filtration loop 
       
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
            if (this.polygonOrPointSelect.getValue() === "Polygons") {
                this.data.geoFIltered.push(temp.getFeatures([ GeoJSONTypes.Polygon ]));
            } else {
                this.data.geoFIltered.push(temp.getFeatures([ GeoJSONTypes.Point ]));
            }
            delete this.data.geo[cnt];
        }
        
        const simplifyIndex = this.simplifyInputScaleRange?.getValue();
        for (let cnt=0; cnt < this.data.geoFIltered.length; cnt++) {
            this.data.geoFIltered[cnt].features.forEach((feature, index) => {
                const simplified = this.simplifyFeature(feature as AllGeoJSON, this.getSimplifyScaled(parseInt(simplifyIndex)));
                this.data.geoFIltered[cnt].features[index] = simplified;
            });
        }
    }


    protected generateHierarchy() : void {
        const ans : hierarchyConfig = {
            hierarchy : []
        };
        console.log("Generate Hierarchy!!!!");
        console.log(this.data.geoFIltered);
        for (let cnt = this.data.geoFIltered.length - 1; cnt >= 0; cnt--) {
            // Get one layer of Geo
            console.log("Parsing:", this.data.geoFIltered[cnt]);

            const x = L.geoJSON(this.data.geoFIltered[cnt]);
            x.eachLayer(la => {
                const tex = la as LayerExtendedTYPE;
                const id = tex.feature.id;
                
                if (cnt != 0) {
                    if (tex.feature.id === "CZ_7_37") {
                        console.log(tex.feature.id);
                    }
                    const parentId = this.getParent(tex._bounds.getCenter(), cnt);
                    if (parentId != "") {
                        ans.hierarchy.push({
                            id : id,
                            parent : parentId,
                            zoomLevel : cnt
                        });
                    }
                } else {
                    ans.hierarchy.push({
                        id : id,
                        parent : "",
                        zoomLevel : cnt
                    });
                }
            });

        }
        this.hierarchy = ans;
    }


    // Až se vrátíš, oddebuguj si tohle s breakpointe na 412. V momentě kdy ho hitneš, znaemá to že v další iteračce vlezež do get parenta
    // Kde by to mělo vrátit CZ_4_5 ale z nějakého důvodu nevrací.
    protected getParent(centerCHild : LatLng, iterator : number) : string {
        const parentGeo = L.geoJSON(this.data.geoFIltered[iterator-1]);
        let ans = "";
        parentGeo.eachLayer(layer => {
            const typeLayer = layer as LayerExtendedTYPE;
            if (typeLayer.feature.id === "CZ_4_5") {
                console.log("Check!");
            }
            if (typeLayer._bounds.contains(centerCHild)) {
                ans = typeLayer.feature.id;
            }
        });
        return ans;
    }

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

    protected mergeToGeo() : string {
        const parent = L.geoJSON();
        const geoData = this.data.geoFIltered;


        for (let cnt = 0; cnt < geoData.length; cnt++) {
            let geo : L.GeoJSON;
            if (this.polygonOrPointSelect.getValue() === "Points") {
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


    protected simplifyFeature = (feature: turf.AllGeoJSON, pixels?: number): GeoJSON.Feature => {
        const tolerance = pixels;
        const result = turf.simplify(feature, { tolerance }) as GeoJSON.Feature;
        return result;
    };

    protected changeToWait() : void {
        this.inProcess = true;
        (document.querySelector(".leaflet-container") as HTMLDivElement).style.cursor = "wait";
        this.downloadGeoButton.setAttribute("disabled", "");
        this.downloadHierarchyButton.setAttribute("disabled", "");
    }

    protected changeToNormal() : void {
        this.inProcess = false;
        (document.querySelector(".leaflet-container") as HTMLDivElement).style.cursor = "";
        this.downloadGeoButton.removeAttribute("disabled");
        if (this.polygonOrPointSelect.getValue() === "Polygons") {
            this.downloadHierarchyButton.removeAttribute("disabled");
        }
    }

    public downloadGeo = () : void => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.mergeToGeo()));
        element.setAttribute('download', "geoData.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

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
        if (this.polygonOrPointSelect.getValue() === "Polygons") {
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
}
export default DownloaderToolMapControl;

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
    feature : {
        id : string
    }
}

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

type GeometryExtendedTYPE = Geometry & {
    coordinates : [number, number];
}

