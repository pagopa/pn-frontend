import * as routes from '../navigation/routes.const';

const WIZARD_PAGES = [routes.DIGITAL_DOMICILE_ACTIVATION, routes.DIGITAL_DOMICILE_MANAGEMENT];

function showSideMenu(
  pathname: string,
  isLogged: boolean,
  tosAccepted: boolean,
  privacyAccepted: boolean
): boolean {
  return (
    isLogged &&
    tosAccepted &&
    privacyAccepted &&
    !pathname.includes(routes.REGISTRA_CHIAVE_PUBBLICA) &&
    !WIZARD_PAGES.includes(pathname)
  );
}

export default function showLayoutParts(
  pathname: string,
  isLogged: boolean,
  tosAccepted: boolean,
  privacyAccepted: boolean
) {
  return [showSideMenu(pathname, isLogged, tosAccepted, privacyAccepted)];
}
