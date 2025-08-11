import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

class PickFolder {
    constructor(settings) {
        this._gsettings = settings;
        this._entryRow = null;
        this._fileChooseButton = null;
        this._fileChooser = null;
    }

    addFolderUrl() {
        this._entryRow = new Adw.EntryRow({title: 'Folder containing images'});

        this._entryRow.set_text(this._gsettings.get_string('backgrounds-folder-path'));
        this._entryRow.connect('changed', entry => {
            this._gsettings.set_string('backgrounds-folder-path', entry.get_text());
        });

        this._entryRow.add_suffix(this.addButton());

        return this._entryRow;
    }

    addButton() {
        this._fileChooseButton = new Gtk.Button({label: 'Browse Folder'});
        this._fileChooseButton.set_has_frame(true);
        this._fileChooseButton.connect('clicked', this.showFileChooserDialog.bind(this));

        return this._fileChooseButton;
    }

    showFileChooserDialog() {
        this._fileChooser = new Gtk.FileDialog({title: 'Select Folder'});
        this._fileChooser.select_folder(null, null, (dialog, result) => {
            this.onSelectFolderFinish(dialog, result);
        }, null);
    }

    onSelectFolderFinish(dialog, result) {
        try {
            const folder = dialog.select_folder_finish(result);
            if (folder)
                this._entryRow.set_text(folder.get_path());
            else
                console.log('No folder selected.');
        } catch (e) {
            console.log(`Error selecting folder: ${e}`);
        } finally {
            dialog.destroy();
        }
    }
}

export default PickFolder;
