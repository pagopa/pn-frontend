import { ExternalRegistriesAPI } from '../../../api/external-registries/External-registries.api';
import { Party } from '../../../models/party';
import { PartyRole, PNRole } from '../../../models/user';
import { store } from '../../store';
import { getOrganizationParty } from '../actions';
import { User } from '../types';
import { mockLogin, mockLogout, userResponse } from './test-utils';

describe('Auth redux state tests', () => {
  it('Initial state', () => {
    const state = store.getState().userState;
    expect(state).toEqual({
      loading: false,
      user: sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user') || '')
        : {
            email: '',
            name: '',
            uid: '',
            sessionToken: '',
            family_name: '',
            fiscal_number: '',
            organization: {
              id: '',
              roles: [
                {
                  role: PNRole.ADMIN,
                  partyRole: PartyRole.MANAGER,
                },
              ],
              fiscal_code: '',
            },
            desired_exp: 0,
          },
      organizationParty: {
        id: '',
        name: '',
      } as Party,
      isUnauthorizedUser: false,
      messageUnauthorizedUser: { title: '', message: '' },
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await mockLogin();
    const payload = action.payload as User;

    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(payload).toEqual(userResponse);
  });

  it('Should be able to logout', async () => {
    const action = await mockLogout();
    const payload = action.payload;

    expect(action.type).toBe('logout/fulfilled');
    expect(payload).toEqual({
      email: '',
      name: '',
      uid: '',
      sessionToken: '',
      family_name: '',
      fiscal_number: '',
      organization: {
        id: '',
        roles: [
          {
            role: PNRole.ADMIN,
            partyRole: PartyRole.MANAGER,
          },
        ],
        fiscal_code: '',
      },
    });
  });

  it('Should be able to fetch the organization party', async () => {
    const partyMock = { id: 'b6c5b42a-8a07-436f-96ce-8c2ab7f4dbd2', name: 'Comune di Valsamoggia' };
    const apiSpy = jest.spyOn(ExternalRegistriesAPI, 'getOrganizationParty');
    apiSpy.mockResolvedValue(partyMock);
    const action = await store.dispatch(getOrganizationParty('mocked-organization-id'));
    const payload = action.payload as Party;
    expect(action.type).toBe('getOrganizationParty/fulfilled');
    expect(payload).toEqual(partyMock);
    // this kind of restore are not usually needed because most tests integrate the
    // mockAuthorization function, which clears all mocks/spies after each test file.
    // As this particular test file involves authorization, then it is not convenient to
    // call mockAuthorization, hence the mocks/spies must be cleaned in each test.
    // ------------
    // Carlos Lombardi, 2022.07.28
    apiSpy.mockRestore();
  });
});
