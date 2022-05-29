import { MapDomain } from '../../../../../../index.core';

import IInfoData from "../../../types/infodata/IInfoData";

/**
 * The interface declares function for management of info data.
 *
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
class MarkDownData extends MapDomain implements IInfoData {

    private originalData: unknown;
    private MarkDown?: string;

    public constructor(name: string, originalData: unknown) {
        super(name);
        this.originalData = originalData;
    }

    /**
     * It returns the original source of info data.
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
     * It transforms original data to a string with data to be rendered
     *
     * @param originalData
     * @returns string
     */
    protected validateData(originalData: unknown): unknown {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (originalData as any).default;
    }
}
export default MarkDownData;