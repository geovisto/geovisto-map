// geojson
import {
    Feature,
    Point
} from 'geojson';

// leaflet
import {
    MarkerCluster,
    MarkerClusterGroup
} from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet markercluster plugin
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// own styles
import '../../../style/markerLayer.scss';

// Geovisto Selection Tool API
import {
    ISelectionToolAPI,
    ISelectionToolAPIGetter
} from '../../../../../selection';

// Geovisto Themes Tool API
import {
    IMapTheme,
    IThemesToolAPI,
    IThemesToolAPIGetter,
    IThemesToolEvent
} from '../../../../../themes';

// Geovisto core
import {
    AbstractLayerTool,
    DataChangeEvent,
    DataManagerChangeEvent,
    GeoJSONTypes,
    IDataChangeAnimateOptions,
    IMapDataDomain,
    IMapAggregationBucket,
    IMapAggregationFunction,
    IMapData,
    IMapDataChangeEvent,
    IMapDataManager,
    IMapDomainDimension,
    IMapDomain,
    IMapEvent,
    IMapForm,
    IMapFormControl,
    IMapLegend,
    IMapLegendControl,
    IMapToolInitProps,
    LayerToolRenderType,
    DimensionChangeEvent,
    GeoDataChangeEvent,
    GeoDataManager
} from '../../../../../../index.core';

import { createClusterMarkersData, createMarkerIconValueOptions, createPopupMessage } from '../marker/MarkerUtil';
import IMarker from '../../types/marker/IMarker';
import { IMarkerIconOptions, IMarkerIconValueOptions } from '../../types/marker/IMarkerIconOptions';
import IMarkerLayerTool from '../../types/tool/IMarkerLayerTool';
import { IMarkerLayerToolConfig } from '../../types/tool/IMarkerLayerToolConfig';
import IMarkerLayerToolDefaults from '../../types/tool/IMarkerLayerToolDefaults';
import IMarkerLayerToolDimensions from '../../types/tool/IMarkerLayerToolDimensions';
import IMarkerLayerToolState from '../../types/tool/IMarkerLayerToolState';
import IMarkerLayerToolProps from '../../types/tool/IMarkerLayerToolProps';
import Marker from '../marker/Marker';
import MarkerLayerToolDefaults from './MarkerLayerToolDefaults';
import MarkerLayerToolMapForm from '../form/MarkerLayerToolMapForm';
import MarkerLayerToolState from './MarkerLayerToolState';
import IMarkerIcon from '../../types/marker/IMarkerIcon';
import MarkerLayerToolMapLegend from "../legend/MarkerLayerToolMapLegend";

