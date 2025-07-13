import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

class PrefsWidget {
    constructor(settings) {
        this._gsettings = settings;
    }

    banner() {
        this._banner = new Adw.Banner({
            title: `Hi ${GLib.get_real_name()}, Here, please configure the folders to pick the image files to show. The folders you configure here will be scanned for images and show you on lockscreen for you to select one as a lockscreen background.`,
            revealed: true,
            'use-markup': false,
        });

        return this._banner;
    }

    addPictureUrl() {
        this._entryRow = new Adw.EntryRow();

        this._entryRow.set_text(this._gsettings.get_string('backgrounds-folder-path'));
        this._entryRow.connect('changed', entry => {
            this._gsettings.set_string('backgrounds-folder-path', entry.get_text());
        });

        return this._entryRow;
    }

    addButton() {
        this._fileChooseButton = new Adw.ButtonRow({title: 'Browse Folder'});
        this._fileChooseButton.connect('activated', this.showFileChooserDialog.bind(this));

        return this._fileChooseButton;
    }

    showFileChooserDialog() {
        this._fileChooser = new Gtk.FileDialog({title: 'Select Folder'});
        this._fileChooser.select_folder(null, null, (dialog, result) => {
            this.onSelectFolderFinish(dialog, result);
        }, null);
    }

    onSelectFolderFinish(dialog, result) {
        try {
            const folder = dialog.select_folder_finish(result);
            if (folder)
                this._entryRow.set_text(folder.get_path());
            else
                console.log('No folder selected.');
        } catch (e) {
            console.log(`Error selecting folder: ${e}`);
        } finally {
            dialog.destroy();
        }
    }
}

export default class LockscreenExtensionPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        window.set_default_size(800, 600);
        window.search_enabled = true;

        let page = new Adw.PreferencesPage();

        let widget = new PrefsWidget(window._settings);

        let bannerGroup = new Adw.PreferencesGroup({title: 'Hint'});
        bannerGroup.add(widget.banner());

        page.add(bannerGroup);

        let selectFolderGroup = new Adw.PreferencesGroup({title: 'Select Custom Folder'});
        page.add(selectFolderGroup);

        selectFolderGroup.add(widget.addPictureUrl());
        selectFolderGroup.add(widget.addButton());

        let group = new Adw.PreferencesGroup({title: 'Get backgrounds from below folders'});
        page.add(group);

        const local = new Adw.SwitchRow({
            title: `${GLib.get_user_data_dir()}/backgrounds`,
        });
        group.add(local);

        const usrLocal = new Adw.SwitchRow({
            title: '/usr/local/share/backgrounds',
        });
        group.add(usrLocal);

        const usr = new Adw.SwitchRow({
            title: '/usr/share/backgrounds',
        });
        group.add(usr);

        window._settings.bind('local-share-backgrounds-folder-path', local, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('usr-local-share-backgrounds-folder-path', usrLocal, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('usr-share-backgrounds-folder-path', usr, 'active', Gio.SettingsBindFlags.DEFAULT);

        window.add(page);
    }
}
