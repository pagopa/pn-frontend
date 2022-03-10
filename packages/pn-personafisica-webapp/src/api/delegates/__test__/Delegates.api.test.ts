import MockAdapter from 'axios-mock-adapter'; 
import { User } from '../../../redux/auth/types';
import { Delegation } from '../../../redux/delegation/types';
import { authClient } from '../../axios';

import { DelegatesApi } from '../Delegates.api';

const user: User = {
    sessionToken: 'mocked-session-token',
    name: 'Mario',
    family_name: 'Rossi',
    fiscal_number: 'RSSMRA80A01H501U',
    email: 'info@agid.gov.it',
    mobile_phone: '333333334',
    from_aa: false,
    uid: 'mocked-uid',
    level: 'L2',
    iat: 1646394256,
    exp: 1646397856,
    iss: 'spid-hub-test.dev.pn.pagopa.it',
    jti: 'mocked-jti',
};

const delegationResponse:Delegation = { 
    user,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    delegationRole: 'delegated',
    delegationStatus: 'accepted',
    visibilityIds: {
        id: "6734289379",
        role: 'referente operativo'
    },
    verificationCode: "23324"
};

const arrayOfDelegations = new Array(10).fill(delegationResponse);

export async function getDelegates() {
    const axiosMock = new MockAdapter(authClient);
    axiosMock.onGet(`/delegates`).reply(200, arrayOfDelegations);
    const res = await DelegatesApi.getDelegate();
    axiosMock.reset();
    axiosMock.restore();
    return res;
}

describe('delegates api tests', () => {
    it('get delegates', async() => {
      const res = await getDelegates();
      expect(res.data).toStrictEqual(arrayOfDelegations);
    });
  });
