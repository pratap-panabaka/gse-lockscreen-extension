// SPDX-FileCopyrightText: 2020 Florian Müllner <fmuellner@gnome.org>
//
// SPDX-License-Identifier: GPL-2.0-or-later

// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

// we use async/await here to not block the mainloop, not to parallelize

// source code: https://extensions.gnome.org/extension/19/user-themes/
// Below code is tweaked by PRATAP PANABAKA <pratap@fastmail.fm>

/* eslint-disable no-await-in-loop */

import Gio from 'gi://Gio';
import enumerateFiles from './enumerateFiles.js';

const getBackgrounds = async paths => {
    let backgroundFileNames = [];
    for (const dirName of paths) {
        if (!dirName)
            continue;

        const dir = Gio.File.new_for_path(dirName);
        if (dir.query_exists(null)) {
            let result = await enumerateFiles(dir);
            if (result)
                backgroundFileNames.push(...result);
        }
    }

    const filtered = [...new Set(backgroundFileNames)]
        .map(name => name.trim())
        .filter(name => name.length > 0)
        .filter(
            name => {
                const lowerName = name.toLowerCase();
                return (
                    lowerName.endsWith('.jpg') ||
                    lowerName.endsWith('.jpeg') ||
                    lowerName.endsWith('.png') ||
                    lowerName.endsWith('.gif') ||
                    lowerName.endsWith('.webp')
                );
            }
        );

    return filtered;
};

export default getBackgrounds;
