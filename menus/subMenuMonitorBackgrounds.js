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

const subMenuMonitorBackgrounds = (gnomeLockscreenExtension, n) => {
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    createBackgroundPrefs(gnomeLockscreenExtension, n);
    setBackgrounds(gnomeLockscreenExtension, n);

    return gnomeLockscreenExtension._subMenuMenuItemMonitorBackground;
}

let menuItem = null;

const createBackgroundPrefs = (gnomeLockscreenExtension, n) => {
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(createActor(gnomeLockscreenExtension._settings, 'Background Color/Gradient Start Color', '#123456', `background-color-${n}`, 'primary', 'Must be a valid color'));
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(createActor(gnomeLockscreenExtension._settings, 'Gradient End Color', '#456789', `background-gradient-end-color-${n}`, 'secondary', 'Must be a valid color or same as above color'));

    gnomeLockscreenExtension._catchGradientDirection = [];
    const gradientDirectionMenuItem = createMenuItem('Gradient Direction', ['none', 'horizontal', 'vertical'], gnomeLockscreenExtension._settings, `background-gradient-direction-${n}`, gnomeLockscreenExtension._catchGradientDirection)
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(gradientDirectionMenuItem);

    const backgroundSizeMenuItem = createMenuItem('Background size', ['center', 'cover', 'contain'], gnomeLockscreenExtension._settings, `background-size-${n}`);
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(backgroundSizeMenuItem);

    // Blur Radius
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Radius 0 to 100', y_align: Clutter.ActorAlign.CENTER }));
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(new Slider(gnomeLockscreenExtension._settings, `blur-radius-${n}`));
    //

    // Blur Brightness
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Brightness 0 to 1 (Only applicable if Blur Radius is > 0)', y_align: Clutter.ActorAlign.CENTER }));
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(new Slider(gnomeLockscreenExtension._settings, `blur-brightness-${n}`));
    //
}

const setBackgrounds = async (gnomeLockscreenExtension, n) => {
    const item = gnomeLockscreenExtension._subMenuMenuItemMonitorBackground;

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
            gnomeLockscreenExtension._settings.set_boolean(`user-background-${n}`, true);
            gnomeLockscreenExtension._settings.set_string(`background-gradient-direction-${n}`, 'none');
            updateOrnament(gnomeLockscreenExtension._catchGradientDirection, 'none');
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
                gnomeLockscreenExtension._settings.set_boolean(`user-background-${n}`, false);
                gnomeLockscreenExtension._settings.set_string(`background-image-path-${n}`, backgroundName);
                gnomeLockscreenExtension._settings.set_string(`background-gradient-direction-${n}`, 'none')
                updateOrnament(backgroundItems, backgroundName);
                updateOrnament(gnomeLockscreenExtension._catchGradientDirection, 'none');
            });
        });

        return _items;
    };

    const backgroundItems = collectBackgrounds(BACKGROUNDS);
    const text = gnomeLockscreenExtension._settings.get_string(`background-image-path-${n}`);
    const userBackground = gnomeLockscreenExtension._settings.get_boolean(`user-background-${n}`);
    updateOrnament(backgroundItems, userBackground ? "Use Systems" : text);
}

export default subMenuMonitorBackgrounds;