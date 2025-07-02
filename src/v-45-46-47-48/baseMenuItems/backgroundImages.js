import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import updateOrnament from '../utils/updateOrnament.js';
import getBackgrounds from '../utils/getBackgrounds.js';

const systemBackground = 'Use Systems Background Image';

const backgroundImages = async (lockscreenExt, n) => {
    const backgrounds = await getBackgrounds();
    let items = createBackgroundPathItems(backgrounds, lockscreenExt, n);

    const text = lockscreenExt._settings.get_string(`background-image-path-${n}`);
    const userBackground = lockscreenExt._settings.get_boolean(`user-background-${n}`);
    updateOrnament(items, userBackground ? systemBackground : text);

    return items;
};

const createBackgroundPathItems = (backgrounds, lockscreenExt, n) => {
    let items = [];

    // Add System Background Item
    let systemBackgroundItem = new PopupMenu.PopupMenuItem(systemBackground);
    items.push(systemBackgroundItem);

    systemBackgroundItem.connect('activate', () => {
        lockscreenExt._settings.set_boolean(`user-background-${n}`, true);
        updateOrnament(items, systemBackground);
        lockscreenExt._settings.set_string(`gradient-direction-${n}`, 'none');
        updateOrnament(lockscreenExt._catchGradientDirection, 'none');
    });

    //
    backgrounds.forEach(backgroundName => {
        const backgroundNameItem = new PopupMenu.PopupMenuItem(backgroundName);
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
