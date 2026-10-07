import arubaidLogo from '../assets/IDPS/arubaid.png';
import posteidLogo from '../assets/IDPS/posteid.png';
import infocertidLogo from '../assets/IDPS/infocertid.png';
import spiditaliaLogo from '../assets/IDPS/spiditalia.png';
import sielteidLogo from '../assets/IDPS/sielteid.png';
import namirialidLogo from '../assets/IDPS/namirialid.png';
import timidLogo from '../assets/IDPS/timid.png';
import lepidaidLogo from '../assets/IDPS/lepidaid.png';
import teamsystemidLogo from '../assets/IDPS/teamsystemid.png';
import ehtidLogo from '../assets/IDPS/ehtid.png';
import infocamereidLogo from '../assets/IDPS/infocamereid.png';
import intesiidLogo from '../assets/IDPS/intesiid.png';

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

export const getIDPS = (
  testEnabled: boolean = false,
  validatorEnabled: boolean = false
): { identityProviders: Array<IdentityProvider>; richiediSpid: string } => ({
  identityProviders: [
    {
      identifier: 'Aruba',
      entityId: 'arubaid',
      name: 'Aruba.it ID',
      imageUrl: arubaidLogo,
    },
    {
      identifier: 'Poste',
      entityId: 'posteid',
      name: 'Poste ID',
      imageUrl: posteidLogo,
    },
    {
      identifier: 'Infocert',
      entityId: 'infocertid',
      name: 'Infocert ID',
      imageUrl: infocertidLogo,
    },
    {
      identifier: 'Register',
      entityId: 'spiditalia',
      name: 'SpidItalia',
      imageUrl: spiditaliaLogo,
    },
    {
      identifier: 'Sielte',
      entityId: 'sielteid',
      name: 'Sielte id',
      imageUrl: sielteidLogo,
    },
    {
      identifier: 'Namirial',
      entityId: 'namirialid',
      name: 'Namirial ID',
      imageUrl: namirialidLogo,
    },
    {
      identifier: 'Tim',
      entityId: 'timid',
      name: 'TIM id',
      imageUrl: timidLogo,
    },
    {
      identifier: 'Lepida',
      entityId: 'lepidaid',
      name: 'Lepida id',
      imageUrl: lepidaidLogo,
    },
    {
      identifier: 'TeamSystem',
      entityId: 'teamsystemid',
      name: 'TeamSystem',
      imageUrl: teamsystemidLogo,
    },
    {
      identifier: 'EtnaHitech',
      entityId: 'ehtid',
      name: 'Etna Hitech S.C.p.A.',
      imageUrl: ehtidLogo,
    },
    {
      identifier: 'InfoCamere',
      entityId: 'infocamereid',
      name: 'InfoCamere S.C.p.A.',
      imageUrl: infocamereidLogo,
    },
    {
      identifier: 'Intesi Group SPID',
      entityId: 'intesiid',
      name: 'Intesi Group S.p.A',
      imageUrl: intesiidLogo,
    },
    ...(testEnabled ? [testProvider] : []),
    ...(validatorEnabled ? [validatorProvider] : []),
  ],
  richiediSpid: 'https://www.spid.gov.it/cos-e-spid/come-attivare-spid/',
});
