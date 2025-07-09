const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const {updateOrnament} = Me.imports.utils.updateOrnament;

function imageSize(lockscreenExt, n) {
    let items = [];

    let keys = ['cover', 'center', 'contain'];
    let dconfKey = `background-size-${n}`;

    keys.forEach(key => {
        const item = new PopupMenu.PopupMenuItem(key);
        items.push(item);

        item.connect('activate', () => {
            lockscreenExt._settings.set_string(dconfKey, key);
            updateOrnament(items, key);
        });
    });

    updateOrnament(items, lockscreenExt._settings.get_string(dconfKey));

    return items;
};
