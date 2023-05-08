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
  COUNT_DELEGATORS,
  CREATE_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_NAME_BY_DELEGATE,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
  UPDATE_DELEGATION,
} from '../delegations.routes';
import { mockApi } from '../../../__test__/test-utils';
import { DelegationStatus } from '../../../models/Deleghe';

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
    const mock = mockApi(apiClient, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: arrayOfDelegators,
      moreResult: false,
      nextPagesKey: [],
    });
    const res = await DelegationsApi.getDelegators({ size: 10 });
    expect(res.resultsPage).toStrictEqual(arrayOfDelegators);
    mock.reset();
    mock.restore();
  });

  it('gets empty delegators', async () => {
    const mock = mockApi(apiClient, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: [],
      moreResult: false,
      nextPagesKey: [],
    });
    const res = await DelegationsApi.getDelegators({ size: 10 });
    expect(res.resultsPage).toHaveLength(0);
    mock.reset();
    mock.restore();
  });

  it('revokes a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('7'), 204);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    mock.reset();
    mock.restore();
  });

  it("doesn't revoke a delegation", async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('10'), 200);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('rejects a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('8'), 204);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
    mock.reset();
    mock.restore();
  });

  it("doesn't reject a delegation", async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('10'), 200);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
    mock.reset();
    mock.restore();
  });

  it('accept a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('9'), 204, undefined, {});
    const res = await DelegationsApi.acceptDelegation('9', {
      verificationCode: '12345',
      groups: [{ id: 'group-1', name: 'Group 1' }],
    });
    expect(res).toStrictEqual({ id: '9', groups: [{ id: 'group-1', name: 'Group 1' }] });
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

  it('count delegators', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      COUNT_DELEGATORS(DelegationStatus.PENDING),
      200,
      undefined,
      { value: 5 }
    );
    const res = await DelegationsApi.countDelegators(DelegationStatus.PENDING);
    expect(res).toStrictEqual({ value: 5 });
    mock.reset();
    mock.restore();
  });

  it('gets non empty delegators names', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_NAME_BY_DELEGATE(),
      200,
      undefined,
      arrayOfDelegators
    );
    const res = await DelegationsApi.getDelegatorsNames();
    expect(res).toStrictEqual(
      arrayOfDelegators.map((delegator) => ({
        id: delegator.delegator.fiscalCode,
        name: delegator.delegator.displayName,
        mandateIds: [delegator.mandateId],
      }))
    );
    mock.reset();
    mock.restore();
  });

  it('gets empty delegators names', async () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_NAME_BY_DELEGATE(), 200, undefined, []);
    const res = await DelegationsApi.getDelegatorsNames();
    expect(res).toHaveLength(0);
    mock.reset();
    mock.restore();
  });

  it('update a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', UPDATE_DELEGATION('9'), 204, undefined, {});
    const res = await DelegationsApi.updateDelegation('9', [{ id: 'group-1', name: 'Group 1' }]);
    expect(res).toStrictEqual({ id: '9', groups: [{ id: 'group-1', name: 'Group 1' }] });
    mock.reset();
    mock.restore();
  });
});
