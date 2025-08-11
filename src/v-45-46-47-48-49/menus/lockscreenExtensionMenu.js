import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as AnimationUtils from 'resource:///org/gnome/shell/misc/animationUtils.js';

import GNOME_SHELL_VERSION from '../utils/shellVersion.js';

import gradientDirection from '../baseMenuItems/gradientDirection.js';
import backgroundImages from '../baseMenuItems/backgroundImages.js';
import imageSize from '../baseMenuItems/imageSize.js';
import primaryColor from '../baseMenuItems/primaryColor.js';
import secondaryColor from '../baseMenuItems/secondaryColor.js';
import bRadius from '../baseMenuItems/bRadius.js';
import bBrightness from '../baseMenuItems/bBrightness.js';

const lockscreenExtMenu = (lockscreenExt, n) => {
    const menu = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    menu._catchItems = [];
    setBackgrounds(lockscreenExt, n, menu);

    return menu;
};

const setBackgrounds = async (lockscreenExt, n, menu) => {
    const catchItems = []; // catch items for adding visibility in scroll view

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

    if (GNOME_SHELL_VERSION === 45)
        scrollView.add_actor(section.actor);
    else
        scrollView.add_child(section.actor);

    menu.menu.box.add_child(scrollView);

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('Primary Color')); //

    // primary color
    const pColor = primaryColor(lockscreenExt, n);
    section.addMenuItem(pColor);

    catchItems.push(pColor);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('Secondary Color')); //

    // secondary color
    const sColor = secondaryColor(lockscreenExt, n);
    section.addMenuItem(sColor);

    catchItems.push(sColor);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('Gradient Direction')); //

    // gradient direction
    lockscreenExt._catchGradientDirection = [];
    const gDirection = gradientDirection(lockscreenExt, n, lockscreenExt._catchGradientDirection);
    gDirection.forEach(direction => {
        section.addMenuItem(direction);
        catchItems.push(direction);
    });
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('Background Size')); //

    // imaze size
    const iSize = imageSize(lockscreenExt, n);
    iSize.forEach(direction => {
        section.addMenuItem(direction);
        catchItems.push(direction);
    });
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('Blur Radius | 0 to 100')); //

    // blur radius
    const blurRadius = bRadius(lockscreenExt, n);
    section.addMenuItem(blurRadius);
    catchItems.push(blurRadius);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('Blur Brightness | 0.00 to 1.00 | applicable only when blur radius > 0')); //

    // blur brightness
    const blurBrightness = bBrightness(lockscreenExt, n);
    section.addMenuItem(blurBrightness);
    catchItems.push(blurBrightness);
    //

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('Backgroud Images')); //
    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem(
        `(Note that
        If you are using third party apps or scripts or .xml file
        for dynamically changing the desktop bg's at an interval of x seconds,
        below option only works if third party apps
        [such as https://github.com/varietywalls/variety] or scripts
        sets the desktop bg with gsettings with path to image.
        .xml files will not work.)`
    ));

    // background images
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

export default lockscreenExtMenu;
