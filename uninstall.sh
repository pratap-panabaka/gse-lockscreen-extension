#! /bin/bash
set -e

NAME=gnome-lockscreen-extension
DOMAIN=pratap.fastmail.fm
UUID=$NAME@$DOMAIN
ZIP_NAME=$UUID.zip

echo -e "\n\n\t~~~~~~~~~~~~~~~~ gnome-lockscreen-extension ~~~~~~~~~~~~~~~~\n"
echo -e "\trunning the script...\n"

if $(gnome-extensions list | grep -q $UUID); then
    gnome-extensions uninstall $UUID
else
    echo -e "\textension is not installed"
    exit 1
fi

echo -e "\t------------------------------------------
\t| gnome-lockscreen-extension is uninstalled |
\t------------------------------------------"

echo -e "\n\t~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~\n"
exit 0
