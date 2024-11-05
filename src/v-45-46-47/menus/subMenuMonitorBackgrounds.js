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
import backgroundImages from '../baseMenuItems/backgroundImages.js';

const subMenuMonitorBackgrounds = (lockscreenExt, n) => {
    lockscreenExt._menu = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    setBackgrounds(lockscreenExt, n);

    return lockscreenExt._menu
}

const setBackgrounds = async (lockscreenExt, n) => {
    const item = lockscreenExt._menu;

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

    if (GNOME_SHELL_VERSION === 45)
        scrollView.add_actor(section.actor);
    else
        scrollView.add_child(section.actor);

    item.menu.box.add_child(scrollView);

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

    // gradient direction
    lockscreenExt._catchGradientDirection = [];
    const gDirection = gradientDirection(lockscreenExt, n, lockscreenExt._catchGradientDirection);
    gDirection.forEach(item => {
        section.addMenuItem(item);
    })
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

    // background images
    const backgrounds = backgroundImages(lockscreenExt, n);
    backgrounds.forEach(item => {
        section.addMenuItem(item);
    })
}

export default subMenuMonitorBackgrounds;