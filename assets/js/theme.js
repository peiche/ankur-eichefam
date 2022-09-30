/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 25:
/***/ (() => {

// File#: _2_adv-custom-select
// Usage: codyhouse.co/license
(function () {
  var AdvSelect = function AdvSelect(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.optionData = getOptionsData(this);
    this.selectId = this.select.getAttribute('id');
    this.selectLabel = document.querySelector('[for=' + this.selectId + ']');
    this.trigger = this.element.getElementsByClassName('js-adv-select__control')[0];
    this.triggerLabel = this.trigger.getElementsByClassName('js-adv-select__value')[0];
    this.dropdown = document.getElementById(this.trigger.getAttribute('aria-controls'));
    initAdvSelect(this); // init markup

    initAdvSelectEvents(this); // init event listeners
  };

  function getOptionsData(select) {
    var obj = [],
        dataset = select.options[0].dataset;

    function camelCaseToDash(myStr) {
      return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    for (var prop in dataset) {
      if (Object.prototype.hasOwnProperty.call(dataset, prop)) {
        // obj[prop] = select.dataset[prop];
        obj.push(camelCaseToDash(prop));
      }
    }

    return obj;
  }

  ;

  function initAdvSelect(select) {
    // create custom structure
    createAdvStructure(select); // update trigger label

    updateTriggerLabel(select); // hide native select and show custom structure

    Util.addClass(select.select, 'adv-select-hide');
    Util.removeClass(select.trigger, 'adv-select-hide');
    Util.removeClass(select.dropdown, 'adv-select-hide');
  }

  ;

  function initAdvSelectEvents(select) {
    if (select.selectLabel) {
      // move focus to custom trigger when clicking on <select> label
      select.selectLabel.addEventListener('click', function () {
        select.trigger.focus();
      });
    } // option is selected in dropdown


    select.dropdown.addEventListener('click', function (event) {
      triggerSelection(select, event.target);
    }); // keyboard navigation

    select.dropdown.addEventListener('keydown', function (event) {
      if (event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if (event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      } else if (event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        triggerSelection(select, document.activeElement);
      }
    });
  }

  ;

  function createAdvStructure(select) {
    // store optgroup and option structure
    var optgroup = select.dropdown.querySelector('[role="group"]'),
        option = select.dropdown.querySelector('[role="option"]'),
        optgroupClone = false,
        optgroupLabel = false,
        optionClone = false;

    if (optgroup) {
      optgroupClone = optgroup.cloneNode();
      optgroupLabel = document.getElementById(optgroupClone.getAttribute('describedby'));
    }

    if (option) optionClone = option.cloneNode(true);
    var dropdownCode = '';

    if (select.optGroups.length > 0) {
      for (var i = 0; i < select.optGroups.length; i++) {
        dropdownCode = dropdownCode + getOptGroupCode(select, select.optGroups[i], optgroupClone, optionClone, optgroupLabel, i);
      }
    } else {
      for (var i = 0; i < select.options.length; i++) {
        dropdownCode = dropdownCode + getOptionCode(select, select.options[i], optionClone);
      }
    }

    select.dropdown.innerHTML = dropdownCode;
  }

  ;

  function getOptGroupCode(select, optGroup, optGroupClone, optionClone, optgroupLabel, index) {
    if (!optGroupClone || !optionClone) return '';
    var code = '';
    var options = optGroup.getElementsByTagName('option');

    for (var i = 0; i < options.length; i++) {
      code = code + getOptionCode(select, options[i], optionClone);
    }

    if (optgroupLabel) {
      var label = optgroupLabel.cloneNode(true);
      var id = label.getAttribute('id') + '-' + index;
      label.setAttribute('id', id);
      optGroupClone.setAttribute('describedby', id);
      code = label.outerHTML.replace('{optgroup-label}', optGroup.getAttribute('label')) + code;
    }

    optGroupClone.innerHTML = code;
    return optGroupClone.outerHTML;
  }

  ;

  function getOptionCode(select, option, optionClone) {
    optionClone.setAttribute('data-value', option.value);

    if (option.selected) {
      optionClone.setAttribute('aria-selected', 'true');
      optionClone.setAttribute('tabindex', '0');
    } else {
      optionClone.removeAttribute('aria-selected');
      optionClone.removeAttribute('tabindex');
    }

    var optionHtml = optionClone.outerHTML;
    optionHtml = optionHtml.replace('{option-label}', option.text);

    for (var i = 0; i < select.optionData.length; i++) {
      optionHtml = optionHtml.replace('{' + select.optionData[i] + '}', option.getAttribute('data-' + select.optionData[i]));
    }

    return optionHtml;
  }

  ;

  function updateTriggerLabel(select) {
    // select.triggerLabel.textContent = select.options[select.select.selectedIndex].text;
    select.triggerLabel.innerHTML = select.dropdown.querySelector('[aria-selected="true"]').innerHTML;
  }

  ;

  function triggerSelection(select, target) {
    var option = target.closest('[role="option"]');
    if (!option) return;
    selectOption(select, option);
  }

  ;

  function selectOption(select, option) {
    if (option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {// selecting the same option
    } else {
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');

      if (selectedOption) {
        selectedOption.removeAttribute('aria-selected');
        selectedOption.removeAttribute('tabindex');
      }

      option.setAttribute('aria-selected', 'true');
      option.setAttribute('tabindex', '0'); // new option has been selected -> update native <select> element and trigger label

      updateNativeSelect(select, option.getAttribute('data-value'));
      updateTriggerLabel(select);
    } // move focus back to trigger


    setTimeout(function () {
      select.trigger.click();
    });
  }

  ;

  function updateNativeSelect(select, selectedValue) {
    var selectedOption = select.select.querySelector('[value="' + selectedValue + '"');
    select.select.selectedIndex = Util.getIndexInArray(select.options, selectedOption);
    select.select.dispatchEvent(new CustomEvent('change', {
      bubbles: true
    })); // trigger change event
  }

  ;

  function keyboardCustomSelect(select, direction) {
    var selectedOption = select.select.querySelector('[value="' + document.activeElement.getAttribute('data-value') + '"]');
    if (!selectedOption) return;
    var index = Util.getIndexInArray(select.options, selectedOption);
    index = direction == 'next' ? index + 1 : index - 1;
    if (index < 0) return;
    if (index >= select.options.length) return;
    var dropdownOption = select.dropdown.querySelector('[data-value="' + select.options[index].getAttribute('value') + '"]');
    if (dropdownOption) Util.moveFocus(dropdownOption);
  }

  ; //initialize the AdvSelect objects

  var advSelect = document.getElementsByClassName('js-adv-select');

  if (advSelect.length > 0) {
    for (var i = 0; i < advSelect.length; i++) {
      (function (i) {
        new AdvSelect(advSelect[i]);
      })(i);
    }
  }
})();

/***/ }),

/***/ 37:
/***/ (() => {

// File#: _3_light-dark-switch
// Usage: codyhouse.co/license
(function () {
  var LdSwitch = function LdSwitch(element) {
    this.element = element;
    this.icons = this.element.getElementsByClassName('js-ld-switch-icon');
    this.selectedIcon = 0;
    this.isSystem = false; // icon animation classes

    this.iconClassIn = 'ld-switch-btn__icon-wrapper--in';
    this.iconClassOut = 'ld-switch-btn__icon-wrapper--out'; // mediaQueryList

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
  }

  ;

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

      var popoverOption = popover.querySelector(".ld-switch-popover__option[data-value=\"".concat(options[themeSelection], "\"]"));

      if (popoverOption) {
        popoverOption.setAttribute('aria-selected', true);
        popoverOption.setAttribute('tabindex', '0');
      }
    } // set initial state


    setStartIcon(switchOb); // detect change in the selected theme

    switchOb.element.addEventListener('change', function (event) {
      setTheme(switchOb, event.target.value);
    });
  }

  ;

  function setStartIcon(switchOb) {
    var selectedOptionIndex = switchOb.element.querySelector('select').selectedIndex;
    if (selectedOptionIndex === 0) return;
    setTheme(switchOb, selectedOptionIndex);
  }

  ;

  function setTheme(switchOb, value) {
    var theme = switchOb.themes[0],
        iconIndex = value; // update local storage

    localStorage.setItem('ldSwitch', switchOb.themes[value]); // get theme value and icon index

    if (value == 1) {
      theme = switchOb.themes[1];
    } else if (value == 2) {
      // user selected system -> check if we should show light or dark theme
      var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (isDarkTheme) {
        iconIndex = 3;
        theme = switchOb.themes[1];
      }
    } // update theme value


    updateThemeValue(theme); // update visible icon

    updateIcon(switchOb, iconIndex, switchOb.selectedIcon); // check if we need to add/remove matchMedia events

    setMatchMediaEvents(switchOb, value == 2, switchOb.isSystem);
    switchOb.isSystem = value == 2 ? true : false;
  }

  ;

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
  }

  ;

  function updateThemeValue(theme) {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);
  }

  ;

  function setMatchMediaEvents(switchOb, addEvent, removeEvent) {
    if (addEvent) {
      switchOb.eventBind = systemUpdated.bind(switchOb);
      switchOb.mediaQueryList.addEventListener("change", switchOb.eventBind);
    } else if (removeEvent) switchOb.mediaQueryList.removeEventListener("change", switchOb.eventBind);
  }

  ;

  function systemUpdated() {
    var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = isDarkTheme ? this.themes[1] : this.themes[0],
        newIndex = isDarkTheme ? 3 : 2,
        oldIcon = isDarkTheme ? 2 : 3;
    updateIcon(this, newIndex, oldIcon);
    updateThemeValue(theme);
  }

  ;
  window.LdSwitch = LdSwitch;
  var ldSwitches = document.getElementsByClassName('js-ld-switch');

  if (ldSwitches.length > 0) {
    for (var i = 0; i < ldSwitches.length; i++) {
      new LdSwitch(ldSwitches[i]);
    }
  }
})();

/***/ }),

