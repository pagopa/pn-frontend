import * as routes from '../../navigation/routes.const';
import showLayoutParts from '../layout.utility';

describe('Tests layout utility', () => {
  it('everything is shown', () => {
    const [showHeader, showFooter, showSideMenu, showHeaderProduct, showAssistanceButton] =
      showLayoutParts('/test-path', true, true, true);
    expect(showHeader).toBeTruthy();
    expect(showFooter).toBeTruthy();
    expect(showSideMenu).toBeTruthy();
    expect(showHeaderProduct).toBeTruthy();
    expect(showAssistanceButton).toBeTruthy();
  });

  it('privacy-tos page', () => {
    const [showHeader, showFooter, showSideMenu, showHeaderProduct, showAssistanceButton] =
      showLayoutParts('/privacy-tos', true, true, true);
    expect(showHeader).toBeFalsy();
    expect(showFooter).toBeFalsy();
    expect(showSideMenu).toBeFalsy();
    expect(showHeaderProduct).toBeTruthy();
    expect(showAssistanceButton).toBeTruthy();
  });

  it('assistance page', () => {
    const [showHeader, showFooter, showSideMenu, showHeaderProduct, showAssistanceButton] =
      showLayoutParts('/assistenza', true, true, true);
    expect(showHeader).toBeTruthy();
    expect(showFooter).toBeTruthy();
    expect(showSideMenu).toBeFalsy();
    expect(showHeaderProduct).toBeFalsy();
    expect(showAssistanceButton).toBeFalsy();
  });

  it('not logged user', () => {
    const [showHeader, showFooter, showSideMenu, showHeaderProduct, showAssistanceButton] =
      showLayoutParts('/test-path', false, true, true);
    expect(showHeader).toBeTruthy();
    expect(showFooter).toBeTruthy();
    expect(showSideMenu).toBeFalsy();
    expect(showHeaderProduct).toBeTruthy();
    expect(showAssistanceButton).toBeTruthy();
  });

  it('privacy and tos not accepted', () => {
    const [showHeader, showFooter, showSideMenu, showHeaderProduct, showAssistanceButton] =
      showLayoutParts('/test-path', true, false, false);
    expect(showHeader).toBeTruthy();
    expect(showFooter).toBeTruthy();
    expect(showSideMenu).toBeFalsy();
    expect(showHeaderProduct).toBeFalsy();
    expect(showAssistanceButton).toBeTruthy();
  });

  it('wizard page', () => {
    const [showHeader, showFooter, showSideMenu, showHeaderProduct, showAssistanceButton] =
      showLayoutParts(routes.DIGITAL_DOMICILE_ACTIVATION, true, true, true);
    expect(showHeader).toBeTruthy();
    expect(showFooter).toBeTruthy();
    expect(showSideMenu).toBeFalsy();
    expect(showHeaderProduct).toBeTruthy();
    expect(showAssistanceButton).toBeTruthy();
  });
});
