import { ILayerToolProps } from "../../../../../../index.core";
import IHeatLayerToolDimensions from "./IHeatLayerToolDimensions";

type IHeatLayerToolProps = ILayerToolProps & {
    dimensions?: IHeatLayerToolDimensions;
};

export default IHeatLayerToolProps;
