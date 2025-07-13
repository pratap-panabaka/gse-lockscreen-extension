const {Adw, GLib, Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;

function init() { }

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

class FileChooserWidget {
    constructor(settings) {
        this._gsettings = settings;

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

        this.vbox.append(this.addPictureUrl());
        this.widget.append(this.vbox);
    }

    addPictureUrl() {
        let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
        let settingLabel = new Gtk.Label({label: 'Select Custom Folder', xalign: 0, hexpand: true});
        this.setting_entry = new Gtk.Entry({hexpand: true, margin_start: 20});
        this.setting_entry.set_placeholder_text('/home/username/myWallpapers');

        this.setting_entry.set_text(this._gsettings.get_string('backgrounds-folder-path'));
        this.setting_entry.connect('changed', entry => {
            this._gsettings.set_string('backgrounds-folder-path', entry.get_text());
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

class ToggleFoldersWidget {
    constructor(settings) {
        this._gsettings = settings;

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

        this.vbox.append(new CreateButton(`${GLib.get_user_data_dir()}/backgrounds`, 'local-share-backgrounds-folder-path')._createButton());

        this.vbox.append(new CreateButton('/usr/local/share/backgrounds', 'usr-local-share-backgrounds-folder-path')._createButton());

        this.vbox.append(new CreateButton('/usr/share/backgrounds', 'usr-share-backgrounds-folder-path')._createButton());

        this.widget.append(this.vbox);
    }
}

function fillPreferencesWindow(window) {
    window._settings = ExtensionUtils.getSettings();

    window.set_default_size(800, 600);
    window.search_enabled = true;

    let page = new Adw.PreferencesPage();

    let group = new Adw.PreferencesGroup({title: 'Here, please configure the custom folder, to pick the image files.'});
    let widget = new FileChooserWidget(window._settings);
    group.add(widget.widget);

    let toggleGroup = new Adw.PreferencesGroup({title: 'Select wheather to pick images from below folders'});
    let toogleWidget = new ToggleFoldersWidget(window._settings);
    toggleGroup.add(toogleWidget.widget);

    let hintGroup = new Adw.PreferencesGroup({title: 'Hint'});
    hintGroup.add(new Gtk.Label({label: 'Once you configure the folders, those folders will be scanned for image files and show you on lockscreen to select one.', xalign: 0, hexpand: true}));

    page.add(group);
    page.add(toggleGroup);
    page.add(hintGroup);

    window.add(page);
}
