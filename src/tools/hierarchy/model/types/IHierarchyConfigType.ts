import { IMapToolConfig } from "../../../../index.core";

/**
 * Type for hierarchy configuration.
 * @author Vojtěch Malý
 */
type HierarchyConfigurationType = IMapToolConfig & {
    HierarchyConfig? :{
        name : string,
        aggregation : boolean,
        hierarchy : {
            id: string;
            zoomLevel: number;
            parent?: string;
        }[]
    }[]
};

export default HierarchyConfigurationType;