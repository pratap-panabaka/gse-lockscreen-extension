/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import St from 'gi://St';
import Gio from 'gi://Gio';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension, InjectionManager} from 'resource:///org/gnome/shell/extensions/extension.js';
import LockscreenExt from './lockscreenExt.js';
import getDesktopBackground from './utils/getDesktopBackground.js';

export default class LockscreenExtension extends Extension {
    enable() {
        this._settings = this.getSettings();

        this._systemBgSettings = new Gio.Settings({schema_id: 'org.gnome.desktop.background'});

        // for disconnecting signals
        this._keys = this._settings.list_keys();
        this._keys.forEach(key => {
            this[`_${key}_changedId`] = null;
        });
        this._systemBgChangedId = null;
        //

        this._indicator = null;

        this._onSessionModeChanged(Main.sessionMode);

        this._onVisibilityChange(); // show the extension settings icon on Admin decision

        this._connectionSettings(); // trigger setting changes

        this._injectionManager = new InjectionManager();

        // override _createBackground method
        this._injectionManager.overrideMethod(Main.screenShield._dialog, '_createBackground',
            () => {
                return monitorIndex => {
                    const n = monitorIndex + 1;
                    let themeContext = St.ThemeContext.get_for_stage(global.stage);

                    let blurRadius = this._settings.get_int(`blur-radius-${n}`);
                    let blurBrightness = this._settings.get_double(`blur-brightness-${n}`);

                    let blurEffect = {
                        name: 'lockscreen-extension-blur',
                        radius: blurRadius * themeContext.scale_factor,
                        brightness: blurBrightness,
                    };

                    let userBackground = this._settings.get_boolean(`user-background-${n}`);
                    let imagePath = userBackground ? getDesktopBackground() : this._settings.get_string(`background-image-path-${n}`);
                    let file = Gio.file_new_for_uri(imagePath);
                    let isPathExists = file.query_exists(null);

                    let monitor = Main.layoutManager.monitors[monitorIndex];

                    let widget = new St.Widget({
                        style: `
                        background-color: ${this._settings.get_string(`primary-color-${n}`)};
                        background-gradient-direction: ${this._settings.get_string(`gradient-direction-${n}`)};
                        background-gradient-start: ${this._settings.get_string(`primary-color-${n}`)};
                        background-gradient-end: ${this._settings.get_string(`secondary-color-${n}`)};
                        background-image: ${isPathExists ? `url(${imagePath})` : 'none'};
                        background-size: ${this._settings.get_string(`background-size-${n}`)};
                        `,
                        x: monitor.x,
                        y: monitor.y,
                        width: monitor.width,
                        height: monitor.height,
                        effect: new Shell.BlurEffect(blurEffect),
                    });

                    Main.screenShield._dialog._backgroundGroup.add_child(widget);
                };
            });

        if (Main.screenShield._dialog)
            Main.screenShield._dialog._updateBackgrounds();
    }

    _onChangesFromLockScreen() {
        if (Main.screenShield._dialog)
            Main.screenShield._dialog._updateBackgrounds();
    }

    _callMonitorConnectionSettings(n) {
        [
            `primary-color-${n}`,
            `gradient-direction-${n}`,
            `secondary-color-${n}`,
            `background-image-path-${n}`,
            `background-size-${n}`,
            `blur-radius-${n}`,
            `blur-brightness-${n}`,
            `user-background-${n}`,
        ]
            .forEach(key => {
                this[`_${key}_changedId`] = this._settings.connect(`changed::${key}`, this._onChangesFromLockScreen.bind(this));
            });
    }

    _connectionSettings() {
        let nMonitors = Main.layoutManager.monitors.length;
        nMonitors = nMonitors > 4 ? 4 : nMonitors;
        let n = 1;
        while (nMonitors > 0) {
            switch (n) {
            case 1:
                this._callMonitorConnectionSettings(n);
                break;
            case 2:
                this._callMonitorConnectionSettings(n);
                break;
            case 3:
                this._callMonitorConnectionSettings(n);
                break;
            case 4:
                this._callMonitorConnectionSettings(n);
                break;
            default:
                break;
            }
            n += 1;
            nMonitors -= 1;
        }

        let key = 'hide-lockscreen-extension-button';
        this[`_${key}_changedId`] = this._settings.connect(`changed::${key}`, this._onVisibilityChange.bind(this));
        if (!this._systemBgChangedId)
            this._systemBgChangedId = this._systemBgSettings.connect('changed::picture-uri', this._onChangesFromLockScreen.bind(this));
    }

    _disconnectSignals() {
        this._keys.forEach(key => {
            if (this[`_${key}_changedId`]) {
                this._settings.disconnect(this[`_${key}_changedId`]);
                this[`_${key}_changedId`] = null;
            }
        });
        this._keys = null;

        // systemBgChangeSignal
        if (this._systemBgChangedId) {
            this._systemBgSettings.disconnect(this._systemBgChangedId);
            this._systemBgChangedId = null;
        }
    }

    _onVisibilityChange() {
        if (this._settings.get_boolean('hide-lockscreen-extension-button'))
            this._indicator.hide();
        else
            this._indicator.show();
    }

    _addIndicator() {
        if (this._indicator === null) {
            this._indicator = new LockscreenExt(this._settings); // Gnome Lockscreen Extension button
            Main.panel.addToStatusArea(this.uuid, this._indicator, 0, 'left'); // Added to panel left
        }
    }

    _removeIndicator() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }

    _onSessionModeChanged(session) {
        if (session.currentMode === 'unlock-dialog')
            this._addIndicator();
        else if (session.currentMode === 'user' || session.parentMode === 'user')
            this._removeIndicator();
    }

    disable() {
        // This extension runs only on ["unlock-dialog"] session mode.
        // This extension purpose is to configure gnome-lockscreen for background and colors.
        // User can hide the extension indicator once he configure the background and thus there will not be any UI on lock screen.

        this._injectionManager.clear(); // clear override method
        this._injectionManager = null;

        this._disconnectSignals(); // disconnect signals

        this._removeIndicator(); // gnome-lockscreen-extension destroy and nullify
    }
}
