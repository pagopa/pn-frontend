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

async function getDelegates(response: Array<Delegation> | null) {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, response);
  const res = await DelegationsApi.getDelegates();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

async function getDelegators(response: Array<Delegation> | null) {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, response);
  const res = await DelegationsApi.getDelegators();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

async function createDelegation() {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onPost(CREATE_DELEGATION()).reply(200, mockCreateDelegation);
  const res = await DelegationsApi.createDelegation(mockCreateDelegation);
  axiosMock.reset();
  axiosMock.restore();
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

  it('gets non empty delegators', async () => {
    const res = await getDelegators(arrayOfDelegators);
    expect(res).toStrictEqual(arrayOfDelegators);
  });

  it('gets empty delegators', async () => {
    const res = await getDelegators([]);
    expect(res).toHaveLength(0);
  });

  it('revokes a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch(REVOKE_DELEGATION('7')).reply(200);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    mock.reset();
    mock.restore();
  });

  it("doesn't revoke a delegation", async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch(REVOKE_DELEGATION('10')).reply(204);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('rejects a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch(REJECT_DELEGATION('8')).reply(200);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
    mock.reset();
    mock.restore();
  });

  it("doesn't reject a delegation", async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch(REJECT_DELEGATION('10')).reply(204);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('accept a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch(ACCEPT_DELEGATION('9')).reply(200, {});
    const res = await DelegationsApi.acceptDelegation('9', { verificationCode: '12345' });
    expect(res).toStrictEqual({ id: '9' });
    mock.reset();
    mock.restore();
  });

  it('creates a new delegation', async () => {
    const mock = new MockAdapter(apiClient);
    const res = await createDelegation();
    expect(res).toStrictEqual(mockCreateDelegation);
    mock.reset();
    mock.restore();
  });
});
