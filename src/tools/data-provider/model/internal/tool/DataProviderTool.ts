// Geovisto core
import {
  IMapForm,
  IMapFormControl,
  IMapToolInitProps,
  MapTool,
} from "../../../../../index.core";

import IDataProviderTool from "../../types/tool/IDataProviderTool";
import IDataProviderToolConfig from "../../types/tool/IDataProviderToolConfig";
import IDataProviderToolDefaults from "../../types/tool/IDataProviderToolDefaults";
import IDataProviderToolProps from "../../types/tool/IDataProviderToolProps";
import IDataProviderToolState from "../../types/tool/IDataProviderToolState";
import DataProviderToolDefaults from "./DataProviderToolDefaults";
import DataProviderToolState from "./DataProviderToolState";
import DataProviderToolMapForm from "../form/DataProviderToolMapForm";

// styles
import "../../../styles/style.scss";
import {
  Geovisto,
  IGeoDataManager,
  IMap,
  IMapDataManager,
  IMapState,
} from "../../../../..";
import { IDataset } from "../../types/dataset/TDatasets";

/**
 * This class wraps together data provider, sidebar tab and its state.
 *
 * @author Petr Knetl
 */
class DataProviderTool
  extends MapTool
  implements IDataProviderTool, IMapFormControl
{
  private mapForm!: IMapForm;

  /**
   * It creates a new tool with respect to the props.
   *
   * @param props
   */
  public constructor(props?: IDataProviderToolProps) {
    super(props);
  }

  /**
   * It creates a copy of the uninitialized tool.
   */
  public copy(): IDataProviderTool {
    return new DataProviderTool(this.getProps());
  }

  /**
   * It returns the props given by the programmer.
   */
  public getProps(): IDataProviderToolProps {
    return <IDataProviderToolProps>super.getProps();
  }

  /**
   * It returns default values of the data provider tool.
   */
  public getDefaults(): IDataProviderToolDefaults {
    return <IDataProviderToolDefaults>super.getDefaults();
  }

  /**
   * It creates new defaults of the tool.
   */
  public createDefaults(): IDataProviderToolDefaults {
    return new DataProviderToolDefaults();
  }

  /**
   * It returns the data provider tool state.
   */
  public getState(): IDataProviderToolState {
    return <IDataProviderToolState>super.getState();
  }

  /**
   * It returns default tool state.
   */
  public createState(): IDataProviderToolState {
    return new DataProviderToolState(this);
  }

  /**
   * Overrides the super method.
   *
   * @param initProps
   */
  public initialize(
    initProps: IMapToolInitProps<IDataProviderToolConfig>
  ): this {
    return super.initialize(initProps);
  }

  /**
   * It creates new data provider tool.
   */
  public create(): this {
    return this;
  }

  /**
   * It returns a map form.
   */
  public getMapForm(): IMapForm {
    if (this.mapForm == undefined) {
      this.mapForm = this.createMapForm();
    }
    return this.mapForm;
  }

  /**
   * It creates new map form.
   */
  protected createMapForm(): IMapForm {
    return new DataProviderToolMapForm(this);
  }

  /**
   * Set dataset downloaded from data connector to internal map state.
   * @param dataset geospatial data
   */
  public importDatasetToMapState(dataset: IDataset) {
    const map: IMap = this.getMap()!;
    const mapState: IMapState = map.getState()!;

    const dataManager: IMapDataManager =
      Geovisto.getMapDataManagerFactory().json(dataset.data);
    const geoDataManager: IGeoDataManager = Geovisto.getGeoDataManager([
      Geovisto.getGeoDataFactory().geojson("Polygons", dataset.geometry),
      Geovisto.getGeoDataFactory().geojson("Centroids", dataset.centroids),
    ]);
    const props = {
      ...map.getProps(),
      data: dataManager,
      geoData: geoDataManager,
    };

    /** !!! FIXME : redraw should be triggered through an event manager listening to change of MapDataManager and GeoDataManager.
     *  The event and it's listenere was under developement at the moment of this commit.
     *  Please, change this to correct implementation through Map events when the. Thank you.
     */
    map.redraw(mapState.getMapConfig(), props);
  }
}
export default DataProviderTool;
