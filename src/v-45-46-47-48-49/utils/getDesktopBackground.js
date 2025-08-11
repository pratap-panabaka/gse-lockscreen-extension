import Gio from 'gi://Gio';
import GDesktopEnums from 'gi://GDesktopEnums';

const getDesktopBackground = () => {
    const colorScheme = new Gio.Settings({schema_id: 'org.gnome.desktop.interface'}).get_enum('color-scheme');
    const uri = new Gio.Settings({schema_id: 'org.gnome.desktop.background'}).get_string(
        colorScheme === GDesktopEnums.ColorScheme.PREFER_DARK
            ? 'picture-uri-dark'
            : 'picture-uri');

    return uri;
};

export default getDesktopBackground;
