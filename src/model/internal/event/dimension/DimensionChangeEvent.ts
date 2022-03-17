import IMapObject from "../../../types/object/IMapObject";
import MapEvent from "../generic/MapEvent";

/**
 * This class provides the dimension change event object.
 * 
 * @author Tomas Koscielniak
 */
class DimensionChangeEvent<TSource extends IMapObject> extends MapEvent<TSource> {
    
    /**
     * It initializes event.
     */
    public constructor(source: TSource) {
        super(DimensionChangeEvent.TYPE(), source);
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "dimension-change-event";
    }
}
export default DimensionChangeEvent;