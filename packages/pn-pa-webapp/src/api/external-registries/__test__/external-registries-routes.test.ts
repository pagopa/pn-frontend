import { GET_PARTY_FOR_ORGANIZATION, GET_INSTITUTIONS, GET_INSTITUTION_PRODUCTS } from "../external-registries-routes";

describe('External registries routes', () => {
  it('should compile GET_PARTY_FOR_ORGANIZATION', () => {
    const route = GET_PARTY_FOR_ORGANIZATION('toto');
    expect(route).toEqual('/ext-registry/pa/v1/activated-on-pn?id=toto');
  });

  it('should compile GET_INSTITUTIONS', () => {
    const route = GET_INSTITUTIONS();
    expect(route).toEqual('/ext-registry/pa/v1/institutions');
  });

  it('should compile GET_INSTITUTION_PRODUCTS', () => {
    const route = GET_INSTITUTION_PRODUCTS('1');
    expect(route).toEqual('/ext-registry/pa/v1/institutions/1/products');
  });
});
