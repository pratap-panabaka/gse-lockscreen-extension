const {St} = imports.gi;
const PopupMenu = imports.ui.popupMenu;

//
function primaryColor(lockscreenExt, n) {
    const item = new PopupMenu.PopupBaseMenuItem();

    lockscreenExt._primaryColor = new St.Entry({
        hint_text: 'Please enter primary color Ex: #454545',
        text: lockscreenExt._settings.get_string(`primary-color-${n}`),
        track_hover: true,
        can_focus: true,
    });

    lockscreenExt._primaryColor.clutter_text.connect('activate', actor => {
        const getInput = actor.get_text();
        lockscreenExt._settings.set_string(`primary-color-${n}`, getInput);
    });

    item.connect('notify::active', () => lockscreenExt._primaryColor.grab_key_focus());
    item.add_child(lockscreenExt._primaryColor);

    return item;
};
