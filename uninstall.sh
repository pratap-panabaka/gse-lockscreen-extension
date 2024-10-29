#! /bin/bash
set -e

NAME=lockscreen-extension
DOMAIN=pratap.fastmail.fm
UUID=$NAME@$DOMAIN
ZIP_NAME=$UUID.zip

echo -e "\n\n\t~~~~~~~~~~~~~~~~ lockscreen-extension ~~~~~~~~~~~~~~~~\n"
echo -e "\trunning the script...\n"

if $(gnome-extensions list | grep -q $UUID); then
    gnome-extensions uninstall $UUID
else
    echo -e "\tlockscreen-extension is not installed, exiting..."
    echo -e "\n\t~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~\n\n"
    exit 1
fi

echo -e "\t------------------------------------------
\t| lockscreen-extension is uninstalled |
\t------------------------------------------"

echo -e "\n\t~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~\n\n"
exit 0
