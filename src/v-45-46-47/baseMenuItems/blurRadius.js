import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import Slider from '../utils/slider.js';

const blurRadius = (lockscreenExt, n) => {
    const item = new PopupMenu.PopupBaseMenuItem();

    item.add_child(new St.Label({ text: 'Blur Radius 0 to 100', y_align: Clutter.ActorAlign.CENTER }));
    item.add_child(new Slider(lockscreenExt._settings, `blur-radius-${n}`));

    return item;
}

export default blurRadius;