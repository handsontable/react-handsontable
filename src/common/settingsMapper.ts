import Handsontable from 'hot-alias';
import { HotTableProps } from './index';

export class SettingsMapper {
  private registeredHooks: string[];

  constructor() {
    this.registeredHooks = Handsontable.hooks.getRegistered();
  }

  /**
   * Parse component settings into Handosntable-compatible settings.
   *
   * @param {Object} properties Object containing properties from the HotTable object.
   * @returns {Object} Handsontable-compatible settings object.
   */
  getSettings(properties: HotTableProps): Handsontable.DefaultSettings {
    let newSettings: Handsontable.DefaultSettings = {};

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
