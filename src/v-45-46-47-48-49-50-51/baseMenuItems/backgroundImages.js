import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import updateOrnament from '../utils/updateOrnament.js';
import getBackgrounds from '../utils/getBackgrounds.js';

const DESKTOP_BACKGROUND = 'Use Whatever My Desktop Background Image Is';

const backgroundImages = async (lockscreenExt, n) => {
    const userSelectedFolder = lockscreenExt._settings.get_string('backgrounds-folder-path') || '';

    const localShare = lockscreenExt._settings.get_boolean('local-share-backgrounds-folder-path')
        ? `${GLib.get_user_data_dir()}/backgrounds` : '';

    const usrLocalShare = lockscreenExt._settings.get_boolean('usr-local-share-backgrounds-folder-path')
        ? '/usr/local/share/backgrounds' : '';

    const usrShare = lockscreenExt._settings.get_boolean('usr-share-backgrounds-folder-path')
        ? '/usr/share/backgrounds' : '';

    let paths = [userSelectedFolder, localShare, usrLocalShare, usrShare];

    const backgrounds = await getBackgrounds(paths);

    let items = createBackgroundPathItems(backgrounds, lockscreenExt, n);

    const text = lockscreenExt._settings.get_string(`background-image-path-${n}`);
    const userBackground = lockscreenExt._settings.get_boolean(`user-background-${n}`);
    updateOrnament(items, userBackground ? DESKTOP_BACKGROUND : text);

    return items;
};

const createBackgroundPathItems = (backgrounds, lockscreenExt, n) => {
    let items = [];

    // Add System Background Item
    let desktopBackgroundItem = new PopupMenu.PopupMenuItem(DESKTOP_BACKGROUND);
    items.push(desktopBackgroundItem);

    desktopBackgroundItem.connect('activate', () => {
        lockscreenExt._settings.set_boolean(`user-background-${n}`, true);
        updateOrnament(items, DESKTOP_BACKGROUND);
        lockscreenExt._settings.set_string(`gradient-direction-${n}`, 'none');
        updateOrnament(lockscreenExt._catchGradientDirection, 'none');
    });

    //
    backgrounds.forEach(backgroundName => {
        const backgroundNameItem = new PopupMenu.PopupImageMenuItem(backgroundName, Gio.icon_new_for_string(backgroundName));
        backgroundNameItem._icon.set_icon_size(96);
        items.push(backgroundNameItem);

        backgroundNameItem.connect('activate', () => {
            lockscreenExt._settings.set_boolean(`user-background-${n}`, false);
            lockscreenExt._settings.set_string(`background-image-path-${n}`, backgroundName);
            lockscreenExt._settings.set_string(`gradient-direction-${n}`, 'none');
            updateOrnament(items, backgroundName);
            updateOrnament(lockscreenExt._catchGradientDirection, 'none');
        });
    });

    return items;
};

export default backgroundImages;
