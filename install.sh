#! /bin/bash
set -e

NAME=gnome-lockscreen-extension
DOMAIN=pratap.fastmail.fm
UUID=$NAME@$DOMAIN
ZIP_NAME=$UUID.zip

# Findout gnome-shell version
SHELL_VERSION=$(gnome-shell --version | cut -d ' ' -f3 | cut -d '.' -f1)

if [[ $SHELL_VERSION -lt 45 ]]
then
    echo "This script is not for the gnome-shell versions below 45, Exiting with no changes."
    exit 1
fi

echo -e "\n\n\t~~~~~~~~~~~~~~~~ gnome-lockscreen-extension ~~~~~~~~~~~~~~~~\n"
echo -e "\trunning the script...\n"
echo -e "\t1. gnome-shell version $SHELL_VERSION detected"

echo -e "\t2. Creating zip file"

zip -qr $ZIP_NAME ./* -x schemas/gschemas.compiled .git .gitignore install.sh uninstall.sh README.md && echo -e "\t3. zip file created"

echo -e "\t4. Installing the extension from the zip file\n"

gnome-extensions install -f $ZIP_NAME
rm -rf $ZIP_NAME

echo -e "\t------------------------------------------
\t| gnome-lockscreen-extension is installed |
\t------------------------------------------

\tYou can set background with image(with blur) or color/gradient for each monitor upto 4 monitors independently"
echo -e "\n\t~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~\n"
exit 0