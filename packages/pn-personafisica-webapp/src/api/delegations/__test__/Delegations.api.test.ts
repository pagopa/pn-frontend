import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { Delegation } from '../../../redux/delegation/types';
import {
  arrayOfDelegates,
  arrayOfDelegators,
  mockCreateDelegation,
} from '../../../redux/delegation/__test__/test.utils';
import { apiClient } from '../../apiClients';
import { DelegationsApi } from '../Delegations.api';
import {
  ACCEPT_DELEGATION,
  CREATE_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../delegations.routes';
import { mockApi } from '../../../__test__/test-utils';

async function getDelegates(response: Array<Delegation> | null) {
  mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, response);
  const res = await DelegationsApi.getDelegates();
  return res;
}

async function getDelegators(response: Array<Delegation> | null) {
  mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATE(), 200, undefined, response);
  const res = await DelegationsApi.getDelegators();
  return res;
}

async function createDelegation() {
  mockApi(apiClient, 'POST', CREATE_DELEGATION(), 200, undefined, mockCreateDelegation);
  const res = await DelegationsApi.createDelegation(mockCreateDelegation);
  return res;
}

describe('Delegations api tests', () => {
  let mock: MockAdapter;
  mockAuthentication();
  afterEach(() => {
    if (mock) {
      mock.restore();
      mock.reset();
    }
  });

  it('gets non empty delegates', async () => {
    const res = await getDelegates(arrayOfDelegates);
    expect(res).toStrictEqual(arrayOfDelegates);
  });

  it('gets empty delegates', async () => {
    const res = await getDelegates([]);
    expect(res).toHaveLength(0);
  });

  it('gets non empty delegators', async () => {
    const res = await getDelegators(arrayOfDelegators);
    expect(res).toStrictEqual(arrayOfDelegators);
  });

  it('gets empty delegators', async () => {
    const res = await getDelegators([]);
    expect(res).toHaveLength(0);
  });

  it('revokes a delegation', async () => {
    mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('7'), 204, undefined);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
  });

  it("doesn't revoke a delegation", async () => {
    mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('10'), 200, undefined);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
  });

  it('rejects a delegation', async () => {
    mockApi(apiClient, 'PATCH', REJECT_DELEGATION('8'), 204, undefined);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
  });

  it("doesn't reject a delegation", async () => {
    mockApi(apiClient, 'PATCH', REJECT_DELEGATION('10'), 200, undefined);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
  });

  it('accept a delegation', async () => {
    mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('9'), 204, undefined, {});
    const res = await DelegationsApi.acceptDelegation('9', { verificationCode: '12345' });
    expect(res).toStrictEqual({ id: '9' });
  });

  it('creates a new delegation', async () => {
    new MockAdapter(apiClient);
    const res = await createDelegation();
    expect(res).toStrictEqual(mockCreateDelegation);
  });

});
