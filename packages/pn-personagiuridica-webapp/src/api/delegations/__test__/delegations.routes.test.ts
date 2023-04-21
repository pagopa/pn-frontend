import {
  ACCEPT_DELEGATION,
  CREATE_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../delegations.routes';

describe('Delegations routes', () => {
  it('should compile DELEGATIONS_BY_DELEGATOR', () => {
    const route = DELEGATIONS_BY_DELEGATOR();
    expect(route).toEqual(`/mandate/api/v1/mandates-by-delegator`);
  });

  it('should compile DELEGATIONS_BY_DELEGATE', () => {
    const route = DELEGATIONS_BY_DELEGATE();
    expect(route).toEqual(`/mandate/api/v1/mandates-by-delegate`);
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
});
