import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

let inputText, getInput;

//
const primaryColor = (lockscreenExt, n) => {
    const item = new PopupMenu.PopupBaseMenuItem();

    inputText = new St.Entry({
        hint_text: 'Please enter primary color Ex: #454545',
        text: lockscreenExt._settings.get_string(`primary-color-${n}`),
        track_hover: true,
        can_focus: true,
    });

    inputText.clutter_text.connect('activate', actor => {
        getInput = actor.get_text();
        lockscreenExt._settings.set_string(`primary-color-${n}`, getInput);
    });

    item.connect('notify::active', () => inputText.grab_key_focus());
    item.add_child(inputText);

    return item;
};

//
const useSystemPrimaryColor = (lockscreenExt, n) => {
    const item = new PopupMenu.PopupBaseMenuItem();

    const label = new St.Label({text: 'Use Systems Primary Color', style_class: 'button', y_align: Clutter.ActorAlign.CENTER});

    item.add_child(label);

    item.connect('notify::active', () => label.grab_key_focus());

    item.connect('activate', () => {
        let systemColor = new Gio.Settings({schema_id: 'org.gnome.desktop.background'}).get_string('primary-color');
        lockscreenExt._settings.set_string(`primary-color-${n}`, systemColor);
        inputText.text = systemColor;
    });

    return item;
};

export {primaryColor, useSystemPrimaryColor};
