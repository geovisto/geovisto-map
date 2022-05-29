import { IMapToolConfig } from "../../../../../index.core";

export type IHierarchyRelation = {
    id: string;
    zoomLevel: number;
    parent?: string;
}

export type IHierarchyConfig = {
    name : string,
    aggregation : boolean,
    hierarchy : IHierarchyRelation[];
}

/**
 * Type for hierarchy configuration.
 * @author Vojtěch Malý
 */
export type IHierarchyToolConfig = IMapToolConfig & {
    hierarchies?: IHierarchyConfig[]
};