/***/ 570:
/***/ (() => {

// File#: _1_popover
// Usage: codyhouse.co/license
(function () {
  var Popover = function Popover(element) {
    this.element = element;
    this.elementId = this.element.getAttribute('id');
    this.trigger = document.querySelectorAll('[aria-controls="' + this.elementId + '"]');
    this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false; // focusable elements

    this.firstFocusable = false;
    this.lastFocusable = false; // position target - position tooltip relative to a specified element

    this.positionTarget = getPositionTarget(this); // gap between element and viewport - if there's max-height 

    this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
    initPopover(this);
    initPopoverEvents(this);
  }; // public methods


  Popover.prototype.togglePopover = function (bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function (target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function () {
    checkPopoverFocus(this);
  }; // private methods


  function getPositionTarget(popover) {
    // position tooltip relative to a specified element - if provided
    var positionTargetSelector = popover.element.getAttribute('data-position-target');
    if (!positionTargetSelector) return false;
    var positionTarget = document.querySelector(positionTargetSelector);
    return positionTarget;
  }

  ;

  function initPopover(popover) {
    // init aria-labels
    for (var i = 0; i < popover.trigger.length; i++) {
      Util.setAttributes(popover.trigger[i], {
        'aria-expanded': 'false',
        'aria-haspopup': 'true'
      });
    }
  }

  ;

  function initPopoverEvents(popover) {
    for (var i = 0; i < popover.trigger.length; i++) {
      (function (i) {
        popover.trigger[i].addEventListener('click', function (event) {
          event.preventDefault(); // if the popover had been previously opened by another trigger element -> close it first and reopen in the right position

          if (Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger != popover.trigger[i]) {
            togglePopover(popover, false, false); // close menu
          } // toggle popover


          popover.selectedTrigger = popover.trigger[i];
          togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
        });
      })(i);
    } // trap focus


    popover.element.addEventListener('keydown', function (event) {
      if (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    }); // custom events -> open/close popover

    popover.element.addEventListener('openPopover', function (event) {
      togglePopover(popover, true);
    });
    popover.element.addEventListener('closePopover', function (event) {
      togglePopover(popover, false, event.detail);
    });
  }

  ;

  function togglePopover(popover, bool, moveFocus) {
    // toggle popover visibility
    Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
    popover.popoverIsOpen = bool;

    if (bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover); // move focus

      focusPopover(popover);
      popover.element.addEventListener("transitionend", function (event) {
        focusPopover(popover);
      }, {
        once: true
      }); // position the popover element

      positionPopover(popover); // add class to popover trigger

      Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
    } else if (popover.selectedTrigger) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'false');
      if (moveFocus) Util.moveFocus(popover.selectedTrigger); // remove class from menu trigger

      Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
      popover.selectedTrigger = false;
    }
  }

  ;

  function focusPopover(popover) {
    if (popover.firstFocusable) {
      popover.firstFocusable.focus();
    } else {
      Util.moveFocus(popover.element);
    }
  }

  ;

  function positionPopover(popover) {
    // reset popover position
    resetPopoverStyle(popover);
    var selectedTriggerPosition = popover.positionTarget ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
    var menuOnTop = window.innerHeight - selectedTriggerPosition.bottom < selectedTriggerPosition.top;
    var left = selectedTriggerPosition.left,
        right = window.innerWidth - selectedTriggerPosition.right,
        isRight = window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth;
    var horizontal = isRight ? 'right: ' + right + 'px;' : 'left: ' + left + 'px;',
        vertical = menuOnTop ? 'bottom: ' + (window.innerHeight - selectedTriggerPosition.top) + 'px;' : 'top: ' + selectedTriggerPosition.bottom + 'px;'; // check right position is correct -> otherwise set left to 0

    if (isRight && right + popover.element.offsetWidth > window.innerWidth) horizontal = 'left: ' + parseInt((window.innerWidth - popover.element.offsetWidth) / 2) + 'px;'; // check if popover needs a max-height (user will scroll inside the popover)

    var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;
    var initialStyle = popover.element.getAttribute('style');
    if (!initialStyle) initialStyle = '';
    popover.element.setAttribute('style', initialStyle + horizontal + vertical + 'max-height:' + Math.floor(maxHeight) + 'px;');
  }

  ;

  function resetPopoverStyle(popover) {
    // remove popover inline style before appling new style
    popover.element.style.maxHeight = '';
    popover.element.style.top = '';
    popover.element.style.bottom = '';
    popover.element.style.left = '';
    popover.element.style.right = '';
  }

  ;

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if (!popover.popoverIsOpen) return;
    if (!popover.element.contains(target) && !target.closest('[aria-controls="' + popover.elementId + '"]')) togglePopover(popover, false);
  }

  ;

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if (!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  }

  ;

  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
    var allFocusable = popover.element.querySelectorAll(focusableElString);
    getFirstVisible(popover, allFocusable);
    getLastVisible(popover, allFocusable);
  }

  ;

  function getFirstVisible(popover, elements) {
    //get first visible focusable element inside the popover
    for (var i = 0; i < elements.length; i++) {
      if (isVisible(elements[i])) {
        popover.firstFocusable = elements[i];
        break;
      }
    }
  }

  ;

  function getLastVisible(popover, elements) {
    //get last visible focusable element inside the popover
    for (var i = elements.length - 1; i >= 0; i--) {
      if (isVisible(elements[i])) {
        popover.lastFocusable = elements[i];
        break;
      }
    }
  }

  ;

  function trapFocus(popover, event) {
    if (popover.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of popover
      event.preventDefault();
      popover.lastFocusable.focus();
    }

    if (popover.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of popover
      event.preventDefault();
      popover.firstFocusable.focus();
    }
  }

  ;

  function isVisible(element) {
    // check if element is visible
    return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  }

  ;
  window.Popover = Popover; //initialize the Popover objects

  var popovers = document.getElementsByClassName('js-popover'); // generic focusable elements string selector

  var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';

  if (popovers.length > 0) {
    var popoversArray = [];
    var scrollingContainers = [];

    for (var i = 0; i < popovers.length; i++) {
      (function (i) {
        popoversArray.push(new Popover(popovers[i]));
        var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
        if (scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
      })(i);
    } // listen for key events


    window.addEventListener('keyup', function (event) {
      if (event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        // close popover on 'Esc'
        popoversArray.forEach(function (element) {
          element.checkPopoverFocus();
        });
      }
    }); // close popover when clicking outside it

    window.addEventListener('click', function (event) {
      popoversArray.forEach(function (element) {
        element.checkPopoverClick(event.target);
      });
    }); // on resize -> close all popover elements

    window.addEventListener('resize', function (event) {
      popoversArray.forEach(function (element) {
        element.togglePopover(false, false);
      });
    }); // on scroll -> close all popover elements

    window.addEventListener('scroll', function (event) {
      popoversArray.forEach(function (element) {
        if (element.popoverIsOpen) element.togglePopover(false, false);
      });
    }); // take into account additinal scrollable containers

    for (var j = 0; j < scrollingContainers.length; j++) {
      var scrollingContainer = document.querySelector(scrollingContainers[j]);

      if (scrollingContainer) {
        scrollingContainer.addEventListener('scroll', function (event) {
          popoversArray.forEach(function (element) {
            if (element.popoverIsOpen) element.togglePopover(false, false);
          });
        });
      }
    }
  }
})();

/***/ }),

