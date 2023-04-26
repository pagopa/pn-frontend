import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
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

describe('Delegations api tests', () => {
  mockAuthentication();

  it('gets non empty delegates', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_BY_DELEGATOR(),
      200,
      undefined,
      arrayOfDelegates
    );
    const res = await DelegationsApi.getDelegatesByCompany();
    expect(res).toStrictEqual(arrayOfDelegates);
    mock.reset();
    mock.restore();
  });

  it('gets empty delegates', async () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, []);
    const res = await DelegationsApi.getDelegatesByCompany();
    expect(res).toHaveLength(0);
    mock.reset();
    mock.restore();
  });

  it('gets non empty delegators', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_BY_DELEGATE(),
      200,
      undefined,
      arrayOfDelegators
    );
    const res = await DelegationsApi.getDelegators();
    expect(res).toStrictEqual(arrayOfDelegators);
    mock.reset();
    mock.restore();
  });

  it('gets empty delegators', async () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATE(), 200, undefined, []);
    const res = await DelegationsApi.getDelegators();
    expect(res).toHaveLength(0);
    mock.reset();
    mock.restore();
  });

  it('revokes a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('7'), 200, undefined, undefined);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    mock.reset();
    mock.restore();
  });

  it("doesn't revoke a delegation", async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('10'), 204, undefined, undefined);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('rejects a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('8'), 200, undefined, undefined);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
    mock.reset();
    mock.restore();
  });

  it("doesn't reject a delegation", async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('10'), 204, undefined, undefined);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('accept a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('9'), 200, undefined, {});
    const res = await DelegationsApi.acceptDelegation('9', { verificationCode: '12345' });
    expect(res).toStrictEqual({ id: '9' });
    mock.reset();
    mock.restore();
  });

  it('creates a new delegation', async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      mockCreateDelegation,
      mockCreateDelegation
    );
    const res = await DelegationsApi.createDelegation(mockCreateDelegation);
    expect(res).toStrictEqual(mockCreateDelegation);
    mock.reset();
    mock.restore();
  });
});
