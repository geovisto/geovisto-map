import MapChangeEvent from "../generic/MapChangeEvent";
import IMapObject from "../../../types/object/IMapObject";
import IMapChangeEvent from "../../../types/event/IMapChangeEvent";
import IMapData from "../../../types/data/IMapData";

/**
 * This class provides the data change event object.
 * 
 * TODO: define type of the data
 * 
 * @author Jiri Hynek
 */
class DataChangeEvent<TSource extends IMapObject> extends MapChangeEvent<TSource, IMapData> implements IMapChangeEvent {

    /**
     * It initializes event.
     */
    public constructor(source: TSource, data: IMapData) {
        super(DataChangeEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "data-change-event";
    }
}
export default DataChangeEvent;