const {St} = imports.gi;
const PopupMenu = imports.ui.popupMenu;

function secondaryColor(lockscreenExt, n) {
    const item = new PopupMenu.PopupBaseMenuItem();

    lockscreenExt._secondaryColor = new St.Entry({
        hint_text: 'Please enter secondary color Ex: #454545',
        text: lockscreenExt._settings.get_string(`secondary-color-${n}`),
        track_hover: true,
        can_focus: true,
    });

    lockscreenExt._secondaryColor.clutter_text.connect('activate', actor => {
        const getInput = actor.get_text();
        lockscreenExt._settings.set_string(`secondary-color-${n}`, getInput);
    });

    item.connect('notify::active', () => lockscreenExt._secondaryColor.grab_key_focus());
    item.add_child(lockscreenExt._secondaryColor);

    return item;
};
