import React from 'react';
import {HotTable} from '../src/common/index';
import {IndividualPropsWrapper, SingleObjectWrapper, wait} from './_helpers';

beforeEach(() => {
  let container = document.createElement('DIV');
  container.id = 'hotContainer';
  document.body.appendChild(container);
});

describe('Handsontable initialization', () => {
  it('should render Handsontable when using the HotTable component', () => {
    const wrapper = mount(<HotTable id="test-hot" data={[[2]]}/>, { attachTo: document.body.querySelector('#hotContainer') });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 300);
    }).then(() => {
      let hotInstance = wrapper.instance().hotInstance;

      expect(hotInstance).not.toBe(null);
      expect(hotInstance).not.toBe(void 0);
      expect(hotInstance.rootElement.id).toEqual('test-hot');
      wrapper.detach();
    });
  });

  it('should pass the provided properties to the Handsontable instance', () => {
    const wrapper = mount(<HotTable id="test-hot" contextMenu={true} rowHeaders={true} colHeaders={true} data={[[2]]}/>, { attachTo: document.body.querySelector('#hotContainer') });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 300);
    }).then(() => {
      let hotInstance = wrapper.instance().hotInstance;

      expect(hotInstance.getPlugin('contextMenu').isEnabled()).toBe(true);
      expect(hotInstance.getSettings().rowHeaders).toBe(true);
      expect(hotInstance.getSettings().colHeaders).toBe(true);
      expect(JSON.stringify(hotInstance.getData())).toEqual('[[2]]');
      wrapper.detach();
    });
  });
});

describe('Updating the Handsontable settings', () => {
  it('should call the updateSettings method of Handsontable, when the component properties get updated (when providing properties individually)', () => {
    const wrapper = mount(<IndividualPropsWrapper/>, { attachTo: document.body.querySelector('#hotContainer') });

    return wait(300, () => {
      const hotInstance = wrapper.instance().refs.hotTable.hotInstance;
      let updateSettingsCount = 0;

      hotInstance.addHook('afterUpdateSettings', () => {
        updateSettingsCount++;
      });

      return wait(300, () => {
        wrapper.instance().setState({hotSettings: {data: [[2]], contextMenu: true, readOnly: true}});

      }, () => {
        expect(updateSettingsCount).toEqual(1);
        wrapper.detach();
      });
    });
  });

  it('should call the updateSettings method of Handsontable, when the component properties get updated (when providing properties as a single settings object)', () => {
    const wrapper = mount(<SingleObjectWrapper/>, { attachTo: document.body.querySelector('#hotContainer') });

    return wait(300, () => {
      const hotInstance = wrapper.instance().refs.hotTable.hotInstance;
      let updateSettingsCount = 0;

      hotInstance.addHook('afterUpdateSettings', () => {
        updateSettingsCount++;
      });

      return wait(300, () => {
        wrapper.instance().setState({hotSettings: {data: [[2]], contextMenu: true, readOnly: true}});

      }, () => {
        expect(updateSettingsCount).toEqual(1);
        wrapper.detach();
      });
    });
  });

  it('should update the Handsontable options, when the component properties get updated (when providing properties individually)', () => {
    const wrapper = mount(<IndividualPropsWrapper/>, { attachTo: document.body.querySelector('#hotContainer') });

    return wait(300, () => {
      const hotInstance = wrapper.instance().refs.hotTable.hotInstance;

      expect(hotInstance.getSettings().contextMenu).toEqual(void 0);
      expect(hotInstance.getSettings().readOnly).toEqual(false);
      expect(JSON.stringify(hotInstance.getSettings().data)).toEqual('[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]');

      return wait(300, () => {
        wrapper.instance().setState({hotSettings: {data: [[2]], contextMenu: true, readOnly: true}});

      }, () => {
        expect(hotInstance.getSettings().contextMenu).toBe(true);
        expect(hotInstance.getSettings().readOnly).toBe(true);
        expect(JSON.stringify(hotInstance.getSettings().data)).toEqual('[[2]]');
        wrapper.detach();
      });
    });
  });

  it('should update the Handsontable options, when the component properties get updated (when providing properties as a single settings object)', () => {
    const wrapper = mount(<SingleObjectWrapper/>, { attachTo: document.body.querySelector('#hotContainer') });

    return wait(300, () => {
      const hotInstance = wrapper.instance().refs.hotTable.hotInstance;

      expect(hotInstance.getSettings().contextMenu).toEqual(void 0);
      expect(hotInstance.getSettings().readOnly).toEqual(false);
      expect(JSON.stringify(hotInstance.getSettings().data)).toEqual('[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]');

      return wait(300, () => {
        wrapper.instance().setState({hotSettings: {data: [[2]], contextMenu: true, readOnly: true}});

      }, () => {
        expect(hotInstance.getSettings().contextMenu).toBe(true);
        expect(hotInstance.getSettings().readOnly).toBe(true);
        expect(JSON.stringify(hotInstance.getSettings().data)).toEqual('[[2]]');
        wrapper.detach();
      });
    });
  });
});
