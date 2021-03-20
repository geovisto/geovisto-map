// external libs
import L from 'leaflet';
import "leaflet-sidebar-v2";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";

// styles
import "./styles/style.scss";

import SidebarToolState from "./SidebarToolState";
import SidebarToolDefaults from "./SidebarToolDefaults";
import AbstractTool from "../../model/tool/abstract/AbstractTool";
import ThemesToolEvent from '../themes/model/event/ThemesToolEvent';


/**
 * This class provides the sidebar tool.
 *
 * @author Jiri Hynek
 */
class SidebarTool extends AbstractTool {

    /**
     * It creates a new tool with respect to the props.
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-sidebar";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new SidebarTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new SidebarToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new SidebarToolState();
    }

    /**
     * It creates sidebar.
     */
    create() {
        super.create();
        this.createSidebar();
        this.createTabs();
        return this;
    }

    createSidebar() {
        if(this.isEnabled()) {
            let sidebar = undefined;
            // create sidebar control and add it to the map
            sidebar = L.control.sidebar(this.getSidebarStructure()).addTo(this.getMap().getState().getLeafletMap());
            // update state
            this.getState().setSidebar(sidebar);
        }
    }

    /**
     * It returns structure of sidebar defined with respect to the leaflet-sidebar-v2 plugin specification.
     *
     * See: https://github.com/noerw/leaflet-sidebar-v2
     */
    getSidebarStructure() {
        return {
            autopan: false,
            closeButton: true,
            //container: 'sidebar'
            position: 'left',
        };
    }

    /**
     * It returns sidebar tabs.
     */
    getTabs() {
        let tabs = this.getState().getTabs();
        if(tabs == undefined) {
            this.createTabs();
        }

        return tabs;
    }

    /**
     * It returns sidebar tabs.
     */
    createTabs() {
        // import tabs
        if(this.getState().getTabsDescriptions() != undefined) {
            let tabsConfigs = this.getState().getTabsDescriptions();
            // based on config
            let tabConfig, tool;
            for(let i = 0; i < tabsConfigs.length; i++) {
                tabConfig = tabsConfigs[i];
                tool = this.getMap().getState().getTools().getById(tabConfig.tool);
                this.createSidebarTab(tool, tabConfig);
            }
        } else {
            // based on the implicit order of the tools in the list of the tools
            let tools = this.getMap().getState().getTools().getObjects();
            for(let i = 0; i < tools.length; i++) {
                this.createSidebarTab(tools[i], undefined);
            }
        }
    }

        /**
     * This function is called when a custom event is invoked.
     * 
     * @param {AbstractEvent} event 
     */
    handleEvent(event) {
        if(event.getType() == ThemesToolEvent.TYPE()) {            
            var map = event.getObject()
            document.documentElement.style.setProperty('--leaflet-sidebar-primary-bg', map.getBackgroundColors().primary);
            document.documentElement.style.setProperty('--leaflet-sidebar-primary-fg', map.getForegroundColors().primary);            
            document.documentElement.style.setProperty('--leaflet-sidebar-secondary-bg', map.getBackgroundColors().secondary);
            document.documentElement.style.setProperty('--leaflet-sidebar-secondary-fg', map.getForegroundColors().secondary);
            document.documentElement.style.setProperty('--leaflet-sidebar-disabled-bg', map.getBackgroundColors().disabled);
            document.documentElement.style.setProperty('--leaflet-sidebar-disabled-fg', map.getForegroundColors().disabled);

            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-bg', map.getTextInputColor().matchBg);            
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-fg', map.getTextInputColor().matchFg);
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-notmatch-bg', map.getTextInputColor().notMatchBg);
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-notmatch-fg', map.getTextInputColor().notMatchFg);
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-placeholder', map.getTextInputColor().placeholder);            
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-hover', map.getTextInputColor().hover);            
        }
    }

    /**
     * Help function which initializes and creates sidebar tab for a tool with respect to a given config.
     *
     * @param {*} tool
     * @param {*} config
     */
    createSidebarTab(tool, config) {
        if(tool != undefined && tool.getSidebarTabControl) {
            // the tool implements the getSidebarTab function
            let sidebarTabControl = tool.getSidebarTabControl();
            if(sidebarTabControl != undefined) {
                // render sidebar
                sidebarTabControl.initialize(this.getState().getSidebar(), config);
                sidebarTabControl.create();
                // update state
                this.getState().addTab(sidebarTabControl);
            }
        }
    }

}
export default SidebarTool;
