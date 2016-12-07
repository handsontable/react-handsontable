export default class HotSettingsMapper {
  getSettings(properties) {
    let newSettings = {};

    if(properties.settings) {
      let settings = properties.settings;
      for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
          newSettings[key] = settings[key];
        }
      }

      delete properties.settings;
    }

    for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
        newSettings[key] = properties[key];
      }
    }

    return newSettings;
  }
}