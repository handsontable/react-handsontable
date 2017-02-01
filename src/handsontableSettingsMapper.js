export default class HotSettingsMapper {
  constructor() {
    this.registeredHooks = Handsontable.hooks.getRegistered();
  }

  getSettings(properties) {
    let newSettings = {};

    if(properties.settings) {
      let settings = properties.settings;
      for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
          newSettings[this.trimHookPrefix(key)] = settings[key];
        }
      }
    }

    for (const key in properties) {
      if (key != 'settings' && properties.hasOwnProperty(key)) {
        newSettings[this.trimHookPrefix(key)] = properties[key];
      }
    }

    return newSettings;
  }

  trimHookPrefix(prop) {
    if (prop.indexOf('on') === 0) {
      let hookName = prop.charAt(2).toLowerCase() + prop.slice(3, prop.length);
      if (this.registeredHooks.indexOf(hookName)) {
        return hookName;
      }
    }

    return prop;
  }
}