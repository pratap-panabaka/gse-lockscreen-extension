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

import GetBackgrounds from '../getNamesAsync/getBackgrounds.js';
import blurRadius from '../baseMenuItems/blurRadius.js';
import blurBrightness from '../baseMenuItems/blurBrightness.js';
import { primaryColor, useSystemPrimaryColor } from '../baseMenuItems/primaryColor.js';
import { secondaryColor, useSystemSecondaryColor } from '../baseMenuItems/secondaryColor.js';
import gradientDirection from '../baseMenuItems/gradientDirection.js';

const subMenuMonitorBackgrounds = (lockscreenExt, n) => {
    lockscreenExt._menu = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    setBackgrounds(lockscreenExt, n);

    return lockscreenExt._menu
}

const setBackgrounds = async (lockscreenExt, n) => {
    const item = lockscreenExt._menu;

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // primary color
    const pColor = primaryColor(lockscreenExt, n);
    section.addMenuItem(pColor);
    section.addMenuItem(useSystemPrimaryColor(lockscreenExt, n));
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // secondary color
    const sColor = secondaryColor(lockscreenExt, n);
    section.addMenuItem(sColor);
    section.addMenuItem(useSystemSecondaryColor(lockscreenExt, n));
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // blur radius
    const bRadius = blurRadius(lockscreenExt, n);
    section.addMenuItem(bRadius);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // blur brightness
    const bBrightness = blurBrightness(lockscreenExt, n);
    section.addMenuItem(bBrightness);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // gradient direction
    const gDirection = gradientDirection(lockscreenExt, n);
    gDirection.forEach(item => {
        section.addMenuItem(item);
    })
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    if (GNOME_SHELL_VERSION === 45)
        scrollView.add_actor(section.actor);
    else
        scrollView.add_child(section.actor);

    item.menu.box.add_child(scrollView);

    const object = new GetBackgrounds();
    const BACKGROUNDS = await object._collectBackgrounds();

    const collectBackgrounds = backgrounds => {
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

            section.addMenuItem(backgroundNameItem);

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

    const backgroundItems = collectBackgrounds(BACKGROUNDS);
    const text = lockscreenExt._settings.get_string(`background-image-path-${n}`);
    const userBackground = lockscreenExt._settings.get_boolean(`user-background-${n}`);
    updateOrnament(backgroundItems, userBackground ? "Use Systems" : text);
}

export default subMenuMonitorBackgrounds;