import IMapObjectState from "../../types/object/IMapObjectState";
import IMapObjectDefaults from "../../types/object/IMapObjectDefaults";
import IMapObjectProps from "../../types/object/IMapObjectProps";
import IMapObjectConfig from "../../types/object/IMapObjectConfig";
import IMapObject from "../../types/object/IMapObject";

/**
 * This class manages state of the tool.
 * It wraps the state since the tool can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class AbstractMapObjectState implements IMapObjectState {
    
    private mapObject: IMapObject;

    private type: string;
    private id: string;

    /**
     * It creates a map object state.
     */
    public constructor(mapObject : IMapObject) {
        this.mapObject = mapObject;

        // sets the type of the object (can be set only once in constructor)
        this.type = (this.getDefaults().getType());

        // set the id of the object (can be set only once in constructor)
        this.id = (this.getProps().id != undefined ? this.getDefaults().getId() : ((String) (this.getProps().id)));
    }

    /**
     * It makes the map object visible to extended classes.
     */
    protected getMapObject(): IMapObject {
        return this.mapObject;
    }

    /**
     * It makes the props visible to extended classes.
     */
    protected getProps(): IMapObjectProps {
        return this.mapObject.getProps();
    }

    /**
     * It makes the defaults visible to extended classes.
     */
    protected getDefaults(): IMapObjectDefaults {
        return this.mapObject.getDefaults();
    }

    /**
     * It resets the state to the initial props.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public reset(): void {
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config : IMapObjectConfig) : void {
        if(config.id != undefined) this.setId(config.id);
    }

    /**
     * The method serializes the tool state. Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param filterDefaults 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public serialize(filterDefaults : boolean | undefined): IMapObjectConfig {
        return {
            type: this.getType(),
            id: this.getId(),
        };
    }

    /**
     * It returns the type property of the tool state.
     */
    public getType() : string {
        return this.type;
    }

    /**
     * It returns the id property of the tool state.
     */
    public getId() : string {
        return this.id;
    }

    /**
     * It sets the id property of the tool state.
     * 
     * @param id 
     */
    public setId(id : string): void {
       this.id = id;
    }
}
export default AbstractMapObjectState;