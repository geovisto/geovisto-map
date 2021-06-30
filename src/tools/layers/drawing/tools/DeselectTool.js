import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';

class DeselectTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'deselect-drawing-tool';
  }

  getName(): string {
    return DeselectTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-star-half-o';
  }

  getTitle(): string {
    return 'Deselect tool';
  }

  result = (): string => {
    return '';
  };

  enable = (): void => {
    const selected = this.getSelectedEl();

    if (selected?.editing?._enabled) {
      selected.editing.disable();
    }
    if (selected) {
      this.drawingTool.normalizeElement(selected);
      this.drawingTool.initNodeEdit(true);
      this.drawingTool.getState().clearSelectedLayer();
      this._redrawSidebar();
      document.querySelector('.leaflet-container').style.cursor = '';
    }
  };
}

export default DeselectTool;
