import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../axios';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { DelegationsApi } from '../Delegations.api';
import { Delegation } from '../../../redux/delegation/types';
import {
  arrayOfDelegates,
  arrayOfDelegators,
  mockCreateDelegation,
} from '../../../redux/delegation/__test__/test.utils';

async function getDelegates(response: Array<Delegation> | null) {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(`/mandate/api/v1/mandates-by-delegator`).reply(200, response);
  const res = await DelegationsApi.getDelegates();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

async function getDelegators(response: Array<Delegation> | null) {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(`/mandate/api/v1/mandates-by-delegate`).reply(200, response);
  const res = await DelegationsApi.getDelegators();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

async function createDelegation() {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onPost(`/mandate/api/v1/mandate`).reply(200, mockCreateDelegation);
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
    mock.onPatch('/mandate/api/v1/mandate/7/revoke').reply(200);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    mock.reset();
    mock.restore();
  });

  it("doesn't revoke a delegation", async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/mandate/api/v1/mandate/10/revoke').reply(204);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('rejects a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/mandate/api/v1/mandate/8/reject').reply(200);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
    mock.reset();
    mock.restore();
  });

  it("doesn't reject a delegation", async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/mandate/api/v1/mandate/10/reject').reply(204);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('accept a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/mandate/api/v1/mandate/9/accept').reply(200, {});
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
