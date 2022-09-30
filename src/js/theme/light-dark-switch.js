// File#: _3_light-dark-switch
// Usage: codyhouse.co/license
(function () {
	var LdSwitch = function (element) {
		this.element = element;
		this.icons = this.element.getElementsByClassName('js-ld-switch-icon');
		this.selectedIcon = 0;
		this.isSystem = false;
		// icon animation classes
		this.iconClassIn = 'ld-switch-btn__icon-wrapper--in';
		this.iconClassOut = 'ld-switch-btn__icon-wrapper--out';
		// mediaQueryList
		this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
		this.eventBind = false;
		saveThemeLabels(this);
		initLdSwitch(this);
	};

	function saveThemeLabels(switchOb) {
		switchOb.themes = ['default', 'dark', 'system'];
		switchOb.options = switchOb.element.querySelectorAll('option');

		var lightTheme = switchOb.options[0].getAttribute('data-option-theme'),
			darkTheme = switchOb.options[1].getAttribute('data-option-theme');
		if (lightTheme) switchOb.themes[0] = lightTheme;
		if (darkTheme) switchOb.themes[1] = darkTheme;
	};

	function initLdSwitch(switchOb) {
		// set theme from localstorage
		var themeSelection = localStorage.getItem('ldSwitch');
		var options = {
			default: 0,
			dark: 1,
			system: 2
		};
		if (themeSelection !== undefined && themeSelection !== 'undefined') {
			setTheme(switchOb, options[themeSelection]);

			var popover = document.getElementById('color-theme-popover');
			var popoverOptions = popover.querySelectorAll('.ld-switch-popover__option');
			if (popoverOptions.length > 0) {
				for (var i = 0; i < popoverOptions.length; i++) {
					popoverOptions[i].removeAttribute('aria-selected');
					popoverOptions[i].removeAttribute('tabindex');
				}
			}
			var popoverOption = popover.querySelector(`.ld-switch-popover__option[data-value="${options[themeSelection]}"]`);
			if (popoverOption) {
				popoverOption.setAttribute('aria-selected', true);
				popoverOption.setAttribute('tabindex', '0');
			}
		}
		
		// set initial state
		setStartIcon(switchOb);

		// detect change in the selected theme
		switchOb.element.addEventListener('change', function (event) {
			setTheme(switchOb, event.target.value);
		});
	};

	function setStartIcon(switchOb) {
		var selectedOptionIndex = switchOb.element.querySelector('select').selectedIndex;
		if (selectedOptionIndex === 0) return;
		setTheme(switchOb, selectedOptionIndex);
	};

	function setTheme(switchOb, value) {
		var theme = switchOb.themes[0],
			iconIndex = value;

		// update local storage
		localStorage.setItem('ldSwitch', switchOb.themes[value]);

		// get theme value and icon index
		if (value == 1) {
			theme = switchOb.themes[1];
		} else if (value == 2) {
			// user selected system -> check if we should show light or dark theme
			var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
			if (isDarkTheme) {
				iconIndex = 3;
				theme = switchOb.themes[1];
			}
		}

		// update theme value
		updateThemeValue(theme);

		// update visible icon
		updateIcon(switchOb, iconIndex, switchOb.selectedIcon);

		// check if we need to add/remove matchMedia events
		setMatchMediaEvents(switchOb, value == 2, switchOb.isSystem);
		switchOb.isSystem = value == 2 ? true : false;
	};

	function updateIcon(switchOb, newIcon, oldIcon) {
		// if (init) { // we are only setting the initial status of the switcher
		// 	Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassIn);
		// 	Util.addClass(switchOb.icons[newIcon], switchOb.iconClassIn);
		// 	switchOb.selectedIcon = newIcon;
		// 	return;
		// }
		
		if (switchOb.icons[newIcon]) {
			Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassIn);
			Util.addClass(switchOb.icons[oldIcon], switchOb.iconClassOut);

			Util.addClass(switchOb.icons[newIcon], switchOb.iconClassIn);
			switchOb.icons[newIcon].addEventListener('transitionend', function cb() {
				Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassOut);
				switchOb.icons[newIcon].removeEventListener('transitionend', cb);
				switchOb.selectedIcon = newIcon;
			});
		}
	};

	function updateThemeValue(theme) {
		document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);
	};

	function setMatchMediaEvents(switchOb, addEvent, removeEvent) {
		if (addEvent) {
			switchOb.eventBind = systemUpdated.bind(switchOb);
			switchOb.mediaQueryList.addEventListener("change", switchOb.eventBind);
		} else if (removeEvent) switchOb.mediaQueryList.removeEventListener("change", switchOb.eventBind);
	};

	function systemUpdated() {
		var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
		var theme = isDarkTheme ? this.themes[1] : this.themes[0],
			newIndex = isDarkTheme ? 3 : 2,
			oldIcon = isDarkTheme ? 2 : 3;
		updateIcon(this, newIndex, oldIcon);
		updateThemeValue(theme);
	};

	window.LdSwitch = LdSwitch;
	var ldSwitches = document.getElementsByClassName('js-ld-switch');
	if (ldSwitches.length > 0) {
		for (var i = 0; i < ldSwitches.length; i++) {
			new LdSwitch(ldSwitches[i]);
		}
	}
}());
