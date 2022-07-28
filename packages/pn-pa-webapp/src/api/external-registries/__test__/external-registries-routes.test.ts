import { GET_PARTY_FOR_ORGANIZATION } from "../external-registries-routes";

describe('External registries routes', () => {
  it('should compile GET_PARTY_FOR_ORGANIZATION', () => {
    const route = GET_PARTY_FOR_ORGANIZATION('toto');
    expect(route).toEqual('/ext-registry/pa/v1/activated-on-pn?id=toto');
  });
});
