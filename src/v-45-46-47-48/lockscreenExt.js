import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import hideExtensionButton from './buttons/hideExtensionButton.js';
import lockscreenExtMenu from './menus/lockscreenExtensionMenu.js';

const LockscreenExt = GObject.registerClass(
    class LockscreenExt extends PanelMenu.Button {
        _init(settings) {
            super._init(0.0, 'lockscreen-extension indicator');
            this._settings = settings;

            this._box = new St.BoxLayout();
            this.add_child(this._box);

            this._box.add_child(new St.Icon({
                icon_name: 'preferences-system-symbolic',
                style_class: 'system-status-icon',
            }));

            this._box.add_child(new St.Label({text: 'lockscreen-extension', y_align: Clutter.ActorAlign.CENTER}));

            this._createMenu();  // Things happen here for the purpose of lockscreen customization

            const generateHideExtensionButton = hideExtensionButton(this);
            this.menu.addMenuItem(generateHideExtensionButton); // Extension Hide Button
        }

        _createMenu() {
            let nMonitors = Main.layoutManager.monitors.length;
            nMonitors = nMonitors > 4 ? 4 : nMonitors;
            let n = 1;
            while (nMonitors > 0) {
                const subMenu = lockscreenExtMenu(this, n);
                this.menu.addMenuItem(subMenu); // Add per Monitor background settings
                n += 1;
                nMonitors -= 1;
            }
        }
    }
);

export default LockscreenExt;
