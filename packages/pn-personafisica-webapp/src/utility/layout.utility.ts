import * as routes from '../navigation/routes.const';

function showHeader(path: string): boolean {
  return path !== 'privacy-tos';
}

function showFooter(path: string): boolean {
  return path !== 'privacy-tos';
}

function showSideMenu(
  path: string,
  isLogged: boolean,
  tosAccepted: boolean,
  privacyAccepted: boolean
): boolean {
  return (
    path !== 'privacy-tos' &&
    path !== routes.SUPPORT.slice(1) &&
    isLogged &&
    tosAccepted &&
    privacyAccepted
  );
}

function showHeaderProduct(path: string, tosAccepted: boolean, privacyAccepted: boolean): boolean {
  return path !== routes.SUPPORT.slice(1) && tosAccepted && privacyAccepted;
}

function showAssistanceButton(path: string): boolean {
  return path !== routes.SUPPORT.slice(1);
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
