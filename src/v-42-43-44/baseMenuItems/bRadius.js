const {St} = imports.gi;
const PopupMenu = imports.ui.popupMenu;

let inputText, getInput;

//
function bRadius(lockscreenExt, n) {
    const item = new PopupMenu.PopupBaseMenuItem();

    inputText = new St.Entry({
        hint_text: 'Enter Blur Radius Value',
        text: String(lockscreenExt._settings.get_int(`blur-radius-${n}`)),
        track_hover: true,
        can_focus: true,
    });

    inputText.clutter_text.connect('activate', actor => {
        getInput = actor.get_text();
        lockscreenExt._settings.set_int(`blur-radius-${n}`, Number(getInput));
    });

    item.connect('notify::active', () => inputText.grab_key_focus());
    item.add_child(inputText);

    return item;
};
