import IMapDomainArrayManager from "../../../../../model/types/domain/IMapDomainArrayManager";
import IMapDataDomain from "../../../../../model/types/data/IMapDataDomain";
import IMapFilterOperation from "./IMapFilterOperation";
import IMapFilterRule from "./IMapFilterRule";
import IMapDataManager from "../../../../../model/types/data/IMapDataManager";
import IMapData from "../../../../../model/types/data/IMapData";

/**
 * This interface declares functions for using filters.
 * 
 * @author Jiri Hynek
 */
interface IMapFiltersManager extends IMapDomainArrayManager<IMapFilterOperation> {

    /**
     * The function creates a new filter rule using given operation label.
     * 
     * @param dataDomain 
     * @param opName 
     * @param pattern 
     */
    createRule(dataDomain: IMapDataDomain, opName: string, pattern: string): IMapFilterRule | null;

    /**
     * Takes a list of data and applies the given filter rules.
     * Returns a new list of the references to filtered data items.
     * 
     * TODO: define data records type
     * 
     * @param dataManager 
     * @param dataRecords 
     * @param filterRules 
     */
    filterData(dataManager: IMapDataManager, dataRecords: IMapData, filterRules: IMapFilterRule[]): IMapData;
}
export default IMapFiltersManager;