
export type IdentityProvider = {
  identifier: string;
  entityId: string;
  name: string;
  imageUrl: string;
};

const testProvider = {
  identifier: 'test',
  entityId: 'xx_testenv2',
  name: 'test',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Test-Logo.svg',
};

const validatorProvider = {
  identifier: 'validator',
  entityId: 'xx_validator',
  name: 'validator',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Validator-Test.png',
};

export const getIDPS =
  (testEnabled: boolean = false, validatorEnabled: boolean = false):
    { identityProviders: Array<IdentityProvider>; richiediSpid: string } =>
      ({
        identityProviders: [
          {
            identifier: 'Aruba',
            entityId: 'arubaid',
            name: 'Aruba.it ID',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-arubaid.png',
          },
          {
            identifier: 'Poste',
            entityId: 'posteid',
            name: 'Poste ID',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-posteid.png',
          },
          {
            identifier: 'Infocert',
            entityId: 'infocertid',
            name: 'Infocert ID',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-infocertid.png',
          },
          {
            identifier: 'Register',
            entityId: 'spiditalia',
            name: 'SpidItalia',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-spiditalia.png',
          },
          {
            identifier: 'Sielte',
            entityId: 'sielteid',
            name: 'Sielte id',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-sielteid.png',
          },
          {
            identifier: 'Namirial',
            entityId: 'namirialid',
            name: 'Namirial ID',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-namirialid.png',
          },
          {
            identifier: 'Tim',
            entityId: 'timid',
            name: 'TIM id',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-timid.png',
          },
          {
            identifier: 'Lepida',
            entityId: 'lepidaid',
            name: 'Lepida id',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-lepidaid.png',
          },
          {
            identifier: 'TeamSystem',
            entityId: 'teamsystemid',
            name: 'TeamSystem',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-teamsystemid.png',
          },
          {
            identifier: 'EtnaHitech',
            entityId: 'ehtid',
            name: 'Etna Hitech S.C.p.A.',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-etnaid.png',
          },
          {
            identifier: 'InfoCamere',
            entityId: 'infocamereid',
            name: 'InfoCamere S.C.p.A.',
            imageUrl: 'https://assets.cdn.io.italia.it/spid/idps/spid-idp-infocamereid.png',
          },
          ...(testEnabled ? [testProvider] : []),
          ...(validatorEnabled ? [validatorProvider] : []),
        ],
        richiediSpid: 'https://www.spid.gov.it/cos-e-spid/come-attivare-spid/',
      });
