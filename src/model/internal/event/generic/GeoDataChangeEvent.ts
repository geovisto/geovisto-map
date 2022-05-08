import { IMapTool, MapChangeEvent } from "../../../../index.core";
import IGeoDataChangeEvent from "../../../types/event/IGeoDataChangeEvent";

/**
 *  This class provides event, dispatched in case of geo data change.
 */
class GeoDataChangeEvent extends MapChangeEvent<IMapTool, null> implements IGeoDataChangeEvent {
        // Constructor
        public constructor(Tool: IMapTool) {
            super(GeoDataChangeEvent.TYPE(), Tool, null);
        }

        public static TYPE(): string {
            return "geo-data-change-event";
        }
}

export default GeoDataChangeEvent;