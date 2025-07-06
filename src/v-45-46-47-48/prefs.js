import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

class PrefsWidget {
    constructor(settings) {
        this.gsettings = settings;

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

        this.vbox.append(this.banner());
        this.vbox.append(new Gtk.Separator({orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));
        this.vbox.append(this.addPictureUrl());
        this.vbox.append(this.chooseFolders());

        this.widget.append(this.vbox);
    }

    banner() {
        const bannerGroup = new Adw.PreferencesGroup();

        let banner = new Adw.Banner({
            title: `Hi ${GLib.get_real_name()}, Here, please configure the folders to pick the image files to show. The folders you configure here will be scanned for images and show you on lockscreen for you to select one as a lockscreen background.`,
            revealed: true,
            'use-markup': true,
        });

        bannerGroup.add(banner);

        return bannerGroup;
    }

    addPictureUrl() {
        const folderGroup = new Adw.PreferencesGroup({
            title: 'Select folder from which background images to be fetched',
        });

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

        folderGroup.add(hbox);

        return folderGroup;
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

    chooseFolders() {
        const hideButtonsGroup = new Adw.PreferencesGroup({
            title: 'Get backgrounds from below folders',
        });

        const local = new Adw.SwitchRow({
            title: `${GLib.get_user_data_dir()}/backgrounds`,
        });
        hideButtonsGroup.add(local);

        const usrLocal = new Adw.SwitchRow({
            title: '/usr/local/share/backgrounds',
        });
        hideButtonsGroup.add(usrLocal);

        const usr = new Adw.SwitchRow({
            title: '/usr/share/backgrounds',
        });
        hideButtonsGroup.add(usr);

        this.gsettings.bind('local-share-backgrounds-folder-path', local, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.gsettings.bind('usr-local-share-backgrounds-folder-path', usrLocal, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.gsettings.bind('usr-share-backgrounds-folder-path', usr, 'active', Gio.SettingsBindFlags.DEFAULT);

        return hideButtonsGroup;
    }
}

export default class LockscreenExtensionPrefs extends ExtensionPreferences {
    getPreferencesWidget() {
        let widget = new PrefsWidget(this.getSettings());
        return widget.widget;
    }
}
