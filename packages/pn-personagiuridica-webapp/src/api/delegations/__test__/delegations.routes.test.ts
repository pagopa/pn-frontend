import { DelegationStatus } from '../../../models/Deleghe';
import {
  ACCEPT_DELEGATION,
  COUNT_DELEGATORS,
  CREATE_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_NAME_BY_DELEGATE,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../delegations.routes';

describe('Delegations routes', () => {
  it('should compile DELEGATIONS_BY_DELEGATOR', () => {
    const route = DELEGATIONS_BY_DELEGATOR();
    expect(route).toEqual(`/mandate/api/v1/mandates-by-delegator`);
  });

  it('should compile DELEGATIONS_BY_DELEGATE', () => {
    const route = DELEGATIONS_BY_DELEGATE({ size: 10 });
    expect(route).toEqual(`/mandate/api/v1/mandates-by-delegate?size=10`);
  });

  it('should compile CREATE_DELEGATION', () => {
    const route = CREATE_DELEGATION();
    expect(route).toEqual(`/mandate/api/v1/mandate`);
  });

  it('should compile REVOKE_DELEGATION', () => {
    const route = REVOKE_DELEGATION('mocked-id');
    expect(route).toEqual(`/mandate/api/v1/mandate/mocked-id/revoke`);
  });

  it('should compile REJECT_DELEGATION', () => {
    const route = REJECT_DELEGATION('mocked-id');
    expect(route).toEqual(`/mandate/api/v1/mandate/mocked-id/reject`);
  });

  it('should compile ACCEPT_DELEGATION', () => {
    const route = ACCEPT_DELEGATION('mocked-id');
    expect(route).toEqual(`/mandate/api/v1/mandate/mocked-id/accept`);
  });

  it('should compile COUNT_DELEGATORS', () => {
    const route = COUNT_DELEGATORS(DelegationStatus.ACTIVE);
    expect(route).toEqual(`/mandate/api/v1/count-by-delegate?status=active`);
  });

  it('should compile DELEGATIONS_NAME_BY_DELEGATE', () => {
    const route = DELEGATIONS_NAME_BY_DELEGATE();
    expect(route).toEqual(`/mandate/api/v1/mandates-by-delegate`);
  });
});
