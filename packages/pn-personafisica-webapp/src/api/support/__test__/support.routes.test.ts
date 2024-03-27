import { ZENDESK_AUTHORIZATION } from '../support.routes';

describe('Support routes', () => {
  it('should compile ZENDESK_AUTHORIZATION', () => {
    const route = ZENDESK_AUTHORIZATION();
    expect(route).toEqual('/zendesk-authorization/new-support-request');
  });
});
