import React, {Suspense, lazy} from 'react';
import {
  mount,
  ReactWrapper
} from 'enzyme';
import {
  HotTable
} from '../src/hotTable';
import {
  mockElementDimensions,
  sleep,
} from './_helpers';
import Handsontable from 'handsontable';

beforeEach(() => {
  let container = document.createElement('DIV');
  container.id = 'hotContainer';
  document.body.appendChild(container);
});

describe('React.lazy', () => {
  it('should be possible to lazy-load components and utilize Suspend', async (done) => {
    function RendererComponent2 (props) {
      return (
        <>
          lazy value: {props.value}
        </>
      );
    }

    let resolveImport = false;

    function SuspendedRenderer(props) {
      const customImportPromise = new Promise(function (resolve, reject) {
            const interval = setInterval(() => {
              if (resolveImport) {
                resolve({
                  default: RendererComponent2,
                  __esModule: true
                });

                clearInterval(interval);
              }
            }, 20);
          }
        ) as any;

      const LazierRenderer = lazy(() => customImportPromise);

      return (
        <Suspense fallback={<>loading-message</>}>
          <LazierRenderer {...props}></LazierRenderer>
        </Suspense>
      )
    }

    const wrapper: ReactWrapper<{}, {}, any> = mount(
      <HotTable licenseKey="non-commercial-and-evaluation"
                id="test-hot"
                data={Handsontable.helper.createSpreadsheetData(1, 1)}
                width={300}
                height={300}
                rowHeights={23}
                colWidths={50}
                init={function () {
                  mockElementDimensions(this.rootElement, 300, 300);
                }}>
        <SuspendedRenderer hot-renderer/>
      </HotTable>, {attachTo: document.body.querySelector('#hotContainer')}
    );

    await sleep(100);

    const hotTableInstance = wrapper.instance();
    const hotInstance = hotTableInstance.hotInstance;

    expect(hotInstance.getCell(0, 0).innerHTML).toEqual('<div>loading-message</div>');

    resolveImport = true;

    await sleep(40);

    expect(hotInstance.getCell(0, 0).innerHTML).toEqual('<div>lazy value: A1</div>');

    wrapper.detach();

    done();
  });
});
