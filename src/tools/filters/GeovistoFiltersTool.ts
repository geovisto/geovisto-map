// Geovisto core
import {
  EqFilterOperation,
  IMapFilterManager,
  IMapFilterOperation,
  MapFiltersManager,
  NeqFilterOperation,
  RegFilterOperation
} from "../../index.core";

import IFiltersTool from "./model/types/tool/IFiltersTool";
import IFiltersToolProps from "./model/types/tool/IFiltersToolProps";
import FiltersTool from "./model/internal/tool/FiltersTool";
import FiltersToolDefaults from "./model/internal/tool/FiltersToolDefaults";


export const GeovistoFiltersTool: {
  getType: () => string;
  createTool: (props?: IFiltersToolProps) => IFiltersTool;
  createFiltersManager: (
    filterOperations: IMapFilterOperation[]
  ) => IMapFilterManager;
  createFilterOperationEq: () => IMapFilterOperation;
  createFilterOperationNeq: () => IMapFilterOperation;
  createFilterOperationReg: () => IMapFilterOperation;
} = {
  getType: () => FiltersToolDefaults.TYPE,
  createTool: (props) => new FiltersTool(props),
  createFiltersManager: (filterOperations) =>
    new MapFiltersManager(filterOperations),
  createFilterOperationEq: () => new EqFilterOperation(),
  createFilterOperationNeq: () => new NeqFilterOperation(),
  createFilterOperationReg: () => new RegFilterOperation(),
};
