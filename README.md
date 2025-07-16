### Gnome Lockscreen Extension (GNOME V42 and above)

___

this extensions recent update.
- removed sliders and used entry box'es for blur-radius and blur-brightness.
- added settings for selecting custom folder from which background images to be picked.
- preview of background images.
- compatible with [variety app](https://github.com/varietywalls/variety).

___

This extension is a improvment of [Control Blur Effect on Lock Screen](https://github.com/pratap-panabaka/gse-control-blur-effect-on-lockscreen) extension.
- With this (lockscreen-extension) you can control blur effect and also set background images or colors in real time.
- You can set different background images/colors for each monitor upto four monitors.

> [!NOTE]
> Currently it is tested on Arch Linux and Ubuntu 22.04, 24.04, 24.10

### Install
```
git clone https://github.com/pratap-panabaka/gse-lockscreen-extension
cd gse-lockscreen-extension
./install.sh
```

> [!TIP]
> After you hide the extension button from the lockscreen, to show it back, run below command
>
> ```
> gsettings --schemadir $HOME/.local/share/gnome-shell/extensions/lockscreen-extension@pratap.fastmail.fm/schemas set org.gnome.shell.extensions.lockscreen-extension hide-lockscreen-extension-button false
> ```

### Uninstall
```
./uninstall.sh
```

<hr/>

[![Buy Me A Coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=pratap.panabaka&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/pratap.panabaka)


