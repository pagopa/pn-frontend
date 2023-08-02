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
import { cleanupMock, mockApi } from '../../../__test__/test-utils';

async function getDelegates(response: Array<Delegation> | null) {
  const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, response);
  const res = await DelegationsApi.getDelegates();
  cleanupMock(mock);
  return res;
}

async function getDelegators(response: Array<Delegation> | null) {
  const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATE(), 200, undefined, response);
  const res = await DelegationsApi.getDelegators();
  cleanupMock(mock);
  return res;
}

async function createDelegation() {
  const mock = mockApi(apiClient, 'POST', CREATE_DELEGATION(), 200, undefined, mockCreateDelegation);
  const res = await DelegationsApi.createDelegation(mockCreateDelegation);
  cleanupMock(mock);
  return res;
}

describe('Delegations api tests', () => {
  mockAuthentication();

  it('gets non empty delegates', async () => {
    const res = await getDelegates(arrayOfDelegates);
    expect(res).toStrictEqual(arrayOfDelegates);
  });

  it('gets empty delegates', async () => {
    const res = await getDelegates([]);
    expect(res).toHaveLength(0);
  });

  it('gets delegates with status code 400', async () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 400, undefined, { error: "Invalid request" });
    await expect(DelegationsApi.getDelegates()).rejects.toThrowError("Request failed with status code 400");
    cleanupMock(mock);
  });

  it('gets non empty delegators', async () => {
    const res = await getDelegators(arrayOfDelegators);
    expect(res).toStrictEqual(arrayOfDelegators);
  });

  it('gets empty delegators', async () => {
    const res = await getDelegators([]);
    expect(res).toHaveLength(0);
  });

  it('gets delegators with status code 400', async () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATE(), 400, undefined, { error: "Invalid request" });
    await expect(DelegationsApi.getDelegators()).rejects.toThrowError("Request failed with status code 400");
    cleanupMock(mock);
  });

  it('revokes a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('7'), 204, undefined);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    cleanupMock(mock);
  });

  it("doesn't revoke a delegation", async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('10'), 200, undefined);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    cleanupMock(mock);
  });

  it("revokes a delegations with status code 400", async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('10'), 400, undefined, { error: "Invalid request" });
    await expect(DelegationsApi.revokeDelegation('10')).rejects.toThrowError('Request failed with status code 400');
    cleanupMock(mock);
  });

  it('rejects a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('8'), 204, undefined);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
    cleanupMock(mock);
  });

  it("doesn't reject a delegation", async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('10'), 200, undefined);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    cleanupMock(mock);
  });

  it('accept a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('9'), 204, undefined, {});
    const res = await DelegationsApi.acceptDelegation('9', { verificationCode: '12345' });
    expect(res).toStrictEqual({ id: '9' });
    cleanupMock(mock);
  });

  it('creates a new delegation', async () => {
    const mock = new MockAdapter(apiClient);
    const res = await createDelegation();
    expect(res).toStrictEqual(mockCreateDelegation);
    cleanupMock(mock);
  });

  it('creates a new delegation with status code 400', async () => {
    const mock = mockApi(apiClient, 'POST', CREATE_DELEGATION(), 400, undefined, { error: "Invalid request" });
    await expect(DelegationsApi.createDelegation(mockCreateDelegation)).rejects.toThrowError('Request failed with status code 400');
    cleanupMock(mock);
  });
});
