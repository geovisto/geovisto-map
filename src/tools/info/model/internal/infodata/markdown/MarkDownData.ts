import { MapDomain } from '../../../../../../index.core';

import IInfoData from "../../../types/infodata/IInfoData";

/**
 * The interface declares function for management of info data.
 *
 * @author Jiri Hynek
 * @author Tomas Koscielniak
 */
class MarkDownData extends MapDomain implements IInfoData {

    private originalData: string;
    private MarkDown?: string;

    public constructor(name: string, originalData: string) {
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
            this.MarkDown = this.originalData;
        }
        return this.MarkDown;
    }
}
export default MarkDownData;