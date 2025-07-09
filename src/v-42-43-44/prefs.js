const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;

function init() {
}

function buildPrefsWidget() {
    let widget = new PrefsWidget();
    return widget.widget;
}

class CreateButton {
    constructor(label, key) {
        this._label = label;
        this._key = key;
    }

    _createButton() {
        this._settings = ExtensionUtils.getSettings();
        const hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
        const buttonLabel = new Gtk.Label({label: this._label, xalign: 0, hexpand: true});
        const toggleSwitch = new Gtk.Switch({active: this._settings.get_boolean(this._key)});
        toggleSwitch.connect('notify::active', button => {
            this._settings.set_boolean(this._key, button.active);
        });

        hbox.append(buttonLabel);
        hbox.append(toggleSwitch);

        return hbox;
    }
}

class PrefsWidget {
    constructor() {
        this.gsettings = ExtensionUtils.getSettings();

        this.widget = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_top: 10,
            margin_bottom: 10,
            margin_start: 10,
            margin_end: 10,
        });

        this.vbox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_top: 0,
            hexpand: true,
        });
        this.vbox.set_size_request(550, 650);

        this.vbox.append(new Gtk.Separator({orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));

        this.vbox.append(this.addPictureUrl());

        this.vbox.append(new Gtk.Separator({orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));

        let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
        let settingLabel = new Gtk.Label({label: 'Select wheather to pick images from below folders', xalign: 0, hexpand: true});
        hbox.append(settingLabel);

        this.vbox.append(hbox);

        this.vbox.append(new Gtk.Separator({orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));

        this.vbox.append(new CreateButton(`${GLib.get_user_data_dir()}/backgrounds`, 'local-share-backgrounds-folder-path')._createButton());

        this.vbox.append(new Gtk.Separator({orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));
        this.vbox.append(new CreateButton('/usr/local/share/backgrounds', 'usr-local-share-backgrounds-folder-path')._createButton());

        this.vbox.append(new Gtk.Separator({orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));
        this.vbox.append(new CreateButton('/usr/share/backgrounds', 'usr-share-backgrounds-folder-path')._createButton());

        this.vbox.append(new Gtk.Separator({orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));

        this.widget.append(this.vbox);
    }

    addPictureUrl() {
        let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
        let settingLabel = new Gtk.Label({label: 'Select Custom Folder', xalign: 0, hexpand: true});
        this.setting_entry = new Gtk.Entry({hexpand: true, margin_start: 20});
        this.setting_entry.set_placeholder_text('/home/username/myWallpapers');

        this.setting_entry.set_text(this.gsettings.get_string('backgrounds-folder-path'));
        this.setting_entry.connect('changed', entry => {
            this.gsettings.set_string('backgrounds-folder-path', entry.get_text());
        });

        this.fileChooseButton = new Gtk.Button({margin_start: 5});
        this.fileChooseButton.set_label('Browse');
        this.fileChooseButton.connect('clicked', this.showFileChooserDialog.bind(this));

        hbox.append(settingLabel);
        hbox.append(this.setting_entry);
        hbox.append(this.fileChooseButton);

        return hbox;
    }

    showFileChooserDialog() {
        let fileChooser = new Gtk.FileChooserDialog({title: 'Select Folder'});
        fileChooser.set_transient_for(this.widget.get_root());
        fileChooser.set_default_response(1);
        fileChooser.set_action(2);

        fileChooser.add_button('Open', Gtk.ResponseType.ACCEPT);

        fileChooser.connect('response', (dialog, response) => {
            if (response === Gtk.ResponseType.ACCEPT) {
                let file = dialog.get_file().get_path();
                if (file.length > 0)
                    this.setting_entry.set_text(file);
                fileChooser.destroy();
            }
        });

        fileChooser.show();
    }
}
