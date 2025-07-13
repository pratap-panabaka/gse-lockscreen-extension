const {St} = imports.gi;
const PopupMenu = imports.ui.popupMenu;

//
function bBrightness(lockscreenExt, n) {
    const item = new PopupMenu.PopupBaseMenuItem();

    lockscreenExt._bBrightnessInputText = new St.Entry({
        hint_text: 'Enter Blur Brightness Value',
        text: String(lockscreenExt._settings.get_double(`blur-brightness-${n}`)),
        track_hover: true,
        can_focus: true,
    });

    lockscreenExt._bBrightnessInputText.clutter_text.connect('activate', actor => {
        const getInput = actor.get_text();
        lockscreenExt._settings.set_double(`blur-brightness-${n}`, getInput);
    });

    item.connect('notify::active', () => lockscreenExt._bBrightnessInputText.grab_key_focus());
    item.add_child(lockscreenExt._bBrightnessInputText);

    return item;
};
