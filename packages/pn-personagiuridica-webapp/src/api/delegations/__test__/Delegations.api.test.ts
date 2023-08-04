import MockAdapter from 'axios-mock-adapter';

import { mockApi } from '../../../__test__/test-utils';
import { DelegationStatus } from '../../../models/Deleghe';
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
    mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, arrayOfDelegates);
    const res = await DelegationsApi.getDelegatesByCompany();
    expect(res).toStrictEqual(arrayOfDelegates);
  });

  it('gets empty delegates', async () => {
    mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, []);
    const res = await DelegationsApi.getDelegatesByCompany();
    expect(res).toHaveLength(0);
  });

  it('gets non empty delegators', async () => {
    mock = mockApi(apiClient, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: arrayOfDelegators,
      moreResult: false,
      nextPagesKey: [],
    });
    const res = await DelegationsApi.getDelegators({ size: 10 });
    expect(res.resultsPage).toStrictEqual(arrayOfDelegators);
  });

  it('gets empty delegators', async () => {
    mock = mockApi(apiClient, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: [],
      moreResult: false,
      nextPagesKey: [],
    });
    const res = await DelegationsApi.getDelegators({ size: 10 });
    expect(res.resultsPage).toHaveLength(0);
  });

  it('revokes a delegation', async () => {
    mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('7'), 204);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
  });

  it("doesn't revoke a delegation", async () => {
    mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('10'), 200);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
  });

  it('rejects a delegation', async () => {
    mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('8'), 204);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
  });

  it("doesn't reject a delegation", async () => {
    mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('10'), 200);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
  });

  it('accept a delegation', async () => {
    mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('9'), 204, undefined, {});
    const res = await DelegationsApi.acceptDelegation('9', {
      verificationCode: '12345',
      groups: [{ id: 'group-1', name: 'Group 1' }],
    });
    expect(res).toStrictEqual({ id: '9', groups: [{ id: 'group-1', name: 'Group 1' }] });
  });

  it('creates a new delegation', async () => {
    mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      mockCreateDelegation,
      mockCreateDelegation
    );
    const res = await DelegationsApi.createDelegation(mockCreateDelegation);
    expect(res).toStrictEqual(mockCreateDelegation);
  });

  it('count delegators', async () => {
    mock = mockApi(apiClient, 'GET', COUNT_DELEGATORS(DelegationStatus.PENDING), 200, undefined, {
      value: 5,
    });
    const res = await DelegationsApi.countDelegators(DelegationStatus.PENDING);
    expect(res).toStrictEqual({ value: 5 });
  });

  it('gets non empty delegators names', async () => {
    mock = mockApi(
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
  });

  it('gets empty delegators names', async () => {
    mock = mockApi(apiClient, 'GET', DELEGATIONS_NAME_BY_DELEGATE(), 200, undefined, []);
    const res = await DelegationsApi.getDelegatorsNames();
    expect(res).toHaveLength(0);
  });

  it('update a delegation', async () => {
    mock = mockApi(apiClient, 'PATCH', UPDATE_DELEGATION('9'), 204, undefined, {});
    const res = await DelegationsApi.updateDelegation('9', [{ id: 'group-1', name: 'Group 1' }]);
    expect(res).toStrictEqual({ id: '9', groups: [{ id: 'group-1', name: 'Group 1' }] });
  });
});
