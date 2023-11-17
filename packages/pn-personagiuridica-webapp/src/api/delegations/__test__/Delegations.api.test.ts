import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  arrayOfDelegates,
  arrayOfDelegators,
  mockCreateDelegation,
} from '../../../__mocks__/Delegations.mock';
import { DelegationStatus } from '../../../models/Deleghe';
import { getApiClient } from '../../apiClients';
import { DelegationsApi } from '../Delegations.api';
import {
  ACCEPT_DELEGATION,
  COUNT_DELEGATORS,
  CREATE_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
  UPDATE_DELEGATION,
} from '../delegations.routes';

describe('Delegations api tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('gets non empty delegates', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    const res = await DelegationsApi.getDelegatesByCompany();
    expect(res).toStrictEqual(arrayOfDelegates);
  });

  it('gets empty delegates', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    const res = await DelegationsApi.getDelegatesByCompany();
    expect(res).toHaveLength(0);
  });

  it('gets non empty delegators', async () => {
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: arrayOfDelegators,
      moreResult: false,
      nextPagesKey: [],
    });
    const res = await DelegationsApi.getDelegators({ size: 10 });
    expect(res.resultsPage).toStrictEqual(arrayOfDelegators);
  });

  it('gets empty delegators', async () => {
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: [],
      moreResult: false,
      nextPagesKey: [],
    });
    const res = await DelegationsApi.getDelegators({ size: 10 });
    expect(res.resultsPage).toHaveLength(0);
  });

  it('revokes a delegation', async () => {
    mock.onPatch(REVOKE_DELEGATION('7')).reply(204, { id: '7' });
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
  });

  it("doesn't revoke a delegation", async () => {
    mock.onPatch(REVOKE_DELEGATION('10')).reply(200);
    const res = await DelegationsApi.revokeDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
  });

  it('rejects a delegation', async () => {
    mock.onPatch(REJECT_DELEGATION('8')).reply(204);
    const res = await DelegationsApi.rejectDelegation('8');
    expect(res).toStrictEqual({ id: '8' });
  });

  it("doesn't reject a delegation", async () => {
    mock.onPatch(REJECT_DELEGATION('10')).reply(200);
    const res = await DelegationsApi.rejectDelegation('10');
    expect(res).toStrictEqual({ id: '-1' });
  });

  it('accept a delegation', async () => {
    mock.onPatch(ACCEPT_DELEGATION('9')).reply(204);
    const res = await DelegationsApi.acceptDelegation('9', {
      verificationCode: '12345',
      groups: [{ id: 'group-1', name: 'Group 1' }],
    });
    expect(res).toStrictEqual({ id: '9', groups: [{ id: 'group-1', name: 'Group 1' }] });
  });

  it('creates a new delegation', async () => {
    mock.onPost(CREATE_DELEGATION(), mockCreateDelegation).reply(200, mockCreateDelegation);
    const res = await DelegationsApi.createDelegation(mockCreateDelegation);
    expect(res).toStrictEqual(mockCreateDelegation);
  });

  it('count delegators', async () => {
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, { value: 5 });
    const res = await DelegationsApi.countDelegators(DelegationStatus.PENDING);
    expect(res).toStrictEqual({ value: 5 });
  });

  it('update a delegation', async () => {
    mock.onPatch(UPDATE_DELEGATION('9')).reply(204, { id: '9' });
    const res = await DelegationsApi.updateDelegation('9', [{ id: 'group-1', name: 'Group 1' }]);
    expect(res).toStrictEqual({ id: '9', groups: [{ id: 'group-1', name: 'Group 1' }] });
  });
});
