import * as routes from '../navigation/routes.const';

function showHeader(pathname: string): boolean {
  return pathname !== '/privacy-tos';
}

function showFooter(pathname: string): boolean {
  return pathname !== '/privacy-tos';
}

const WIZARD_PAGES = [routes.DIGITAL_DOMICILE_ACTIVATION, routes.DIGITAL_DOMICILE_MANAGEMENT];

function showSideMenu(
  pathname: string,
  isLogged: boolean,
  tosAccepted: boolean,
  privacyAccepted: boolean
): boolean {
  return (
    pathname !== '/privacy-tos' &&
    pathname !== routes.SUPPORT &&
    isLogged &&
    tosAccepted &&
    privacyAccepted &&
    !WIZARD_PAGES.includes(pathname)
  );
}

function showHeaderProduct(
  pathname: string,
  tosAccepted: boolean,
  privacyAccepted: boolean
): boolean {
  return pathname !== routes.SUPPORT && tosAccepted && privacyAccepted;
}

function showAssistanceButton(pathname: string): boolean {
  return pathname !== routes.SUPPORT;
}

export default function showLayoutParts(
  path: string,
  isLogged: boolean,
  tosAccepted: boolean,
  privacyAccepted: boolean
) {
  return [
    showHeader(path),
    showFooter(path),
    showSideMenu(path, isLogged, tosAccepted, privacyAccepted),
    showHeaderProduct(path, tosAccepted, privacyAccepted),
    showAssistanceButton(path),
  ];
}
