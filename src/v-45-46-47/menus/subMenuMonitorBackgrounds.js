import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as AnimationUtils from 'resource:///org/gnome/shell/misc/animationUtils.js';

import GNOME_SHELL_VERSION from '../utils/shellVersion.js';

import blurRadius from '../baseMenuItems/blurRadius.js';
import blurBrightness from '../baseMenuItems/blurBrightness.js';
import {primaryColor, useSystemPrimaryColor} from '../baseMenuItems/primaryColor.js';
import {secondaryColor, useSystemSecondaryColor} from '../baseMenuItems/secondaryColor.js';
import gradientDirection from '../baseMenuItems/gradientDirection.js';
import backgroundImages from '../baseMenuItems/backgroundImages.js';
import imageSize from '../baseMenuItems/imageSize.js';

const subMenuMonitorBackgrounds = (lockscreenExt, n) => {
    lockscreenExt._menu = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    lockscreenExt._menu._catchItems = [];
    setBackgrounds(lockscreenExt, n);

    return lockscreenExt._menu;
};

const setBackgrounds = async (lockscreenExt, n) => {
    const menu = lockscreenExt._menu;

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

    if (GNOME_SHELL_VERSION === 45)
        scrollView.add_actor(section.actor);
    else
        scrollView.add_child(section.actor);

    menu.menu.box.add_child(scrollView);

    const catchItems = []; // catch items for adding visibility in scroll view

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // primary color
    const pColor = primaryColor(lockscreenExt, n);
    section.addMenuItem(pColor);

    const sPColor = useSystemPrimaryColor(lockscreenExt, n);
    section.addMenuItem(sPColor);

    catchItems.push(pColor, sPColor);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // secondary color
    const sColor = secondaryColor(lockscreenExt, n);
    section.addMenuItem(sColor);

    const sSColor = useSystemSecondaryColor(lockscreenExt, n);
    section.addMenuItem(sSColor);

    catchItems.push(sColor, sSColor);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // gradient direction
    lockscreenExt._catchGradientDirection = [];
    const gDirection = gradientDirection(lockscreenExt, n, lockscreenExt._catchGradientDirection);
    gDirection.forEach(direction => {
        section.addMenuItem(direction);
        catchItems.push(direction);
    });
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // gradient direction
    const iSize = imageSize(lockscreenExt, n);
    iSize.forEach(direction => {
        section.addMenuItem(direction);
        catchItems.push(direction);
    });
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // blur radius
    const bRadius = blurRadius(lockscreenExt, n);
    section.addMenuItem(bRadius);
    catchItems.push(bRadius);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // blur brightness
    const bBrightness = blurBrightness(lockscreenExt, n);
    section.addMenuItem(bBrightness);
    catchItems.push(bBrightness);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // background images
    let forTitle = new PopupMenu.PopupMenuItem('Background Images', {can_focus: false});
    section.addMenuItem(forTitle);

    const backgrounds = await backgroundImages(lockscreenExt, n);
    backgrounds.forEach(bg => {
        section.addMenuItem(bg);
        bg.connect('key-focus-in', () => {
            AnimationUtils.ensureActorVisibleInScrollView(scrollView, bg);
        });
    });

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // set actor visible in scroll view
    catchItems.forEach(item => {
        item.connect('key-focus-in', () => {
            AnimationUtils.ensureActorVisibleInScrollView(scrollView, item);
        });
    });
};

export default subMenuMonitorBackgrounds;
