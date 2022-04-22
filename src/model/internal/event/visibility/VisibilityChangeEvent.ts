import IMapObject from "../../../types/object/IMapObject";
import MapEvent from "../generic/MapEvent";

/**
 * This class provides the visibility change event object.
 * 
 * @author Tomas Koscielniak
 */
class VisibilityChangeEvent<TSource extends IMapObject> extends MapEvent<TSource> {

    protected static visibility: boolean;
    protected static source: IMapObject;

    /**
     * It initializes event.
     */
    public constructor(source: TSource, visibility: boolean) {
        super(VisibilityChangeEvent.TYPE(), source);
        VisibilityChangeEvent.setVisibility(visibility);
        VisibilityChangeEvent.setSource(source);
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "visibility-change-event";
    }

    /**
     * Assign visibility.
     */
    public static setVisibility(visibility: boolean): void {
        this.visibility = visibility;
    }

    /**
     * Assign source.
     */
    public static setSource(source: IMapObject): void {
        this.source = source;
    }

    /**
     * It returns visibility
     */
    public static getVisibility(): boolean {
        return this.visibility;
    }

    /**
     * It returns source
     */
    public static getSource(): IMapObject {
        return this.source;
    }
}
export default VisibilityChangeEvent;