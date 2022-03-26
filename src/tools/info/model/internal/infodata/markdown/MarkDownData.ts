import {MapDomain} from '../../../../../../index.core';
import IInfoData from "../../../types/infodata/IInfoData";

/**
 * The interface declares function for management of geographical data.
 *
 * @author Jiri Hynek
 */
class MarkDownData extends MapDomain implements IInfoData {

    private originalData: unknown;
    private MarkDown?: string;

    public constructor(name: string, originalData: unknown) {
        super(name);
        this.originalData = originalData;
    }

    /**
     * It returns the original source of geographical data.
     */
    public getOriginalInfoData(): unknown {
        return this.originalData;
    }

    /**
     * It returns the original representation of data domain.
     */
    public getInfoMD(): string {
        if(!this.MarkDown) {
            this.MarkDown = <string>this.validateData(this.originalData);
        }
        return this.MarkDown;
    }


    /**
     * It transforms original data to a feature collection in the GeoJSON format.
     *
     * @param originalData
     * @returns GeoJSON feature collection
     */
    protected validateData(originalData: unknown): unknown {
        return originalData.default;
    }
}
export default MarkDownData;