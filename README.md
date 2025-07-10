### Gnome Lockscreen Extension (GNOME V42 and above)

___

this extension v9 update.
- removed sliders and used entry box'es for blur-radius and blur-brightness.
- added settings for selecting custom folder from which background images to be picked.
- preview of background images.
- compatible with [variety](https://github.com/varietywalls/variety) app.

![alt text](image-1.png)

![alt text](image.png)

Ubuntu 22.04 Screenshots
![image](https://github.com/user-attachments/assets/581c96ae-7309-49d1-b0b9-0e311a085db6)

![image](https://github.com/user-attachments/assets/a45eb500-1887-43ce-8553-4b8f1d71f586)
___

This extension is a improvment of [Control Blur Effect on Lock Screen](https://github.com/PRATAP-KUMAR/control-blur-effect-on-lockscreen) extension.
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
![ls_1](https://github.com/user-attachments/assets/46895f75-e489-46fc-8aee-bf0f10fc987f)

![ls_2](https://github.com/user-attachments/assets/2a05a747-9f8b-4a0c-961a-2c5fcb499660)

![ls_3](https://github.com/user-attachments/assets/e6587741-ac77-46f0-a933-a29603e3fc5b)

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

[![Buy Me A Coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=pratap.panabaka&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/pratap.panabaka)


