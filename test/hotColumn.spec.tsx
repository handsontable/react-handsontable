import React from 'react';
import {
  mount,
  ReactWrapper
} from 'enzyme';
import {
  HotTable
} from '../src/hotTable';
import {
  HotColumn
} from '../src/hotColumn';

beforeEach(() => {
  let container = document.createElement('DIV');
  container.id = 'hotContainer';
  document.body.appendChild(container);
});

describe('Passing column settings using HotColumn', () => {
  it('should apply the Handsontable settings passed as HotColumn arguments to the Handsontable instance', () => {
    const wrapper: ReactWrapper<{}, {}, HotTable> = mount(
      <HotTable licenseKey="non-commercial-and-evaluation" id="test-hot" data={[[2]]}>
        <HotColumn title="test title"></HotColumn>
        <HotColumn readOnly={true}></HotColumn>
      </HotTable>, {attachTo: document.body.querySelector('#hotContainer')}
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 300);
    }).then(() => {
      let hotInstance = wrapper.instance().hotInstance;

      expect(hotInstance.getSettings().columns[0].title).toEqual('test title');
      expect(hotInstance.getSettings().columns[0].readOnly).toEqual(void 0);

      expect(hotInstance.getSettings().columns[1].title).toEqual(void 0);
      expect(hotInstance.getSettings().columns[1].readOnly).toEqual(true);

      wrapper.detach();
    });
  });
});
