import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as AnimationUtils from 'resource:///org/gnome/shell/misc/animationUtils.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import createActor from '../utils/createActor.js';
import createMenuItem from '../utils/createMenuItem.js';
import updateOrnament from '../utils/updateOrnament.js';
import Slider from '../utils/slider.js';
import GNOME_SHELL_VERSION from '../utils/shellVersion.js';

import GetBackgrounds from '../getNamesAsync/getBackgrounds.js';

const subMenuMonitorBackgrounds = (lockscreenExt, n) => {
    lockscreenExt._subMenuMenuItemMonitorBackground = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    createBackgroundPrefs(lockscreenExt, n);
    setBackgrounds(lockscreenExt, n);

    return lockscreenExt._subMenuMenuItemMonitorBackground;
}

let menuItem = null;

const createBackgroundPrefs = (lockscreenExt, n) => {
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(createActor(lockscreenExt._settings, 'Background Color/Gradient Start Color', '#123456', `background-color-${n}`, 'primary', 'Must be a valid color'));
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(createActor(lockscreenExt._settings, 'Gradient End Color', '#456789', `background-gradient-end-color-${n}`, 'secondary', 'Must be a valid color or same as above color'));

    lockscreenExt._catchGradientDirection = [];
    const gradientDirectionMenuItem = createMenuItem('Gradient Direction', ['none', 'horizontal', 'vertical'], lockscreenExt._settings, `background-gradient-direction-${n}`, lockscreenExt._catchGradientDirection)
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(gradientDirectionMenuItem);

    const backgroundSizeMenuItem = createMenuItem('Background size', ['center', 'cover', 'contain'], lockscreenExt._settings, `background-size-${n}`);
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(backgroundSizeMenuItem);

    // Blur Radius
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Radius 0 to 100', y_align: Clutter.ActorAlign.CENTER }));
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(new Slider(lockscreenExt._settings, `blur-radius-${n}`));
    //

    // Blur Brightness
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Brightness 0 to 1 (Only applicable if Blur Radius is > 0)', y_align: Clutter.ActorAlign.CENTER }));
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(new Slider(lockscreenExt._settings, `blur-brightness-${n}`));
    //
}

const setBackgrounds = async (lockscreenExt, n) => {
    const item = lockscreenExt._subMenuMenuItemMonitorBackground;

    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Backgrounds', y_align: Clutter.ActorAlign.CENTER }));
    item.menu.box.add_child(menuItem);

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

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
        const userBackgroundItem = new PopupMenu.PopupMenuItem('Use Systems');
        userBackgroundItem.label.set_style("background: green; padding: 8px; font-weight: bold");
        _items.push(userBackgroundItem);

        userBackgroundItem.connect('key-focus-in', () => {
            AnimationUtils.ensureActorVisibleInScrollView(scrollView, userBackgroundItem);
        });
        userBackgroundItem.connect('activate', () => {
            lockscreenExt._settings.set_boolean(`user-background-${n}`, true);
            lockscreenExt._settings.set_string(`background-gradient-direction-${n}`, 'none');
            updateOrnament(lockscreenExt._catchGradientDirection, 'none');
            updateOrnament(backgroundItems, 'Use Systems');
        });
        section.addMenuItem(userBackgroundItem);
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
                lockscreenExt._settings.set_string(`background-gradient-direction-${n}`, 'none')
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