import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../axios';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { Party } from '../../../models/party';
import { NOTIFICATION_DETAIL } from '../../notifications/notifications.routes';
import { notificationFromBe, notificationToFe } from '../../../redux/notification/__test__/test-utils';
import { NotificationsApi } from '../../notifications/Notifications.api';

// const faNulla = () => {};

// const id = x => Promise.resolve(x);

describe('External registries api tests', () => {
  mockAuthentication();

  it('getOrganizationParty', async () => {
    const partyMock: Party = { id: 'id-toto', name: 'Totito' };

    const axiosMock = new MockAdapter(apiClient);
    axiosMock.onGet(GET_PARTY_FOR_ORGANIZATION('id-toto')).reply(200, [partyMock]);
    const res = await ExternalRegistriesAPI.getOrganizationParty('id-toto');
    expect(res).toStrictEqual(partyMock);
    axiosMock.reset();
    axiosMock.restore();
  });

  describe.skip('Tentativi disperati', () => {
    mockAuthentication();
    // faNulla();

    it.skip('getOrganizationParty', async () => {
      const partyMock: Party = { id: 'id-toto', name: 'Toto' };

      // const axiosMock = new MockAdapter(apiClient);
      // axiosMock
      //   .onGet(GET_PARTY_FOR_ORGANIZATION('id-toto'))
      //   .reply(200, [partyMock]);
      const res = await ExternalRegistriesAPI.getOrganizationParty('id-toto');
      // const res = await id(partyMock);
      expect(res).toStrictEqual(partyMock);
      // axiosMock.reset();
      // axiosMock.restore();
    });

    it.skip('getSentNotification', async () => {
      const iun = 'mocked-iun';
      const mock = new MockAdapter(apiClient);
      mock.onGet(NOTIFICATION_DETAIL(iun)).reply(200, notificationFromBe);
      const res = await NotificationsApi.getSentNotification(iun);
      expect(res).toStrictEqual(notificationToFe);
      mock.reset();
      mock.restore();
    });
  });
});



