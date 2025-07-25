const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const {updateOrnament} = Me.imports.utils.updateOrnament;

function gradientDirection(lockscreenExt, n, catchArray) {
    let items = [];

    let keys = ['none', 'horizontal', 'vertical'];
    let dconfKey = `gradient-direction-${n}`;

    keys.forEach(key => {
        const item = new PopupMenu.PopupMenuItem(key);
        items.push(item);

        if (catchArray)
            catchArray.push(item);

        item.connect('activate', () => {
            lockscreenExt._settings.set_string(dconfKey, key);
            updateOrnament(items, key);
        });
    });

    updateOrnament(items, lockscreenExt._settings.get_string(dconfKey));

    return items;
};
