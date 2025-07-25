import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

let inputText, getInput;

const secondaryColor = (lockscreenExt, n) => {
    const item = new PopupMenu.PopupBaseMenuItem();

    inputText = new St.Entry({
        hint_text: 'Please enter secondary color Ex: #454545',
        text: lockscreenExt._settings.get_string(`secondary-color-${n}`),
        track_hover: true,
        can_focus: true,
    });

    inputText.clutter_text.connect('activate', actor => {
        getInput = actor.get_text();
        lockscreenExt._settings.set_string(`secondary-color-${n}`, getInput);
    });

    item.connect('notify::active', () => inputText.grab_key_focus());
    item.add_child(inputText);

    return item;
};

export default secondaryColor;
