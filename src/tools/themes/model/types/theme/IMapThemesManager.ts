import IMapDomainArrayManager from "../../../../../model/types/domain/IMapDomainArrayManager";
import IMapTheme from "./IMapTheme";

/**
 * This interface declares a manager for using themes.
 * 
 * @author Jiri Hynek
 */
interface IMapThemesManager extends IMapDomainArrayManager<IMapTheme> {

    /**
     * It returns the default theme.
     */
    getDefault(): IMapTheme | undefined;
    
}
export default IMapThemesManager;