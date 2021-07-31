import { LayerType, LooseObject } from './../../model/types/index';
import L, { MarkerOptions } from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { AbstractTool } from '../AbstractTool';
import { iconStarter } from '../../util/constants';
import { ToolProps } from '../AbstractTool/types';
import { TMarkerTool } from './types';

declare module 'leaflet' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Draw {
    class ExtendedMarker extends Marker {
      setIconOptions(opts: LooseObject): void;
    }
  }
}

/**
 * @author Andrej Tlcina
 */

/**
 * extends marker so we can change its options while marker tool is enabled
 */
L.Draw.ExtendedMarker = L.Draw.Marker.extend({
  setIconOptions: function (iconOpts: LooseObject) {
    this.options.icon = iconOpts;
  },
});

class MarkerTool extends AbstractTool implements TMarkerTool {
  static result = 'marker';

  constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return 'marker-drawing-tool';
  }

  public getName(): string {
    return MarkerTool.NAME();
  }

  public getIconName(): string {
    return 'fa fa-map-marker';
  }

  public getTitle(): string {
    return 'Marker drawing tool';
  }

  public result = (): LayerType | '' => {
    return 'marker';
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  public _markerCreate = (connectClick = false): void => {
    const additionalOpts = { iconUrl: this.sidebar.getState().getSelectedIcon(), connectClick };
    const icon = new L.Icon({ ...iconStarter, ...additionalOpts });
    const { guideLayers } = this.sidebar.getState();

    this.tool = new L.Draw.ExtendedMarker(this.leafletMap, {
      icon,
      draggable: true,
      transform: true,
      repeatMode: true,
      guideLayers,
      snapVertices: false,
    } as MarkerOptions);
    this.tool.enable();
  };

  public enable = (): void => {
    this._markerCreate();
  };
}

export default MarkerTool;