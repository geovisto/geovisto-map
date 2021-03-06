import IMapObjectConfig from "./IMapObjectConfig";

/**
 * This class manages state of a map object.
 * It wraps the state since the map object can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface IMapObjectState {

    /**
     * It resets the state to the initial props. Optionally, defaults can be set if property is undefined.
     */
    reset(): void;

    /**
     * The metod takes config and desrializes the values.
     * 
     * @param {IMapObjectConfig} config 
     */
    deserialize(config: IMapObjectConfig): void;

    /**
     * The method serializes the map object state. Optionally, a serialed value can be let undefined if it equals the default value.
     * 
     * @param {boolean} filterDefaults 
     */
    serialize(filterDefaults: boolean | undefined): IMapObjectConfig;

    /**
     * It returns the type property of the map object state.
     */
    getType(): string;

    /**
     * It returns the id property of the map object state.
     */
    getId(): string;

    /**
     * It sets the id property of the map object state.
     * It can be set only once.
     * 
     * @param {string} id 
     */
    setId(id: string): void;
}
export default IMapObjectState;
