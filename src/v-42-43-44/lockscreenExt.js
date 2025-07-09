const {Clutter, GObject, St} = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const {hideExtensionButton} = Me.imports.buttons.hideExtensionButton;
const {lockscreenExtMenu} = Me.imports.menus.lockscreenExtensionMenu;

var LockscreenExt = GObject.registerClass(
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
