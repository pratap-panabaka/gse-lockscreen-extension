const { St, Clutter } = imports.gi;
const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const { updateOrnament } = Me.imports.utils.updateOrnament;
const { createActor } = Me.imports.utils.createActor;
const { createMenuItem } = Me.imports.utils.createMenuItem;
const { Sliding } = Me.imports.utils.sliding;

const { GetBackgrounds } = Me.imports.getNamesAsync.getBackgrounds;

var subMenuMonitorBackgrounds = (lockscreenExt, n) => {
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

    // Blur Sigma
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Sigma 0 to 100', y_align: Clutter.ActorAlign.CENTER }));
    menuItem.add_child(new Sliding(lockscreenExt._settings, `blur-sigma-${n}`));
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    //

    // Blur Brightness
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Brightness 0 to 1', y_align: Clutter.ActorAlign.CENTER }));
    menuItem.add_child(new Sliding(lockscreenExt._settings, `blur-brightness-${n}`));
    lockscreenExt._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    //
}

const setBackgrounds = async (lockscreenExt, n) => {
    const item = lockscreenExt._subMenuMenuItemMonitorBackground;

    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Backgrounds', y_align: Clutter.ActorAlign.CENTER }));
    item.menu.box.add_child(menuItem);

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

    scrollView.add_actor(section.actor);

    item.menu.box.add_child(scrollView);

    const object = new GetBackgrounds();
    const BACKGROUNDS = await object._collectBackgrounds();

    const collectBackgrounds = backgrounds => {
        let _items = [];

        // Add System Background Item
        const userBackgroundItem = new PopupMenu.PopupMenuItem('Use Systems');
        _items.push(userBackgroundItem);

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
