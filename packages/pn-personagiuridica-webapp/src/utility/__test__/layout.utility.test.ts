import * as routes from '../../navigation/routes.const';
import showLayoutParts from '../layout.utility';

describe('Tests layout utility', () => {
  it('everything is shown', () => {
    const [showSideMenu] = showLayoutParts('test-path', true, true, true);
    expect(showSideMenu).toBeTruthy();
  });

  it('not logged user', () => {
    const [showSideMenu] = showLayoutParts('test-path', false, true, true);
    expect(showSideMenu).toBeFalsy();
  });

  it('privacy and tos not accepted', () => {
    const [showSideMenu] = showLayoutParts('test-path', true, false, false);
    expect(showSideMenu).toBeFalsy();
  });

  it('wizard page', () => {
    const [showSideMenu] = showLayoutParts(routes.DIGITAL_DOMICILE_ACTIVATION, true, true, true);
    expect(showSideMenu).toBeFalsy();
  });
});
