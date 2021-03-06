const Utils = require('../utils');
const Theme = require('../theme');
const Config = require('./config');
const Event = require('../core/event');
const Assets = require('./assets');
const SFX = require('./sfx');

AFRAME.registerComponent('icon-button', {
  schema: {
    disabled: {
      type: 'boolean',
      default: false
    },
    type: {
      type: "string",
      default: "raised"
    },
    name: {
      type: "string",
      default: ""
    },
    value: {
      type: "string",
      default: "Button"
    },
    buttonColor: {
      type: "color",
      default: "#4076fd"
    },
    color: {
      type: "color",
      default: "#FFF"
    },
    font: {
      type: "string",
      default: ""
    },
    letterSpacing: {
      type: "int",
      default: 0
    },
    lineHeight: {
      type: "string",
      default: ""
    },
    opacity: {
      type: "number",
      default: 1
    },
    width: {
      type: "number",
      default: 0.08
    },
    height: {
      type: "number",
      default: 0.08
    },
    radiusScale: {
      type: "number",
      default: 0.1
    },
    iconScale: {
      type: "number",
      default: 0.75
    },
    src: {
      type: "string",
      default: "#aframeButtonIcon"
    }
  },
  init: function () {
    var that = this;

    // Assets
    Utils.preloadAssets(Assets);

    // SFX
    SFX.init(this.el);

    // WRAPPER
    this.wrapper = document.createElement('a-entity');
    this.wrapper.setAttribute('position', '0 0 0.001')
    this.el.appendChild(this.wrapper);

    // SHADOW
    this.shadow = document.createElement('a-image');
    this.shadow.setAttribute('width', this.data.width * 1.17);
    this.shadow.setAttribute('height', this.data.height * 1.17);
    this.shadow.setAttribute('position', '0 0 -0.002');
    this.shadow.setAttribute('src', '#aframeButtonShadow');
    this.wrapper.appendChild(this.shadow);

    // OUTLINE
    this.outline = document.createElement('a-rounded');
    this.outline.setAttribute('width', this.data.width);
    this.outline.setAttribute('height', this.data.height);
    this.outline.setAttribute('radius', Math.max(this.data.width, this.data.height) * this.data.radiusScale);
    this.outline.setAttribute('position', `${-this.data.width/2} ${-this.data.height/2} 0`);
    this.wrapper.appendChild(this.outline);

    // ICON
    this.icon = document.createElement('a-image');
    this.icon.setAttribute('width', this.data.width * this.data.iconScale);
    this.icon.setAttribute('height', this.data.height * this.data.iconScale);
    this.icon.setAttribute('position', '0 0 0.001')
    this.icon.setAttribute('src', this.data.src);
    this.wrapper.appendChild(this.icon);


    // EVENTS
    this.el.addEventListener('click', function () {
      if (this.components['icon-button'] && this.components['icon-button'].data.disabled) {
        return;
      }
      // that.wrapper.appendChild(that.overlay);
      that.onClick();
    });
    this.el.addEventListener('mouseenter', function () {
      if (this.components['icon-button'] && this.components['icon-button'].data.disabled) {
        return;
      }
      Utils.updateOpacity(that.el, 0.92);
    });
    this.el.addEventListener('mouseleave', function () {
      if (this.components['icon-button'] && this.components['icon-button'].data.disabled) {
        return SFX.clickDisabled(this);
      }
      Utils.updateOpacity(that.el, 1);
    });
    this.el.addEventListener('mousedown', function () {
      if (this.components['icon-button'] && this.components['icon-button'].data.disabled) {
        return SFX.clickDisabled(this);
      }
      that.wrapper.setAttribute('position', `0 0 0.036`);
      Utils.updateOpacity(that.el, 0.84);
      SFX.click(this);
    });
    this.el.addEventListener('mouseup', function () {
      if (this.components.button && this.components.button.data.disabled) {
        return;
      }
      that.wrapper.setAttribute('position', `0 0 0`);
      Utils.updateOpacity(that.el, 1);
    });

    this.el.getWidth = this.getWidth.bind(this);
    Object.defineProperty(this.el, 'value', {
      get: function () {
        return this.getAttribute('value');
      },
      set: function (value) {
        this.setAttribute('value', value);
      },
      enumerable: true,
      configurable: true
    });
  },
  onClick: function () {
    //Event.emit(this.el, 'click');
  },
  getWidth: function () {
    return this.__width;
  },
  update: function () {
    var that = this;
    this.outline.setAttribute('color', this.data.buttonColor);
    this.icon.setAttribute('color', this.data.color);
    // this.overlay.setAttribute('color', this.data.color);

    Utils.updateOpacity(that.el, that.data.opacity);

    if (that.data.disabled) {
      that.shadow.setAttribute('visible', false);
      that.outline.setAttribute('color', '#C4C4C4');
      that.icon.setAttribute('color', '#B0B0B0');
    } else {
      let timer = setInterval(function () {
        if (that.icon.object3D.children[0] && that.icon.object3D.children[0].geometry.visibleGlyphs) {
          clearInterval(timer);
          Utils.updateOpacity(that.el, 1);
        }
      }, 10)
    }

    if (that.data.type === "flat") {
      that.shadow.setAttribute('visible', false);
      let timer = setInterval(function () {
        if (that.icon.object3D.children[0] && that.icon.object3D.children[0].geometry.visibleGlyphs) {
          clearInterval(timer);
          Utils.updateOpacity(that.el, 1);
          if (that.data.disabled) {
            that.outline.setAttribute('color', '#C4C4C4');
            that.icon.setAttribute('color', '#B0B0B0');
          }
        }
      }, 10)
    }
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-icon-button', {
  defaultComponents: {
    'icon-button': {}
  },
  mappings: {
    disabled: 'icon-button.disabled',
    type: 'icon-button.type',
    name: 'icon-button.name',
    value: 'icon-button.value',
    'button-color': 'icon-button.buttonColor',
    color: 'icon-button.color',
    font: 'icon-button.font',
    'letter-spacing': 'icon-button.letterSpacing',
    'line-height': 'icon-button.lineHeight',
    opacity: 'icon-button.opacity',
    width: 'icon-button.width',
    height: 'icon-button.height',
    'radius-scale': 'icon-button.radiusScale',
    'icon-scale': 'icon-button.iconScale',
    src: 'icon-button.src'
  }
});