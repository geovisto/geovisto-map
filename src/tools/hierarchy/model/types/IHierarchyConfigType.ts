import { IMapToolConfig } from "../../../../index.core";

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