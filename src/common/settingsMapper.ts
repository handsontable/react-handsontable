import Handsontable from 'hot-alias';

export class SettingsMapper {

  // TODO: this should be removed after the release of Handsontable 5.0.0+. It's a workaround for a faulty Handsontable definition file.
  private hooks: any;

  private registeredHooks: string[];

  constructor() {
    this.hooks = Handsontable.hooks;
    this.registeredHooks = this.hooks.getRegistered();
  }

  /**
   * Parse component settings into Handosntable-compatible settings.
   *
   * @param {Object} properties Object containing properties from the HotTable object.
   * @returns {Object} Handsontable-compatible settings object.
   */
  getSettings(properties: {settings?: object}): object {
    let newSettings: object = {};

    if(properties.settings) {
      let settings = properties.settings;
      for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
          newSettings[this.trimHookPrefix(key)] = settings[key];
        }
      }
    }

    for (const key in properties) {
      if (key !== 'settings' && properties.hasOwnProperty(key)) {
        newSettings[this.trimHookPrefix(key)] = properties[key];
      }
    }

    return newSettings;
  }

  /**
   * Trim the "on" hook prefix.
   *
   * @param {String} prop Settings property.
   * @returns {String} Handsontable-compatible, prefix-less property name.
   */
  trimHookPrefix(prop: string): string {
    if (prop.indexOf('on') === 0) {
      let hookName = prop.charAt(2).toLowerCase() + prop.slice(3, prop.length);
      if (this.registeredHooks.indexOf(hookName) > -1) {
        return hookName;
      }
    }

    // returns the string anyway, when we're sure all the hooks are registered, might be changed
    return prop;
  }
}
