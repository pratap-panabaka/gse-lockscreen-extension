const {St} = imports.gi;
const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const {GNOME_SHELL_VERSION} = Me.imports.utils.shellVersion;
const {gradientDirection} = Me.imports.baseMenuItems.gradientDirection;
const {backgroundImages} = Me.imports.baseMenuItems.backgroundImages;
const {imageSize} = Me.imports.baseMenuItems.imageSize;
const {primaryColor} = Me.imports.baseMenuItems.primaryColor;
const {secondaryColor} = Me.imports.baseMenuItems.secondaryColor;
const {bRadius} = Me.imports.baseMenuItems.bRadius;
const {bBrightness} = Me.imports.baseMenuItems.bBrightness;

function lockscreenExtMenu(lockscreenExt, n) {
    const menu = new PopupMenu.PopupSubMenuMenuItem(`Monitor - ${n}`, false);
    menu._catchItems = [];
    setBackgrounds(lockscreenExt, n, menu);

    return menu;
};

const setBackgrounds = async (lockscreenExt, n, menu) => {
    const catchItems = []; // catch items for adding visibility in scroll view

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

    scrollView.add_actor(section.actor);

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
    iSize.forEach(size => {
        section.addMenuItem(size);
        catchItems.push(size);
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

    // background images
    const backgrounds = await backgroundImages(lockscreenExt, n);
    backgrounds.forEach(bg => {
        section.addMenuItem(bg);
        bg.connect('key-focus-in', () => {
            // AnimationUtils.ensureActorVisibleInScrollView(scrollView, bg);
        });
    });

    section.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); //

    // set actor visible in scroll view
    catchItems.forEach(item => {
        item.connect('key-focus-in', () => {
            // AnimationUtils.ensureActorVisibleInScrollView(scrollView, item);
        });
    });
};
