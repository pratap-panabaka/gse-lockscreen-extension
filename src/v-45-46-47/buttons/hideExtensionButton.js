import Clutter from 'gi://Clutter';
import St from 'gi://St';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import ConfirmDialog from '../utils/confirmDialog.js';

const hideExtensionButton = lockscreenExt => {
    lockscreenExt._hideExtensionButton = new PopupMenu.PopupBaseMenuItem();
    let hideButton = new St.Button({label: 'Hide lockscreen-extension button', style_class: 'button', x_align: Clutter.ActorAlign.CENTER, x_expand: true});
    hideButton.connect('clicked', () => openModal(lockscreenExt));
    lockscreenExt._hideExtensionButton.add_child(hideButton);

    return lockscreenExt._hideExtensionButton;
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
