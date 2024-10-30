### Gnome Lockscreen Extension (GNOME V42 and above)

This extension is a improvment of [Control Blur Effect on Lock Screen](https://github.com/PRATAP-KUMAR/control-blur-effect-on-lockscreen) extension.
- With this (lockscreen-extension) you can control blur effect and also set background images or colors in real time.
- You can set different background images/colors for each monitor upto four monitors.

> [!NOTE]
> Currently it is tested on Arch Linux and Ubuntu 22.04, 24.04, 24.10

### Install
```
git clone https://github.com/PRATAP-KUMAR/lockscreen-extension
cd lockscreen-extension
./install.sh
```

> [!TIP]
> After you hide the extension icon from the gnome-lockscreen, to show the gnome-lockscreen-extension icon, run below command
>
> ```
> gsettings --schemadir $HOME/local/share/gnome-shell/extensions/lockscreen-extension@pratap.fastmail.fm/schemas set org.gnome.shell.extensions.lockscreen-extension hide-lockscreen-extension-icon false
> ```

### Uninstall
```
./uninstall.sh
```

![gnome-lockscreen-extension](https://github.com/user-attachments/assets/71c1d659-bcb0-4367-b8a8-95e54f5f6740)

![gnome-lockscreen-extension](https://github.com/user-attachments/assets/3bcc1bb7-bd6f-41b3-b26e-58dc37f40ecc)

```
[admin@Xuxa lockscreen-extension]$ ./uninstall.sh 


	~~~~~~~~~~~~~~~~ lockscreen-extension ~~~~~~~~~~~~~~~~

	running the script...

	------------------------------------------
	| lockscreen-extension is uninstalled |
	------------------------------------------

	~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~


[admin@Xuxa lockscreen-extension]$ ./install.sh 


	~~~~~~~~~~~~~~~~ lockscreen-extension ~~~~~~~~~~~~~~~~

	running the script...

	1. gnome-shell version 47 detected
	2. Creating zip file...
	3. zip file created
	4. Installing the extension from the zip file...

	------------------------------------------
	| lockscreen-extension is installed |
	------------------------------------------

	Now please enable the extension, once extension is enabled then
	You can set background with image(with blur) or color/gradient for each monitor upto 4 monitors independently

	~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~

[admin@Xuxa lockscreen-extension]$ 
```

<hr/>

<a href="https://www.buymeacoffee.com/pratappanabaka"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=pratappanabaka&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" /></a>
