import { ConsentType } from './../../../models/consents';
import { GET_CONSENTS, SET_CONSENTS } from '../consents.routes';

describe('Consents routes', () => {
  it('should compile GET_CONSENTS', () => {
    const route = GET_CONSENTS(ConsentType.TOS);
    expect(route).toEqual(`/user-consents/v1/consents/${ConsentType.TOS}`);
  });

  it('should compile SET_CONSENTS', () => {
    const route = SET_CONSENTS(ConsentType.TOS, '1');
    expect(route).toEqual(`/user-consents/v1/consents/${ConsentType.TOS}?version=1`);
  });
});
