const { Clutter, GObject, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const { subMenuMonitorBackgrounds } = Me.imports.menus.subMenuMonitorBackgrounds;
const { hideExtensionButton } = Me.imports.buttons.hideExtensionButton;

var LockscreenExt = GObject.registerClass(
    class LockscreenExt extends PanelMenu.Button {
        _init() {
            super._init(0.0, 'lockscreen-extension indicator');

            this._box = new St.BoxLayout();
            this.add_child(this._box);

            this._box.add_child(new St.Icon({
                icon_name: 'preferences-system-symbolic',
                style_class: 'system-status-icon',
            }));

            this._box.add_child(new St.Label({ text: "lockscreen-extension", y_align: Clutter.ActorAlign.CENTER }));

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

