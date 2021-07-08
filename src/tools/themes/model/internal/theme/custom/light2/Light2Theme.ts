import BasicTheme from '../../basic/BasicTheme';
import IMapTheme from '../../../../types/theme/IMapTheme';

import './style.scss';

/**
 * This class defines a custom theme.
 * 
 * @author Jiri Hynek
 */
class Light2Theme extends BasicTheme implements IMapTheme {

    /**
     * It initializes the light theme.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "light2";
    }
}
export default Light2Theme;