/***/ 996:
/***/ (() => {

// File#: _1_responsive-sidebar
// Usage: codyhouse.co/license
(function () {
  var Sidebar = function Sidebar(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="' + this.element.getAttribute('id') + '"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.showClass = "sidebar--is-visible";
    this.staticClass = "sidebar--static";
    this.customStaticClass = "";
    this.readyClass = "sidebar--loaded";
    this.contentReadyClass = "sidebar-loaded:show";
    this.layout = false; // this will be static or mobile

    this.preventScrollEl = getPreventScrollEl(this);
    getCustomStaticClass(this); // custom classes for static version

    initSidebar(this);
  };

  function getPreventScrollEl(element) {
    var scrollEl = false;
    var querySelector = element.element.getAttribute('data-sidebar-prevent-scroll');
    if (querySelector) scrollEl = document.querySelector(querySelector);
    return scrollEl;
  }

  ;

  function getCustomStaticClass(element) {
    var customClasses = element.element.getAttribute('data-static-class');
    if (customClasses) element.customStaticClass = ' ' + customClasses;
  }

  ;

  function initSidebar(sidebar) {
    initSidebarResize(sidebar); // handle changes in layout -> mobile to static and viceversa

    if (sidebar.triggers) {
      // open sidebar when clicking on trigger buttons - mobile layout only
      for (var i = 0; i < sidebar.triggers.length; i++) {
        sidebar.triggers[i].addEventListener('click', function (event) {
          event.preventDefault();
          toggleSidebar(sidebar, event.target);
        });
      }
    } // use the 'openSidebar' event to trigger the sidebar


    sidebar.element.addEventListener('openSidebar', function (event) {
      toggleSidebar(sidebar, event.detail);
    });
  }

  ;

  function toggleSidebar(sidebar, target) {
    if (Util.hasClass(sidebar.element, sidebar.showClass)) {
      sidebar.selectedTrigger = target;
      closeSidebar(sidebar);
      return;
    }

    sidebar.selectedTrigger = target;
    showSidebar(sidebar);
    initSidebarEvents(sidebar);
  }

  ;

  function showSidebar(sidebar) {
    // mobile layout only
    Util.addClass(sidebar.element, sidebar.showClass);
    getFocusableElements(sidebar);
    Util.moveFocus(sidebar.element); // change the overflow of the preventScrollEl

    if (sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = 'hidden';
  }

  ;

  function closeSidebar(sidebar) {
    // mobile layout only
    Util.removeClass(sidebar.element, sidebar.showClass);
    sidebar.firstFocusable = null;
    sidebar.lastFocusable = null;
    if (sidebar.selectedTrigger) sidebar.selectedTrigger.focus();
    sidebar.element.removeAttribute('tabindex'); //remove listeners

    cancelSidebarEvents(sidebar); // change the overflow of the preventScrollEl

    if (sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = '';
  }

  ;

  function initSidebarEvents(sidebar) {
    // mobile layout only
    //add event listeners
    sidebar.element.addEventListener('keydown', handleEvent.bind(sidebar));
    sidebar.element.addEventListener('click', handleEvent.bind(sidebar));
  }

  ;

  function cancelSidebarEvents(sidebar) {
    // mobile layout only
    //remove event listeners
    sidebar.element.removeEventListener('keydown', handleEvent.bind(sidebar));
    sidebar.element.removeEventListener('click', handleEvent.bind(sidebar));
  }

  ;

  function handleEvent(event) {
    // mobile layout only
    switch (event.type) {
      case 'click':
        {
          initClick(this, event);
        }

      case 'keydown':
        {
          initKeyDown(this, event);
        }
    }
  }

  ;

  function initKeyDown(sidebar, event) {
    // mobile layout only
    if (event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape') {
      //close sidebar window on esc
      closeSidebar(sidebar);
    } else if (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') {
      //trap focus inside sidebar
      trapFocus(sidebar, event);
    }
  }

  ;

  function initClick(sidebar, event) {
    // mobile layout only
    //close sidebar when clicking on close button or sidebar bg layer 
    if (!event.target.closest('.js-sidebar__close-btn') && !Util.hasClass(event.target, 'js-sidebar')) return;
    event.preventDefault();
    closeSidebar(sidebar);
  }

  ;

  function trapFocus(sidebar, event) {
    // mobile layout only
    if (sidebar.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of sidebar
      event.preventDefault();
      sidebar.lastFocusable.focus();
    }

    if (sidebar.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of sidebar
      event.preventDefault();
      sidebar.firstFocusable.focus();
    }
  }

  ;

  function initSidebarResize(sidebar) {
    // custom event emitted when window is resized - detect only if the sidebar--static@{breakpoint} class was added
    var beforeContent = getComputedStyle(sidebar.element, ':before').getPropertyValue('content');

    if (beforeContent && beforeContent != '' && beforeContent != 'none') {
      checkSidebarLayout(sidebar);
      sidebar.element.addEventListener('update-sidebar', function (event) {
        checkSidebarLayout(sidebar);
      });
    } // check if there a main element to show


    var mainContent = document.getElementsByClassName(sidebar.contentReadyClass);
    if (mainContent.length > 0) Util.removeClass(mainContent[0], sidebar.contentReadyClass);
    Util.addClass(sidebar.element, sidebar.readyClass);
  }

  ;

  function checkSidebarLayout(sidebar) {
    var layout = getComputedStyle(sidebar.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    if (layout == sidebar.layout) return;
    sidebar.layout = layout;
    if (layout != 'static') Util.addClass(sidebar.element, 'rz4-hide');
    Util.toggleClass(sidebar.element, sidebar.staticClass + sidebar.customStaticClass, layout == 'static');
    if (layout != 'static') setTimeout(function () {
      Util.removeClass(sidebar.element, 'rz4-hide');
    }); // reset element role 

    layout == 'static' ? sidebar.element.removeAttribute('role', 'alertdialog') : sidebar.element.setAttribute('role', 'alertdialog'); // reset mobile behaviour

    if (layout == 'static' && Util.hasClass(sidebar.element, sidebar.showClass)) closeSidebar(sidebar);
  }

  ;

  function getFocusableElements(sidebar) {
    //get all focusable elements inside the drawer
    var allFocusable = sidebar.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstVisible(sidebar, allFocusable);
    getLastVisible(sidebar, allFocusable);
  }

  ;

  function getFirstVisible(sidebar, elements) {
    //get first visible focusable element inside the sidebar
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) {
        sidebar.firstFocusable = elements[i];
        return true;
      }
    }
  }

  ;

  function getLastVisible(sidebar, elements) {
    //get last visible focusable element inside the sidebar
    for (var i = elements.length - 1; i >= 0; i--) {
      if (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) {
        sidebar.lastFocusable = elements[i];
        return true;
      }
    }
  }

  ;
  window.Sidebar = Sidebar; //initialize the Sidebar objects

  var sidebar = document.getElementsByClassName('js-sidebar');

  if (sidebar.length > 0) {
    var resetLayout = function resetLayout() {
      for (var i = 0; i < sidebar.length; i++) {
        (function (i) {
          sidebar[i].dispatchEvent(customEvent);
        })(i);
      }

      ;
    };

    for (var i = 0; i < sidebar.length; i++) {
      (function (i) {
        new Sidebar(sidebar[i]);
      })(i);
    } // switch from mobile to static layout


    var customEvent = new CustomEvent('update-sidebar');
    window.addEventListener('resize', function (event) {
      !window.requestAnimationFrame ? setTimeout(function () {
        resetLayout();
      }, 250) : window.requestAnimationFrame(resetLayout);
    });
    window.requestAnimationFrame // init sidebar layout
    ? window.requestAnimationFrame(resetLayout) : resetLayout();
    ;
  }
})();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _theme_popover__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(570);
/* harmony import */ var _theme_popover__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_theme_popover__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _theme_responsive_sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(996);
/* harmony import */ var _theme_responsive_sidebar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_theme_responsive_sidebar__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _theme_adv_custom_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);
/* harmony import */ var _theme_adv_custom_select__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_theme_adv_custom_select__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _theme_light_dark_switch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(37);
/* harmony import */ var _theme_light_dark_switch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_theme_light_dark_switch__WEBPACK_IMPORTED_MODULE_3__);
// 1

 // 2

 // 3


})();

/******/ })()
;