import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import subMenuMonitorBackgrounds from './menus/subMenuMonitorBackgrounds.js';

import hideExtensionButton from './buttons/hideExtensionButton.js';

const LockscreenExt = GObject.registerClass(
    class LockscreenExt extends PanelMenu.Button {
        _init(settings) {
            super._init(0.0, 'Gnome Lockscreen Settings Icon Indicator');
            this._settings = settings;

            this._box = new St.BoxLayout();
            this.add_child(this._box);

            this._box.add_child(new St.Icon({
                icon_name: 'preferences-system-symbolic',
                style_class: 'system-status-icon',
            }));

            this._customLabel = "Lockscreen Extension";
            this._box.add_child(new St.Label({ text: this._customLabel, y_align: Clutter.ActorAlign.CENTER }));

            this._subMenuMonitorBackgrounds();  // Monitor background settings

            const generateHideExtensionButton = hideExtensionButton(this);
            this.menu.addMenuItem(generateHideExtensionButton); // Extension Hide Button
        }

        _subMenuMonitorBackgrounds() {
            let nMonitors = Main.layoutManager.monitors.length;
            nMonitors = nMonitors > 4 ? 4 : nMonitors;
            let n = 1;
            while (nMonitors > 0) {
                const generateMonitorBackgrounds = subMenuMonitorBackgrounds(this, n);
                this.menu.addMenuItem(generateMonitorBackgrounds); // Add per Monitor background settings
                n += 1;
                nMonitors -= 1;
            }
        }
    }
);

export default LockscreenExt;