import Clutter from 'gi://Clutter';
import St from 'gi://St';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import ConfirmDialog from '../utils/confirmDialog.js';

const hideExtensionButton = lockscreenExt => {
    const item = new PopupMenu.PopupBaseMenuItem();
    const label = new St.Label({text: 'Hide lockscreen-extension button', style_class: 'button', x_expand: true, x_align: Clutter.ActorAlign.CENTER, y_align: Clutter.ActorAlign.CENTER});
    item.add_child(label);
    item.connect('notify::active', () => label.grab_key_focus());
    item.connect('activate', () => openModal(lockscreenExt));
    return item;
};

const confirmDialog = {
    subject: ('title', 'Hide lockscreen-extension button?'),
    description: `Are you sure to hide the lockscreen-extension button? To show the button back, please refere to the gsettings command provided in the README of github repository.
    `,
    confirmButtons: [
        {
            signal: 'cancel',
            label: ('button', 'Cancel'),
            key: Clutter.KEY_Escape,
        },
        {
            signal: 'proceed',
            label: ('button', 'Hide'),
            default: true,
        },
    ],
};

const openModal = extension => {
    const settings = extension._settings;
    const modal = new ConfirmDialog(confirmDialog);

    modal.connect('proceed', () => {
        settings.set_boolean('hide-lockscreen-extension-button', true);
    });

    modal.open();
};

export default hideExtensionButton;
