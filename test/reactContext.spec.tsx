import React from 'react';
import {
  mount,
  ReactWrapper
} from 'enzyme';
import {
  HotTable
} from '../src/hotTable';
import {
  mockElementDimensions,
  sleep
} from './_helpers';
import { BaseEditorComponent } from '../src/baseEditorComponent';
import Handsontable from 'handsontable';

beforeEach(() => {
  let container = document.createElement('DIV');
  container.id = 'hotContainer';
  document.body.appendChild(container);
});

describe('React Context', () => {
  it('should be possible to declare a context and use it inside both renderers and editors', async (done) => {
    function RendererComponent2() {
      return (
        <TestContext.Consumer>
          {(context) => <>{context}</>}
        </TestContext.Consumer>
      );
    }

    class EditorComponent2 extends BaseEditorComponent {
      render(): React.ReactElement<string> {
        return (
          <div>
            <TestContext.Consumer>
              {(context) => <>{context}</>}
            </TestContext.Consumer>
          </div>
        );
      }
    }

    let hotTableInstance = null;
    const TestContext = React.createContext('def-test-val');

    const wrapper: ReactWrapper<{}, {}, typeof HotTable> = mount(
      <TestContext.Provider value={'testContextValue'}>
        <HotTable licenseKey="non-commercial-and-evaluation"
                  id="test-hot"
                  data={Handsontable.helper.createSpreadsheetData(3, 2)}
                  width={300}
                  height={300}
                  rowHeights={23}
                  colWidths={50}
                  init={function () {
                    mockElementDimensions(this.rootElement, 300, 300);
                  }}
                  ref={function (instance) {
                    hotTableInstance = instance;
                  }}>
          <RendererComponent2 hot-renderer/>
          <EditorComponent2 hot-editor/>
        </HotTable>
      </TestContext.Provider>, {attachTo: document.body.querySelector('#hotContainer')}
    );

    await sleep(100);

    const hotInstance = hotTableInstance.hotInstance;

    expect(hotInstance.getCell(0, 0).innerHTML).toEqual('<div>testContextValue</div>');
    expect(hotInstance.getCell(0, 1).innerHTML).toEqual('<div>testContextValue</div>');

    expect(document.querySelector('#hot-wrapper-editor-container-EditorComponent2').innerHTML).toEqual('<div>testContextValue</div>');

    wrapper.detach();
    done();
  });
});
