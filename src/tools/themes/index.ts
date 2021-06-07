import { 
    IThemesToolProps,
    IThemesTool,
    ThemesTool,
    IMapTheme,
    IMapThemesManager,
    MapThemesManager,
    Light1Theme,
    Light2Theme,
    Light3Theme
} from '.';
import { Dark1Theme, Dark2Theme, Dark3Theme } from '..';

export const GeovistoThemesTool: {
    getType: () => string,
    createTool: (props: IThemesToolProps | undefined) => IThemesTool,
    createThemesManager: (filterOperations: IMapTheme[]) => IMapThemesManager,
    createThemeLight1: () => IMapTheme,
    createThemeLight2: () => IMapTheme,
    createThemeLight3: () => IMapTheme,
    createThemeDark1: () => IMapTheme,
    createThemeDark2: () => IMapTheme,
    createThemeDark3: () => IMapTheme
} = {
    getType: () => "geovisto-tool-themes",
    createTool: (props) => new ThemesTool(props),
    createThemesManager: (filterOperations) => new MapThemesManager(filterOperations),
    createThemeLight1: () => new Light1Theme(),
    createThemeLight2: () => new Light2Theme(),
    createThemeLight3: () => new Light3Theme(),
    createThemeDark1: () => new Dark1Theme(),
    createThemeDark2: () => new Dark2Theme(),
    createThemeDark3: () => new Dark3Theme()
};

// types
export type { default as IThemesToolEvent } from './model/types/event/IThemesToolEvent';
export type { default as IMapTheme } from './model/types/theme/IMapTheme';
export type { default as IMapThemesManager } from './model/types/theme/IMapThemesManager';
export type { default as IThemesTool } from './model/types/tool/IThemesTool';
export type { default as IThemesToolConfig } from './model/types/tool/IThemesToolConfig';
export type { default as IThemesToolDefaults } from './model/types/tool/IThemesToolDefaults';
export type { default as IThemesToolProps } from './model/types/tool/IThemesToolProps';
export type { default as IThemesToolState } from './model/types/tool/IThemesToolState';

// internal
export { default as ThemesToolEvent } from './model/internal/event/ThemesToolEvent';
export { default as ThemesToolSidebarFragment } from './model/internal/sidebar/ThemesToolSidebarFragment';
export { default as BasicTheme } from './model/internal/theme/basic/BasicTheme';
export { default as MapThemesManager } from './model/internal/theme/basic/MapThemesManager';
export { default as Dark1Theme } from './model/internal/theme/custom/dark1/Dark1Theme';
export { default as Dark2Theme } from './model/internal/theme/custom/dark2/Dark2Theme';
export { default as Dark3Theme } from './model/internal/theme/custom/dark3/Dark3Theme';
export { default as Light1Theme } from './model/internal/theme/custom/light1/Light1Theme';
export { default as Light2Theme } from './model/internal/theme/custom/light2/Light2Theme';
export { default as Light3Theme } from './model/internal/theme/custom/light3/Light3Theme';
export { default as ThemesTool } from './model/internal/tool/ThemesTool';
export { default as ThemesToolDefaults } from './model/internal/tool/ThemesToolDefaults';
export { default as ThemesToolState } from './model/internal/tool/ThemesToolState';
