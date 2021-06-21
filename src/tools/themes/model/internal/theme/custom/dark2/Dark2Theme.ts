import BasicTheme from '../../basic/BasicTheme';
import IMapTheme from '../../../../types/theme/IMapTheme';

import './style.scss';

/**
 * This class defines a custom theme.
 * 
 * @author Jiri Hynek
 */
class Dark2Theme extends BasicTheme implements IMapTheme {

    /**
     * It initializes the dark theme.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "dark2";
    }

    /**
     * This theme prefers dark colors.
     */
    public isDark(): boolean {
        return true;
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): string {
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png';
    }
}
export default Dark2Theme;