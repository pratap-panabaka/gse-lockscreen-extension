const {St} = imports.gi;
const PopupMenu = imports.ui.popupMenu;

//
function bRadius(lockscreenExt, n) {
    const item = new PopupMenu.PopupBaseMenuItem();

    lockscreenExt._bRadiusInputText = new St.Entry({
        hint_text: 'Enter Blur Radius Value',
        text: String(lockscreenExt._settings.get_int(`blur-radius-${n}`)),
        track_hover: true,
        can_focus: true,
    });

    lockscreenExt._bRadiusInputText.clutter_text.connect('activate', actor => {
        const getInput = actor.get_text();
        lockscreenExt._settings.set_int(`blur-radius-${n}`, Number(getInput));
    });

    item.connect('notify::active', () => lockscreenExt._bRadiusInputText.grab_key_focus());
    item.add_child(lockscreenExt._bRadiusInputText);

    return item;
};
