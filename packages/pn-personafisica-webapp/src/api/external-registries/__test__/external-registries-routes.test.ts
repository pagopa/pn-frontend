import { GET_ALL_ACTIVATED_PARTIES } from "../external-registries-routes";


describe('Consents routes', () => {
  it('should compile GET_ALL_ACTIVATED_PARTIES', () => {
    const route = GET_ALL_ACTIVATED_PARTIES(undefined);
    expect(route).toEqual(`/ext-registry/pa/v1/activated-on-pn`);
  });

  it('should compile GET_ALL_ACTIVATED_PARTIES', () => {
    const route = GET_ALL_ACTIVATED_PARTIES({ paNameFilter: 'paName' });
    expect(route).toEqual(`/ext-registry/pa/v1/activated-on-pn?paNameFilter=paName`);
  });
});