/**
 * This class represents Marker layer tool. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerTool extends AbstractLayerTool implements IMarkerLayerTool, IMapFormControl, IMapLegendControl {

    private selectionToolAPI: ISelectionToolAPI | undefined;
    private themesToolAPI: IThemesToolAPI | undefined;
    private mapForm!: IMapForm;
    private mapLegend!: IMapLegend;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props?: IMarkerLayerToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IMarkerLayerTool {
        return new MarkerLayerTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IMarkerLayerToolProps {
        return <IMarkerLayerToolProps> super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IMarkerLayerToolDefaults {
        return <IMarkerLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IMarkerLayerToolDefaults {
        return new MarkerLayerToolDefaults();
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): IMarkerLayerToolState {
        return <IMarkerLayerToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): IMarkerLayerToolState {
        return new MarkerLayerToolState(this);
    }

    /**
     * Help function which acquires and returns the selection tool if available.
     */
    private getSelectionTool(): ISelectionToolAPI | undefined {
        if(this.selectionToolAPI == undefined) {
            const api = this.getMap()?.getState().getToolsAPI() as ISelectionToolAPIGetter;
            if(api.getGeovistoSelectionTool) {
                this.selectionToolAPI = api.getGeovistoSelectionTool();
            }
        }
        return this.selectionToolAPI;
    }

    /**
     * Help function which acquires and returns the themes tool if available.
     */
    private getThemesTool(): IThemesToolAPI | undefined {
        if(this.themesToolAPI == undefined) {
            const api = this.getMap()?.getState().getToolsAPI() as IThemesToolAPIGetter;
            if(api.getGeovistoThemesTool) {
                this.themesToolAPI = api.getGeovistoThemesTool();
            }
        }
        return this.themesToolAPI;
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getMapForm(): IMapForm {
        if(this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    /**
     * It returns a legend with respect to the configuration.
     */
    public getMapLegend(): IMapLegend {
        if(this.mapLegend == undefined) {
            this.mapLegend = this.createMapLegend();
        }
        return this.mapLegend;
    }

    /**
     * It creates new tab control.
     */
    protected createMapForm(): IMapForm {
        return new MarkerLayerToolMapForm(this);
    }

    /**
     * It creates new legend control.
     */
    protected createMapLegend(): IMapLegend {
        return new MarkerLayerToolMapLegend(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<IMarkerLayerToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates layer items.
     */
    protected createLayerItems(): L.Layer[] {
        // create layer which clusters points
        //let layer = L.layerGroup([]);

        /**
         * If hiearachy is enabled, disable clustering of markers by setting ,,disableClusteringAtZoom" on the lowest possible zoom level.
         */
        const decideHierarchy = () : number | undefined => {
            const geoManager = this.getState().getDimensions().geoData.getDomainManager() as GeoDataManager;
            if (geoManager.isHierarchyEnabled()) {       
                return this.getMap()?.getState().getLeafletMap()?.getMinZoom();
            } else {
                return this.getMap()?.getState().getLeafletMap()?.getMaxZoom();
            }
        };

        const markerLayerGroup: MarkerClusterGroup = new MarkerClusterGroup({
            // create cluster icon
            iconCreateFunction: (cluster) => {
                // take child markers and construct options for the parent marker
                const markers: IMarker<IMarkerIcon<IMarkerIconOptions>>[] = cluster.getAllChildMarkers() as Marker<IMarkerIcon<IMarkerIconOptions>>[];
                const markerOptions: IMarkerIconOptions = createClusterMarkersData(markers);
                // create an icon for the parent marker
                return this.getDefaults().getMarkerIcon(markerOptions);
            },
            // Disable clustering based on hierarchy enable status
            disableClusteringAtZoom: decideHierarchy()                   
        });

        // update state and redraw
        this.getState().setMarkerLayerGroup(markerLayerGroup);

        return [ markerLayerGroup ];
    }

    /**
     * It deletes layer items.
     */
    protected deleteLayerItems(): void {
        //console.log("marker");
        const markers = this.getState().getMarkers();

        // delete the 'value' property of every geo feature object if defined
        const markerLayerGroup = this.getState().getMarkerLayerGroup();
        if(markerLayerGroup) {
            for(let i = 0; i < markers.length; i++) {
                markerLayerGroup.removeLayer(markers[i]);
            }
        }
        
        this.getState().setMarkers([]);
    }

    /**
     * It prepares data for markers.
     */
    protected updateData(): Map<string, Map<string, IMapAggregationBucket | null>> {
        let bucketHierarchyMap =  new Map<string, Map<string, IMapAggregationBucket | null>>();
        // initialize a hash map of aggreation buckets
        const bucketMaps = new Map<string, Map<string, IMapAggregationBucket | null>>();

        // get dimensions
        const dimensions: IMarkerLayerToolDimensions = this.getState().getDimensions();
        const geoDimension: IMapDataDomain | undefined = dimensions.geoId.getValue();
        const valueDimension: IMapDataDomain | undefined = dimensions.value.getValue();
        const aggregationDimension: IMapAggregationFunction | undefined = dimensions.aggregation.getValue();
        const categoryDimension: IMapDataDomain | undefined = dimensions.category.getValue();
        const map = this.getMap();

        const geoManager = this.getState().getDimensions().geoData.getDomainManager() as GeoDataManager;
        const domainName = this.getState().getDimensions().geoData.getValue()?.getName() ?? "";
        // test whether the dimension are set
        if(geoDimension && aggregationDimension && map) {
            const mapData: IMapDataManager = map.getState().getMapData();
            const data: IMapData = map.getState().getCurrentData();
            const dataLen: number = data.length;
            let foundGeos: unknown[], foundValues: unknown[], foundCategories: unknown[], foundCategory: string;
            
            let bucketMap: Map<string, IMapAggregationBucket | null> | undefined;
            let aggregationBucket: IMapAggregationBucket | null | undefined;
            for (let i = 0; i < dataLen; i++) {
                // find the 'geo' properties of the data record
                foundGeos = mapData.getDataRecordValues(geoDimension, data[i]);
                // since the data are flattened we can expect max one found item
                if(foundGeos.length == 1 && typeof foundGeos[0] == "string") {
                    // get the aggregation bucket map for the country or create a new one
                    bucketMap = bucketMaps.get(foundGeos[0]);
                    if(!bucketMap) {
                        bucketMap = new Map<string, IMapAggregationBucket | null>();
                        bucketMaps.set(foundGeos[0], bucketMap);
                    }
                    // find the 'category' properties
                    foundCategories = categoryDimension ? mapData.getDataRecordValues(categoryDimension, data[i]) : [ "" ];
                    // since the data are flattened we can expect max one found item
                    if(foundCategories.length == 1) {
                        foundCategory = typeof foundCategories[0] === "string" ? foundCategories[0] : new String(foundCategories[0]).toString();
                        // get the aggregation bucket for the category or create a new one
                        aggregationBucket = bucketMap.get(foundCategory);
                        if(!aggregationBucket) {
                            aggregationBucket = aggregationDimension.getAggregationBucket();
                            bucketMap.set(foundCategory, aggregationBucket);
                        }
                        // find the 'value' properties
                        foundValues = valueDimension ? mapData.getDataRecordValues(valueDimension, data[i]) : [ 1 ];
                        // since the data are flattened we can expect max one found item
                        aggregationBucket.addValue(foundValues.length == 1 ? (typeof foundValues[0] == "number" ? foundValues[0] : 1) : 0);
                    }
                }
            }
        }

        // Check if Hierarchy is enabled in general and if its defined for that particular domain.
        if (geoManager.isHierarchyEnabled() && geoManager.isHierarchyEnabledForDomain(domainName)) {
            const active = geoManager.getActiveByTree(domainName);
            
            
            if (geoManager.treeAggregationFlag(domainName)) {
            // Iterate over active markers
                for (let cnt = 0; cnt < active.length; cnt++) {
                const activeGeo = active[cnt];
                // Get lowets childs of marker
                const childs = geoManager.getChildsFromTree(domainName, activeGeo);
                // Check if there are any childs, indicating if marker is leaf of tree or is a parent.
                if (childs.length > 0) {
                    // Create new Category Map
                    const categoryMap = new Map<string, IMapAggregationBucket | null>();
                    // Iterate over childs of marker.
                    for (let cnt1 = 0; cnt1 < childs.length; cnt1++) {     
                        const childAggregated = childs[cnt1];
                        const notAggregatedChildCategoryMap = bucketMaps.get(childAggregated);
                        if (notAggregatedChildCategoryMap) {
                            // Iterate over childs category map.
                            notAggregatedChildCategoryMap.forEach((categoryBucket, categoryName) => {
                                // Check if category map has already defined that category. 
                                if (categoryMap.has(categoryName)) {   
                                    const categoryAggrBucket = categoryMap.get(categoryName);
                                    const value = categoryBucket?.getValue();
                                    // Agregate value from already aggregated map, with non agregated value of child.
                                    if (aggregationDimension?.getName() === "count") {
                                        if (value) {
                                            for (let cntInner = 0; cntInner < value; cntInner++) {
                                                categoryAggrBucket?.addValue(1);
                                            }
                                        }
                                    } else {
                                        categoryAggrBucket?.addValue(typeof value === "number" ? value : 1);
                                    }

                                    if (categoryAggrBucket) {
                                        categoryMap.set(categoryName, categoryAggrBucket);
                                    }
                                }else {   
                                    // If category map does not have category bucekt yet, copy the bucket.
                                    // Since data would be agregated anyways, there is no need to make new bucket in first category iteration. 
                                    categoryMap.set(categoryName, categoryBucket);
                                }
                            });
                        }
                    }
                    bucketHierarchyMap.set(activeGeo, categoryMap);
                } else {    
                    // If marker is leaf of hierarchy tree, just copy his previous values.                               
                    if (bucketMaps.has(activeGeo)) {
                        const from = bucketMaps.get(activeGeo);
                        if (from) {
                            bucketHierarchyMap.set(activeGeo, from);
                        }
                    }
                }
                }    
            } else {
                bucketHierarchyMap = bucketMaps;
            }

            this.getState().setBucketData(bucketHierarchyMap);
            return bucketHierarchyMap;
        } else {
            this.getState().setBucketData(bucketMaps);
            return bucketMaps;
        }
    }

    /**
     * It creates markers using bucket data
     */
    protected createMarkers(): IMarker<IMarkerIcon<IMarkerIconOptions>>[] {
        // create markers
        const markers: IMarker<IMarkerIcon<IMarkerIconOptions>>[] = [];

        const bucketMaps: Map<string, Map<string, IMapAggregationBucket | null>> = this.getState().getBucketData();
        const layerGroup: L.LayerGroup | undefined = this.getState().getMarkerLayerGroup();
        const selectedIds: string[] | undefined = this.getSelectionTool()?.getSelection()?.getIds();
        const pointFeaturesOriginal : Feature[] | undefined = this.getState().getDimensions().geoData.getValue()?.getFeatures([ GeoJSONTypes.Point ]).features;

        // Hierarchy overload
        const geoManager = this.getState().getDimensions().geoData.getDomainManager() as GeoDataManager;
        const domainName = this.getState().getDimensions().geoData.getValue()?.getName() ?? "";
        let pointFeatures = geoManager.getFeatures(domainName, [  GeoJSONTypes.Point  ])?.features;

        // optimization
        if (!(geoManager.isHierarchyEnabled() && geoManager.isHierarchyEnabledForDomain(domainName))) {
            pointFeatures = pointFeaturesOriginal;
        }

        const geoDimension: IMapDataDomain | undefined = this.getState().getDimensions().geoId.getValue();

        // iterate over point features
        let pointFeature: Feature;
        let bucketMap: Map<string, IMapAggregationBucket | null> | undefined;
        let marker: IMarker<IMarkerIcon<IMarkerIconOptions>>;
        if(pointFeatures && geoDimension) {
            for(let i = 0; i < pointFeatures.length; i++) {
                pointFeature = pointFeatures[i];
                if(pointFeature.id) {
                    bucketMap = bucketMaps.get(pointFeature.id.toString());
                    if(bucketMap && (!selectedIds || selectedIds.includes(pointFeature.id.toString()))) {
                        // sort entries according to the keys
                        bucketMap = new Map([...bucketMap.entries()].sort());
                        // create marker
                        marker = this.createMarker(pointFeature, bucketMap);
                        layerGroup?.addLayer(marker);
                        markers.push(marker);
                    }
                }
            }
        }

        // updates bucket data
        this.getState().setMarkers(markers);

        return markers;
    }

    /**
     * It creates one marker with respect to the given GeoJSON point feature and data.
     * 
     * @param pointFeature 
     * @param data 
     */
    protected createMarker(pointFeature: Feature, bucketMap: Map<string, IMapAggregationBucket | null>): IMarker<IMarkerIcon<IMarkerIconOptions>> {
        // create icon
        const icon = this.getDefaults().getMarkerIcon({
            id: pointFeature.properties?.name,
            useDonut: this.getState().getDimensions().category.getValue() !== undefined,
            isGroup: false,
            values: createMarkerIconValueOptions(bucketMap),
            categories: this.getState().getCurrentDataCategories() ?? []
        });

        // create marker
        const coordinates = (pointFeature.geometry as Point).coordinates;
        const marker = this.getDefaults().getMarker([coordinates[0], coordinates[1]], {
            id: pointFeature.id?.toString() ?? "",
            name: pointFeature.properties?.name,
            icon: icon
        });

        // create popop
        marker.bindPopup(createPopupMessage(pointFeature.properties?.name ?? "", bucketMap));

        return marker;
    }
    
    /**
     * Help method which updates existing markers and applies animation options
     * 
     * @param animateOptions 
     */
    protected updateMarkers(animateOptions: IDataChangeAnimateOptions): void {
        const layerGroup = this.getState().getMarkerLayerGroup();
        if (layerGroup) {
            const bucketMaps: Map<string, Map<string, IMapAggregationBucket | null>> = this.getState().getBucketData();

            // modify existing markers stored in the tool state
            this.getState().getMarkers().forEach((marker: IMarker<IMarkerIcon<IMarkerIconOptions>>) => {
                const bucketData: Map<string, IMapAggregationBucket | null> = bucketMaps.get(marker.getOptions().id) ?? new Map<string, IMapAggregationBucket | null>();
                const markerIconValueOptions: IMarkerIconValueOptions = createMarkerIconValueOptions(bucketData);

                marker.getIcon().updateData(markerIconValueOptions, animateOptions);
                marker.getPopup()?.setContent(createPopupMessage(
                    marker.getOptions().name,
                    bucketData
                ));
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (layerGroup as any)._flagParentsIconsNeedUpdate([marker]);
            });

            // update cluster markers as well
            // TODO use piublic API
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (layerGroup as any)._featureGroup.eachLayer(function (marker: MarkerCluster) {
                if (marker instanceof MarkerCluster) {
                    const markers: Marker<IMarkerIcon<IMarkerIconOptions>>[] = marker.getAllChildMarkers() as Marker<IMarkerIcon<IMarkerIconOptions>>[];
                    const markerOptions: IMarkerIconOptions = createClusterMarkersData(markers);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (marker.getIcon() as any)._iconObj.updateData(markerOptions, animateOptions.transitionDuration, animateOptions.transitionDelay);
                }
            });
        }
        return;
    }

    /**
     * It updates the dimension.
     * 
     * @param dimension 
     * @param value 
     * @param redraw 
     */
    public updateDimension(dimension: IMapDomainDimension<IMapDomain>, value: string, redraw: number | undefined): void {
        if(!redraw) {
            const dimensions = this.getState().getDimensions();
            switch (dimension) {
                case dimensions.geoData:
                    redraw = LayerToolRenderType.LAYER;
                    break;
                case dimensions.geoId:
                case dimensions.value:
                case dimensions.category:
                case dimensions.aggregation:
                    redraw = LayerToolRenderType.DATA;
                    break;
                default:
                    redraw = LayerToolRenderType.STYLE;
                    break;
            }
        }
        super.updateDimension(dimension, value, redraw);
        this.getState().getMap()?.getState().getEventManager().scheduleEvent(
            new DimensionChangeEvent(this), undefined, undefined
        );
    }

    /**
     * It reloads data and redraw the layer.
     */
    public render(type: number, animateOptions?: IDataChangeAnimateOptions): void {
        switch (type) {
            case LayerToolRenderType.LAYER:
            case LayerToolRenderType.DATA:
                if(!animateOptions) {
                    this.updateCategoryValues(); 
                }
                this.updateData();
                if(animateOptions) {
                    this.updateMarkers(animateOptions); 
                } else {
                    this.deleteLayerItems();
                    this.createMarkers();
                }
                break;
            default:
                // update style
                // TODO
                //this.updateStyle();
                break;
        }
    }
    
    /**
     * Help function which updates the current category values based on map current data.
     * 
     * This should be called only when animated render is not required.
     */
    protected updateCategoryValues(): void {
        // if animation is not required, categories should be updated
        const dataDomain: IMapDataDomain | undefined = this.getState().getDimensions().category.getValue();
        const map = this.getMap();
        if(dataDomain && map) {
                this.getState().setCurrentDataCategories(map.getState().getMapData().getDataRecordsValues(
                    dataDomain, // category data domain
                    map.getState().getCurrentData() // of current data
                ).map((value: unknown) => new String(value).toString()) // map to string
            );
        }
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event 
     */
    public handleEvent(event: IMapEvent): void {
        switch (event.getType()) {
            case DataManagerChangeEvent.TYPE():
                this.render(LayerToolRenderType.DATA);
                break;
            case DataChangeEvent.TYPE():
                this.render(LayerToolRenderType.DATA, (<IMapDataChangeEvent> event).getAnimateOptions());
                break;
            case this.getSelectionTool()?.getChangeEventType():
                this.render(LayerToolRenderType.DATA);
                break;
            case this.getThemesTool()?.getChangeEventType():
                this.updateTheme((<IThemesToolEvent> event).getChangedObject());
                this.render(LayerToolRenderType.STYLE);
                break;
            case GeoDataChangeEvent.TYPE():
                this.render(LayerToolRenderType.DATA);
                break;
            default:
                break;
        }
    }

    /**
     * Help function which updates theme with respect to the Themes Tool API.
     * 
     * TODO: move to adapter
     * 
     * @param theme 
     */
    protected updateTheme(theme: IMapTheme): void {
        document.documentElement.style.setProperty('--leaflet-marker-donut1', theme.getDataColors().triadic1);
        document.documentElement.style.setProperty('--leaflet-marker-donut2', theme.getDataColors().triadic2);
        document.documentElement.style.setProperty('--leaflet-marker-donut3', theme.getDataColors().triadic3);
    }
}

export default MarkerLayerTool;
