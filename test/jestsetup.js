import { shallow, render, mount } from 'enzyme';
import moment from 'moment';
import numbro from 'numbro';
import pikaday from 'pikaday';
import Zeroclipboard from 'zeroclipboard';
import Handsontable from 'handsontable';

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.Handsontable = Handsontable;

console.error = message => {
  if (!/(React.createElement: type should not be null)/.test(message)) {
    throw new Error(message);
  }
};