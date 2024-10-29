const { Gio, St, Clutter } = imports.gi;
const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const { updateOrnament } = Me.imports.utils.updateOrnament;
const { createActor } = Me.imports.utils.createActor;
const { createMenuItem } = Me.imports.utils.createMenuItem;
const { Sliding } = Me.imports.utils.sliding;
const { GetBackgrounds } = Me.imports.getNamesAsync.getBackgrounds;

var subMenuMonitorBackgrounds = (gnomeLockscreenExtension, n) => {
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    createBackgroundPrefs(gnomeLockscreenExtension, n);
    setBackgrounds(gnomeLockscreenExtension, n);

    return gnomeLockscreenExtension._subMenuMenuItemMonitorBackground;
}

let menuItem = null;

const createBackgroundPrefs = (gnomeLockscreenExtension, n) => {
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(createActor(ExtensionUtils.getSettings(), 'Background Color/Gradient Start Color', '#123456', `background-color-${n}`, 'primary', 'Must be a valid color'));
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(createActor(ExtensionUtils.getSettings(), 'Gradient End Color', '#456789', `background-gradient-end-color-${n}`, 'secondary', 'Must be a valid color or same as above color'));

    gnomeLockscreenExtension._catchGradientDirection = [];
    const gradientDirectionMenuItem = createMenuItem('Gradient Direction', ['none', 'horizontal', 'vertical'], ExtensionUtils.getSettings(), `background-gradient-direction-${n}`, gnomeLockscreenExtension._catchGradientDirection)
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(gradientDirectionMenuItem);

    const backgroundSizeMenuItem = createMenuItem('Background size', ['center', 'cover', 'contain'], ExtensionUtils.getSettings(), `background-size-${n}`);
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(backgroundSizeMenuItem);

    // Blur Sigma
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Sigma 0 to 100', y_align: Clutter.ActorAlign.CENTER }));
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(new Sliding(ExtensionUtils.getSettings(), `blur-sigma-${n}`));
    //

    // Blur Brightness
    menuItem = new PopupMenu.PopupBaseMenuItem();
    menuItem.add_child(new St.Label({ text: 'Blur Brightness 0 to 1 (Only applicable if Blur Radius is > 0)', y_align: Clutter.ActorAlign.CENTER }));
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(menuItem);
    gnomeLockscreenExtension._subMenuMenuItemMonitorBackground.menu.box.add_child(new Sliding(ExtensionUtils.getSettings(), `blur-brightness-${n}`));
    //
}

const setBackgrounds = async (gnomeLockscreenExtension, n) => {
    const item = gnomeLockscreenExtension._subMenuMenuItemMonitorBackground;

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
        let _items = [new PopupMenu.PopupMenuItem('some'), new PopupMenu.PopupMenuItem('some')];

        // Add System Background Item
        const userBackgroundItem = new PopupMenu.PopupMenuItem('Use Systems');
        userBackgroundItem.label.set_style("background: green; padding: 8px; font-weight: bold");
        _items.push(userBackgroundItem);

        userBackgroundItem.connect('activate', () => {
            ExtensionUtils.getSettings().set_boolean(`user-background-${n}`, true);
            ExtensionUtils.getSettings().set_string(`background-gradient-direction-${n}`, 'none');
            updateOrnament(gnomeLockscreenExtension._catchGradientDirection, 'none');
            updateOrnament(backgroundItems, 'Use Systems');
        });
        section.addMenuItem(userBackgroundItem);
        //

        backgrounds.forEach(backgroundName => {
            const backgroundNameItem = new PopupMenu.PopupMenuItem(backgroundName);
            _items.push(backgroundNameItem);

            section.addMenuItem(backgroundNameItem);

            backgroundNameItem.connect('activate', () => {
                ExtensionUtils.getSettings().set_boolean(`user-background-${n}`, false);
                ExtensionUtils.getSettings().set_string(`background-image-path-${n}`, backgroundName);
                ExtensionUtils.getSettings().set_string(`background-gradient-direction-${n}`, 'none')
                updateOrnament(backgroundItems, backgroundName);
                updateOrnament(gnomeLockscreenExtension._catchGradientDirection, 'none');
            });
        });

        return _items;
    };

    const backgroundItems = collectBackgrounds(BACKGROUNDS);
    const text = ExtensionUtils.getSettings().get_string(`background-image-path-${n}`);
    const userBackground = ExtensionUtils.getSettings().get_boolean(`user-background-${n}`);
    updateOrnament(backgroundItems, userBackground ? "Use Systems" : text);
}
