import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@pagopa-pn/pn-pa-webapp/src/api/axios';
import { User } from '../../../redux/auth/types';
import { Delegation } from '../../../redux/delegation/types';
import { authClient } from '../../axios';

import { DelegationsApi } from '../Delegations.api';

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

const delegationResponse: Delegation = {
  user,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  delegationRole: 'delegator',
  delegationStatus: 'accepted',
  visibilityIds: {
    id: '6734289379',
    role: 'referente operativo',
  },
  verificationCode: '23324',
};

const arrayOfDelegations = new Array(10).fill(delegationResponse);

export async function getDelegates() {
  const axiosMock = new MockAdapter(authClient);
  axiosMock.onGet(`/delegations`).reply(200, arrayOfDelegations);
  const res = await DelegationsApi.getDelegates();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

describe('Delegations api tests', () => {
  it('get delegations', async () => {
    const res = await getDelegates();
    expect(res.data).toStrictEqual(arrayOfDelegations);
  });

  it('revokes a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/delegations/7/revoke').reply(204);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual('success');
    mock.reset();
    mock.restore();
  });
});
