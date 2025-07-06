import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/* eslint-disable consistent-return */

/* Gio.File */
Gio._promisify(Gio.File.prototype, 'enumerate_children_async');
Gio._promisify(Gio.File.prototype, 'query_info_async');

/* Gio.FileEnumerator */
Gio._promisify(Gio.FileEnumerator.prototype, 'next_files_async');

/**
 * Recursively operate on @file and any children it may have.
 *
 * @param {Gio.File} file - the file or directory
 * @returns {Promise} a Promise for the operation
 */
async function recursiveFileOperation(file) {
    const stack = [];

    const fileInfo = await file.query_info_async('standard::type',
        Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT,
        null);

    const fileType = fileInfo.get_file_type();

    if (fileType === Gio.FileType.DIRECTORY) {
        const iter = await file.enumerate_children_async('standard::type', Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT, null);
        const fileInfos = await iter.next_files_async(100, GLib.PRIORITY_DEFAULT, null);
        if (fileInfos.length === 0)
            return;

        for (const info of fileInfos) {
            const child = iter.get_child(info);
            const childType = info.get_file_type();
            if (childType === Gio.FileType.REGULAR)
                stack.push(child.get_uri());
        }
    }

    return stack;
}

export default recursiveFileOperation;
