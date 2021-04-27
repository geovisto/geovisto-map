import { IChoroplethLayerToolProps, IChoroplethLayerTool, ChoroplethLayerTool } from '../..';

export const GeovistoChoroplethLayerTool: {
    getType: () => string,
    createTool: (props: IChoroplethLayerToolProps | undefined) => IChoroplethLayerTool
} = {
    getType: () => "geovisto-tool-layer-choropleth",
    createTool: (props) => new ChoroplethLayerTool(props),
};

// types
export type { default as IChoroplethLayerTool } from './model/types/tool/IChoroplethLayerTool';
export type { default as IChoroplethLayerToolConfig } from './model/types/tool/IChoroplethLayerToolConfig';
export type { default as IChoroplethLayerToolDefaults } from './model/types/tool/IChoroplethLayerToolDefaults';
export type { default as IChoroplethLayerToolDimensions } from './model/types/tool/IChoroplethLayerToolDimensions';
export type { default as IChoroplethLayerToolProps } from './model/types/tool/IChoroplethLayerToolProps';
export type { default as IChoroplethLayerToolState } from './model/types/tool/IChoroplethLayerToolState';

// internal
export { default as ChoroplethLayerToolSidebarTab } from './model/internal/sidebar/ChoroplethLayerToolSidebarTab';
export { default as ChoroplethLayerToolSidebarTabDefaults } from './model/internal/sidebar/ChoroplethLayerToolSidebarTabDefaults';
export { default as ChoroplethLayerTool } from './model/internal/tool/ChoroplethLayerTool';
export { default as ChoroplethLayerToolDefaults } from './model/internal/tool/ChoroplethLayerToolDefaults';
export { default as ChoroplethLayerToolState } from './model/internal/tool/ChoroplethLayerToolState';