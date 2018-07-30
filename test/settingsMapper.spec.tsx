import {SettingsMapper} from '../src/common/settingsMapper';

describe('Settings mapper unit tests', () => {
  describe('getSettings', () => {
    it('should return a valid settings object, when provided an object with settings (including the hooks prefixed with "on")', () => {
      const settingsMapper = new SettingsMapper();
      const initial = {
        width: 300,
        height: 300,
        contextMenu: true,
        columns: [
          {label: 'first label'},
          {label: 'second label'}
        ],
        onAfterChange: () => {
          return 'works!';
        },
        onAfterRender: () => {
          return 'also works!';
        }
      };
      const result = settingsMapper.getSettings(initial);

      expect(!!result.width && !!result.height && !!result.contextMenu && !!result.columns && !!result.afterChange && !!result.afterRender).toEqual(true);
      expect(Object.keys(initial).length).toEqual(Object.keys(result).length);
      expect(result.width).toEqual(300);
      expect(result.height).toEqual(300);
      expect(result.contextMenu).toEqual(true);
      expect(JSON.stringify(initial.columns)).toEqual(JSON.stringify(result.columns));
      expect(result.onAfterChange).toEqual(void 0);
      expect(result.onAfterRender).toEqual(void 0);
      expect(JSON.stringify(result.afterChange)).toEqual(JSON.stringify(initial.onAfterChange));
      expect(JSON.stringify(result.afterRender)).toEqual(JSON.stringify(initial.onAfterRender));
      expect(result.afterChange()).toEqual('works!');
      expect(result.afterRender()).toEqual('also works!');
    });

    it('should return a valid settings object, when provided an object with settings inside a "settings" property (including the hooks prefixed with "on")', () => {
      const settingsMapper = new SettingsMapper();
      const initial = {
        settings: {
          width: 300,
          height: 300,
          contextMenu: true,
          columns: [
            {label: 'first label'},
            {label: 'second label'}
          ],
          onAfterChange: () => {
            return 'works!';
          },
          onAfterRender: () => {
            return 'also works!';
          }
        }
      };
      const result = settingsMapper.getSettings(initial);

      expect(!!result.width && !!result.height && !!result.contextMenu && !!result.columns && !!result.afterChange && !!result.afterRender).toEqual(true);
      expect(Object.keys(initial.settings).length).toEqual(Object.keys(result).length);
      expect(result.width).toEqual(300);
      expect(result.height).toEqual(300);
      expect(result.contextMenu).toEqual(true);
      expect(JSON.stringify(initial.settings.columns)).toEqual(JSON.stringify(result.columns));
      expect(result.onAfterChange).toEqual(void 0);
      expect(result.onAfterRender).toEqual(void 0);
      expect(JSON.stringify(result.afterChange)).toEqual(JSON.stringify(initial.settings.onAfterChange));
      expect(JSON.stringify(result.afterRender)).toEqual(JSON.stringify(initial.settings.onAfterRender));
      expect(result.afterChange()).toEqual('works!');
      expect(result.afterRender()).toEqual('also works!');
      expect(result.settings).toEqual(void 0);
    });

    it('should return a valid settings object, when provided an object with settings inside a "settings" property as well as individually (including the hooks prefixed with "on")', () => {
      const settingsMapper = new SettingsMapper();
      const initial = {
        width: 300,
        height: 300,
        settings: {
          contextMenu: true,
          columns: [
            {label: 'first label'},
            {label: 'second label'}
          ],
          onAfterChange: () => {
            return 'works!';
          },
          onAfterRender: () => {
            return 'also works!';
          }
        }
      };
      const result = settingsMapper.getSettings(initial);

      expect(!!result.width && !!result.height && !!result.contextMenu && !!result.columns && !!result.afterChange && !!result.afterRender).toEqual(true);
      expect(Object.keys(initial.settings).length + Object.keys(initial).length - 1).toEqual(Object.keys(result).length);
      expect(result.width).toEqual(300);
      expect(result.height).toEqual(300);
      expect(result.contextMenu).toEqual(true);
      expect(JSON.stringify(initial.settings.columns)).toEqual(JSON.stringify(result.columns));
      expect(result.onAfterChange).toEqual(void 0);
      expect(result.onAfterRender).toEqual(void 0);
      expect(JSON.stringify(result.afterChange)).toEqual(JSON.stringify(initial.settings.onAfterChange));
      expect(JSON.stringify(result.afterRender)).toEqual(JSON.stringify(initial.settings.onAfterRender));
      expect(result.afterChange()).toEqual('works!');
      expect(result.afterRender()).toEqual('also works!');
      expect(result.settings).toEqual(void 0);
    });
  });

  describe('trimHookPrefix', () => {
    it('should trim the "on" prefix from the provided string and make the resulting string camelCase', () => {
      const settingsMapper = new SettingsMapper();

      expect(settingsMapper.trimHookPrefix('onAfterRender')).toEqual('afterRender');
      expect(settingsMapper.trimHookPrefix('onAfterChange')).toEqual('afterChange');
      expect(settingsMapper.trimHookPrefix('onBeforePaste')).toEqual('beforePaste');

      // should not work for non-hook names
      expect(settingsMapper.trimHookPrefix('onRandomString')).toEqual('onRandomString');
    });
  });
});
