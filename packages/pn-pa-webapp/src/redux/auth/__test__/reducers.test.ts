import { ConsentsApi } from '../../../api/consents/Consents.api';
import { ExternalRegistriesAPI } from '../../../api/external-registries/External-registries.api';
import { Consent, ConsentActionType, ConsentType } from '../../../models/consents';
import { Party } from '../../../models/party';
import { PartyRole, PNRole } from '../../../models/user';
import { store } from '../../store';
import { acceptToS, getOrganizationParty } from '../actions';
import { getToSApproval } from '../actions';
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
      tos: false,
      isFirstAccept: true,
      consentVersion: '',
      fetchedTos: false,
      messageUnauthorizedUser: { title: '', message: '' },
      isClosedSession: false,
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

  it('Should be able to fetch the tos approval', async () => {
    const tosMock = {
      recipientId: 'mock-recipient-id',
      consentType: ConsentType.TOS,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };
    const apiSpy = jest.spyOn(ConsentsApi, 'getConsentByType');
    apiSpy.mockResolvedValue(tosMock);
    const action = await store.dispatch(getToSApproval());
    const payload = action.payload as Consent;
    expect(action.type).toBe('getToSApproval/fulfilled');
    expect(payload).toEqual(tosMock);
    apiSpy.mockRestore();
  });

  it('Should NOT be able to fetch the tos approval', async () => {
    const tosMock = {
      recipientId: 'mock-recipient-id',
      consentType: ConsentType.TOS,
      accepted: false,
      isFirstAccept: true,
    };
    const apiSpy = jest.spyOn(ConsentsApi, 'getConsentByType');
    apiSpy.mockRejectedValue(tosMock);
    const action = await store.dispatch(getToSApproval());
    const payload = action.payload as Consent;
    expect(action.type).toBe('getToSApproval/rejected');
    expect(payload).toEqual(tosMock);
    apiSpy.mockRestore();
  });

  it('Should be able to fetch tos acceptance', async () => {
    const tosAcceptanceMock = 'success';
    const apiSpy = jest.spyOn(ConsentsApi, 'setConsentByType');
    apiSpy.mockResolvedValue(tosAcceptanceMock);
    const action = await store.dispatch(acceptToS('mock-version-1'));
    const payload = action.payload as string;
    expect(action.type).toBe('acceptToS/fulfilled');
    expect(payload).toEqual(tosAcceptanceMock);
  });

  it('Should NOT be able to fetch tos acceptance', async () => {
    const tosAcceptanceMock = 'error';
    const apiSpy = jest.spyOn(ConsentsApi, 'setConsentByType');
    apiSpy.mockRejectedValue(tosAcceptanceMock);
    const action = await store.dispatch(acceptToS('mock-version-1'));
    const payload = action.payload as string;
    expect(action.type).toBe('acceptToS/rejected');
    expect(payload).toEqual(tosAcceptanceMock);
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
