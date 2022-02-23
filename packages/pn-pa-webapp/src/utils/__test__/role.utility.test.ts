import { UserRole } from '../../models/user';
import { DASHBOARD } from '../../navigation/routes.const';
import { getMenuItems, getHomePage, ReferenteAmministrativoMenuItems, ReferenteTecnicoMenuItems } from '../role.utility';

test('return menu items for role REFERENTE_AMMINISTRATIVO', () => {
  const items = getMenuItems(UserRole.REFERENTE_AMMINISTRATIVO);
  expect(items).toEqual(ReferenteAmministrativoMenuItems);
});

test('return menu items for role REFERENTE_OPERATIVO', () => {
  const items = getMenuItems(UserRole.REFERENTE_OPERATIVO);
  expect(items).toEqual(ReferenteTecnicoMenuItems);
});

test('return home page for role REFERENTE_AMMINISTRATIVO', () => {
  const home = getHomePage(UserRole.REFERENTE_AMMINISTRATIVO);
  expect(home).toBe(DASHBOARD);
});

test('return home page for role REFERENTE_OPERATIVO', () => {
  const home = getHomePage(UserRole.REFERENTE_OPERATIVO);
  expect(home).toBe(DASHBOARD);
});