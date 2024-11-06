import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import Slider from '../utils/slider.js';

const blurBrightness = (lockscreenExt, n) => {
    const item = new PopupMenu.PopupBaseMenuItem();
    item.add_child(new St.Label({text: 'Blur Brightness 0 to 1', y_align: Clutter.ActorAlign.CENTER}));
    item.add_child(new Slider(lockscreenExt._settings, `blur-brightness-${n}`));

    return item;
};

export default blurBrightness;
