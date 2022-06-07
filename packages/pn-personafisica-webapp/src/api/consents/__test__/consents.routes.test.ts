import { ConsentType } from './../../../models/consents';
import { CONSENTS } from '../consents.routes';

describe('Consents routes', () => {
  it('should compile CONSENTS', () => {
    const route = CONSENTS(ConsentType.TOS);
    expect(route).toEqual(`/user-consents/v1/consents/${ConsentType.TOS}`);
  });
});
