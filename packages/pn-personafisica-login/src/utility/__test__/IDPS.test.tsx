import { getIDPS } from '../IDPS';

const providers = [
  'arubaid',
  'posteid',
  'infocertid',
  'spiditalia',
  'sielteid',
  'namirialid',
  'timid',
  'lepidaid',
  'teamsystemid',
  'ehtid',
  'infocamereid',
  'intesiid',
];

describe('IDPS utility test', () => {
  it('getIDPS - no test and no validation', () => {
    const idps = getIDPS();
    expect(idps.identityProviders).toHaveLength(providers.length);
    idps.identityProviders.forEach((idp, index) => {
      expect(idp.entityId).toBe(providers[index]);
    });
  });

  it('getIDPS - with test and validation', () => {
    const enrichedProvidres = [...providers, 'xx_testenv2', 'xx_validator'];
    const idps = getIDPS(true, true);
    expect(idps.identityProviders).toHaveLength(enrichedProvidres.length);
    idps.identityProviders.forEach((idp, index) => {
      expect(idp.entityId).toBe(enrichedProvidres[index]);
    });
  });
});
