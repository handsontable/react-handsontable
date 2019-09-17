import React from 'react';
import {
  mount,
  ReactWrapper
} from 'enzyme';
import Handsontable from 'handsontable';
import { HotTable } from '../src/hotTable';
import { HotColumn } from '../src/hotColumn';
import {
  RendererComponent,
  mockElementDimensions,
  sleep,
  EditorComponent,
  simulateKeyboardEvent,
  simulateMouseEvent
} from './_helpers';

beforeEach(() => {
  let container = document.createElement('DIV');
  container.id = 'hotContainer';
  document.body.appendChild(container);
});

describe('Passing column settings using HotColumn', () => {
  it('should apply the Handsontable settings passed as HotColumn arguments to the Handsontable instance', async (done) => {
    const wrapper: ReactWrapper<{}, {}, typeof HotTable> = mount(
      <HotTable licenseKey="non-commercial-and-evaluation" id="test-hot" data={[[2]]}>
        <HotColumn title="test title"></HotColumn>
        <HotColumn readOnly={true}></HotColumn>
      </HotTable>, {attachTo: document.body.querySelector('#hotContainer')}
    );

    await sleep(300);

    let hotInstance = wrapper.instance().hotInstance;

    expect(hotInstance.getSettings().columns[0].title).toEqual('test title');
    expect(hotInstance.getSettings().columns[0].readOnly).toEqual(void 0);

    expect(hotInstance.getSettings().columns[1].title).toEqual(void 0);
    expect(hotInstance.getSettings().columns[1].readOnly).toEqual(true);

    expect(hotInstance.getSettings().licenseKey).toEqual('non-commercial-and-evaluation');

    wrapper.detach();

    done();
  });
});

describe('Renderer configuration using React components', () => {
  it('should use the renderer component as Handsontable renderer, when it\'s nested under HotColumn and assigned the \'hot-renderer\' attribute', async (done) => {
    const wrapper: ReactWrapper<{}, {}, typeof HotTable> = mount(
      <HotTable licenseKey="non-commercial-and-evaluation"
                id="test-hot"
                data={Handsontable.helper.createSpreadsheetData(100, 2)}
                width={300}
                height={300}
                init={function() {
                  mockElementDimensions(this.rootElement, 300, 300);
                }}>
        <HotColumn/>
        <HotColumn>
          <RendererComponent hot-renderer></RendererComponent>
        </HotColumn>
      </HotTable>, {attachTo: document.body.querySelector('#hotContainer')}
    );

    await sleep(300);

    let hotInstance = wrapper.instance().hotInstance;

    expect(hotInstance.getCell(0, 0).innerHTML).toEqual('A1');
    expect(hotInstance.getCell(0, 1).innerHTML).toEqual('<div>value: B1</div>');

    hotInstance.scrollViewportTo(99, 0);
    hotInstance.render();

    await sleep(300);

    expect(hotInstance.getCell(99, 0).innerHTML).toEqual('A100');
    expect(hotInstance.getCell(99, 1).innerHTML).toEqual('<div>value: B100</div>');

    wrapper.detach();

    done();
  });
});

describe('Editor configuration using React components', () => {
  it('should use the editor component as Handsontable editor, when it\'s nested under HotTable and assigned the \'hot-editor\' attribute', async (done) => {
    const wrapper: ReactWrapper<{}, {}, typeof HotTable> = mount(
      <HotTable licenseKey="non-commercial-and-evaluation"
                id="test-hot"
                data={Handsontable.helper.createSpreadsheetData(3, 2)}
                width={300}
                height={300}
                rowHeights={23}
                colWidths={50}
                init={function () {
                  mockElementDimensions(this.rootElement, 300, 300);
                }}>
        <HotColumn/>
        <HotColumn>
          <EditorComponent hot-editor></EditorComponent>
        </HotColumn>
      </HotTable>, {attachTo: document.body.querySelector('#hotContainer')}
    );

    await sleep(100);

    const hotInstance = wrapper.instance().hotInstance;

    expect((document.querySelector('#editorComponentContainer') as any).style.display).toEqual('none');

    hotInstance.selectCell(0,1);
    simulateKeyboardEvent('keydown', 13);

    expect((document.querySelector('#editorComponentContainer') as any).style.display).toEqual('block');

    expect(hotInstance.getDataAtCell(0,1)).toEqual('B1');

    simulateMouseEvent(document.querySelector('#editorComponentContainer button'), 'click');

    expect(hotInstance.getDataAtCell(0,1)).toEqual('new-value');

    hotInstance.getActiveEditor().close();

    expect((document.querySelector('#editorComponentContainer') as any).style.display).toEqual('none');

    hotInstance.selectCell(0,0);
    simulateKeyboardEvent('keydown', 13);

    expect((document.querySelector('#editorComponentContainer') as any).style.display).toEqual('none');

    done();
  });
});
