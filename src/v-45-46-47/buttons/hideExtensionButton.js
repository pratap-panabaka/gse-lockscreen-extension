import Clutter from 'gi://Clutter';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import ConfirmDialog from "../utils/confirmDialog.js";

const hideExtensionButton = (gnomeLockscreenExtension) => {
    gnomeLockscreenExtension._hideExtensionButton = new PopupMenu.PopupMenuItem('Hide gnome-lockscreen-extension icon');
    gnomeLockscreenExtension._hideExtensionButton.connect('activate', () => openModal(gnomeLockscreenExtension));

    return gnomeLockscreenExtension._hideExtensionButton;
}

const confirmDialog = {
    subject: ('title', 'Hide gnome-lockscreen-extension Icon?'),
    description: `Are you sure to hide the gnome-lockscreen-extension icon? To show the icon back, please refere to the gsettings command provided in the README of github repository.
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

const openModal = (extension) => {
    const settings = extension._settings;
    const modal = new ConfirmDialog(confirmDialog);

    modal.connect('proceed', () => {
        settings.set_boolean('hide-lockscreen-extension-icon', true);
    });

    modal.open();
}

export default hideExtensionButton;
