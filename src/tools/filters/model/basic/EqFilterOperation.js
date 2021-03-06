import AbstractFilterOperation from "../abstract/AbstractFilterOperation";

/**
 * This class wraps the equals filter operation.
 * 
 * @author Jiri Hynek
 */
class EqFilterOperation extends AbstractFilterOperation {

    constructor() {
        super();
    }

    /**
     * It returns the string label of the filter representing operator.
     */
    toString() {
        return "==";
    }

    /**
     * It checks if value equals pattern.
     * 
     * @param {any} value 
     * @param {any} pattern 
     */
    match(value, pattern) {
        return value == pattern;
    }
}
export default EqFilterOperation;