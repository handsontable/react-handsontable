import {
  shallow,
  render,
  mount,
  configure
} from 'enzyme';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';
import moment from 'moment';
import numbro from 'numbro';
import pikaday from 'pikaday';
import Handsontable from 'handsontable';

configure({ adapter: new ReactSixteenAdapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.Handsontable = Handsontable;

console.error = message => {
  if (!/(React.createElement: type should not be null)/.test(message)) {
    throw new Error(message);
  }
};
