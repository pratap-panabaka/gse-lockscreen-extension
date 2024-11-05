import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as AnimationUtils from 'resource:///org/gnome/shell/misc/animationUtils.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import createActor from '../utils/createActor.js';
import createMenuItem from '../utils/createMenuItem.js';
import updateOrnament from '../utils/updateOrnament.js';
import Slider from '../utils/slider.js';
import GNOME_SHELL_VERSION from '../utils/shellVersion.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import GetBackgrounds from '../utils/getBackgrounds.js';
import blurRadius from '../baseMenuItems/blurRadius.js';
import blurBrightness from '../baseMenuItems/blurBrightness.js';
import { primaryColor, useSystemPrimaryColor } from '../baseMenuItems/primaryColor.js';
import { secondaryColor, useSystemSecondaryColor } from '../baseMenuItems/secondaryColor.js';
import gradientDirection from '../baseMenuItems/gradientDirection.js';
import getBackgrounds from '../utils/getBackgrounds.js';

const backgroundImages = async (lockscreenExt, n) => {
    const backgrounds = await getBackgrounds();
    let items = createBackgroundPathItems(backgrounds, lockscreenExt, n);

    const text = lockscreenExt._settings.get_string(`background-image-path-${n}`);
    const userBackground = lockscreenExt._settings.get_boolean(`user-background-${n}`);
    updateOrnament(items, userBackground ? "Use Systems" : text);

    return items;
}

const createBackgroundPathItems = (backgrounds, lockscreenExt, n) => {
    let _items = [];

    // Add System Background Item
    let userBackgroundItem = new PopupMenu.PopupMenuItem('Use Systems');
    _items.push(userBackgroundItem);

    userBackgroundItem.connect('key-focus-in', () => {
        AnimationUtils.ensureActorVisibleInScrollView(scrollView, userBackgroundItem);
    });

    userBackgroundItem.connect('activate', () => {
        lockscreenExt._settings.set_boolean(`user-background-${n}`, true);
        lockscreenExt._settings.set_string(`gradient-direction-${n}`, 'none');
        updateOrnament(lockscreenExt._catchGradientDirection, 'none');
        updateOrnament(backgroundItems, 'Use Systems');
    });

    //
    backgrounds.forEach(backgroundName => {
        const backgroundNameItem = new PopupMenu.PopupMenuItem(backgroundName);
        _items.push(backgroundNameItem);

        backgroundNameItem.connect('key-focus-in', () => {
            AnimationUtils.ensureActorVisibleInScrollView(scrollView, backgroundNameItem);
        });

        backgroundNameItem.connect('activate', () => {
            lockscreenExt._settings.set_boolean(`user-background-${n}`, false);
            lockscreenExt._settings.set_string(`background-image-path-${n}`, backgroundName);
            lockscreenExt._settings.set_string(`gradient-direction-${n}`, 'none')
            updateOrnament(backgroundItems, backgroundName);
            updateOrnament(lockscreenExt._catchGradientDirection, 'none');
        });
    });

    return _items;
};

export default backgroundImages;
