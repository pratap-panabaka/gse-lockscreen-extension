import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from "resource://org/gnome/shell/ui/main.js";

import updateOrnament from '../utils/updateOrnament.js';

const gradientDirection = (lockscreenExt, n) => {

    let items = [];

    let forTitle = new PopupMenu.PopupMenuItem("Gradient Direction");
    items.push(forTitle);

    let keys = ["none", "horizontal", "vertical"];
    let dconfKey = `gradient-direction-${n}`

    keys.forEach(key => {
        const item = new PopupMenu.PopupMenuItem(key);
        items.push(item);
        // if (catchArray) {
        //     catchArray.push(item);
        // }

        // item.connect('activate', () => {
        //     lockscreenExt._settings.set_string(dconfKey, key)
        //     updateOrnament(items, key)
        // })
    })

    updateOrnament(items, lockscreenExt._settings.get_string(dconfKey));

    Main.notify('hello', JSON.stringify(items));

    return items;
}

export default gradientDirection;