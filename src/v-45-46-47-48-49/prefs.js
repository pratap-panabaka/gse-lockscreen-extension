import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import PickFolder from './utils/pickFolder.js';

export default class LockscreenExtensionPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        window.set_default_size(800, 600);

        let page = new Adw.PreferencesPage();

        let buttonHideGroup = new Adw.PreferencesGroup({title: 'Hide lockscreen-extension button from lockscreen'});
        page.add(buttonHideGroup);

        let hideButton = new Adw.SwitchRow({
            title: 'Hide lockscreen-extension button',
        });
        buttonHideGroup.add(hideButton);

        let selectFolderGroup = new Adw.PreferencesGroup({
            title: 'Select Custom Folder',
            description: 'Image files from this folder will be picked and show you at lockscreen. You can choose background image from there.',
        });
        page.add(selectFolderGroup);

        selectFolderGroup.add(new PickFolder(window._settings).addFolderUrl());

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
        window._settings.bind('hide-lockscreen-extension-button', hideButton, 'active', Gio.SettingsBindFlags.DEFAULT);

        window.add(page);
    }
}
