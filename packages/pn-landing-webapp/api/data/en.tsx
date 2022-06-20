import { ShowcaseProps, WalkthroughProps } from "@pagopa/mui-italia";
import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";
import { CieIcon } from "@pagopa/mui-italia/dist/icons";

const ASSETS_PATH = process.env.NEXT_PUBLIC_ASSETS_URL;

/** Hero mocked data */
const paHero: HeroProps = {
  title: 'Send legal notification?',
  // title: 'Inviare notifiche a valore legale? Facile a dirsi.',
  subtitle: 'E da oggi anche a farsi. Piattaforma Notifiche digitalizza la gestione delle notifiche a valore legale, semplificando il processo per tutti: chi le invia, e chi le riceve.',
  ctaPrimary: {
    label: 'Scopri come aderire',
    title: 'Scopri come aderire title',
    href: 'PRIMARY_CTA_URL'
  },
  ctaSecondary: {
    label: 'Accedi',
    title: 'Accedi title',
    href: 'SECONDARY_CTA_URL'
  },
  inverse: false,
  image: `${ASSETS_PATH}/images/hero.png`,
  altText: '',
  background: 'BACKGROUND_IMAGE_URL',
};

const pfHero: HeroProps = {
  title: ''
};

const coHero: HeroProps = {
  title: ''
};
/* ************************************** */

/** Infoblocks mocked data */
// const paInfoBlocks: Array<InfoblockProps> = [
const paInfoBlocks = [
  {
    name: 'infoblock 1',
    payload: {
      overline: 'Rappresenti un ente?',
      title: 'Un modo più semplice di gestire le notifiche',
      content: `Piattaforma Notifiche digitalizza e semplifica la gestione delle notifiche a valore legale. Gli enti mittenti non devono che depositare l’atto da notificare: sarà la piattaforma a occuparsi dell’invio, per via digitale o analogica.
    
      Con Piattaforma Notifiche, diminuisce l’incertezza della reperibilità dei destinatari e si riducono i tempi e i costi di gestione.`,
      // ctaPrimary?: CTA,
      // ctaSecondary?: CTA,
      inverse: false,
      image: 'URL_INFOBLOCK_1',
      altText: '',
      imageShadow: false,
      // imageType?: "circle",
      // aspectRatio?: "4/3" | "9/16"
    }
  }, {
    name: 'infoblock 2',
    payload: {
      title: 'Carica l’atto. Poi, dimenticatene',
      content: `Piattaforma Notifiche si integra con il protocollo degli enti e offre sia API per l'inoltro automatico di notifiche che la possibilità di fare invii manuali. Una volta effettuato il caricamento degli atti e dei moduli di pagamento, la piattaforma genera lo IUN, un codice univoco identificativo della notifica.

      Poi, cerca nei suoi archivi e nei registri pubblici un recapito digitale riconducibile al destinatario e invia la notifica. Se non lo trova, procede con la ricerca di un indirizzo fisico, e quindi con l’invio tramite raccomandata cartacea.`,
      inverse: true,
      image: 'URL_INFOBLOCK_2',
      altText: '',
      imageShadow: false,
      // imageType?: "circle",
      // aspectRatio?: "4/3" | "9/16"
    }
  }, {
    name: 'infoblock 3',
    payload: {
      title: 'E il destinatario?',
      content: `Il destinatario riceve l’avviso di avvenuta ricezione a un recapito digitale tra PEC, App IO, email e SMS. Poi accede alla piattaforma tramite SPID o CIE, dove può visionare e scaricare gli atti notificati. Grazie all’integrazione con pagoPA, può anche pagare contestualmente quanto dovuto.

      Come l’ente, anche il desinatario ha accesso alla cronologia degli stati della notifica e alle relative attestazioni opponibili a terzi.`,
      ctaPrimary: {
        label: 'Aderisci a Piattaforma Notifiche',
        title: 'Aderisci title',
        href: '#',
      },
      inverse: false,
      image: 'URL_INFOBLOCK_3',
      altText: '',
      imageShadow: false,
      // imageType?: "circle",
      // aspectRatio?: "4/3" | "9/16"
    }
  }
];

// const pfInfoBlocks: Array<InfoblockProps> = [
const pfInfoBlocks = [
  {
    name: 'infoblock 1',
    payload: {
      title: '',
      inverse: false,
      image: '',
      imageShadow: false
    }
  }, {
    name: 'infoblock 2',
    payload: {
      title: '',
      inverse: true,
      image: '',
      imageShadow: false
    }
  }
];

// const coInfoBlocks: Array<InfoblockProps> = [
const coInfoBlocks = [
  {
    name: 'infoblock 1',
    payload: {
      title: '',
      inverse: false,
      image: '',
      imageShadow: false
    }
  }, {
    name: 'infoblock 2',
    payload: {
      title: '',
      inverse: true,
      image: '',
      imageShadow: false
    }
  }
];
/* ************************************** */

/** Showcase mocked data */
const paShowcase: ShowcaseProps = {
  title: 'Un solo modo per risparmiare in tanti modi',
  items: [{
    icon: <CieIcon />,
    title: 'Unico',
    subtitle: 'Le notifiche sono inviate, gestite e monitorate in un solo posto, in collaborazione con i colleghi'
  }, {
    icon: <CieIcon />,
    title: 'Semplice',
    subtitle: 'Si possono caricare notifiche sia tramite API che manualmente: caricati i documenti, la piattaforma si occupa dell’invio e tiene traccia dei cambi di stato'
  }, {
    icon: <CieIcon />,
    title: 'Immediato',
    subtitle: 'Se il destinatario ha un recapito digitale, i tempi di invio diminuiscono drasticamente'
  }, {
    icon: <CieIcon />,
    title: 'Certo',
    subtitle: 'La certezza di consegna aumenta e  il pagamento di quanto dovuto dal destinatario si facilita'
  }]
};

const pfShowcase: ShowcaseProps = {
  title: '',
  items: [{
    title: '',
    subtitle: ''
  }, {
    title: '',
    subtitle: ''
  }]
};

const coShowcase: ShowcaseProps = {
  title: '',
  items: [{
    title: '',
    subtitle: ''
  }, {
    title: '',
    subtitle: ''
  }]
};
/* ************************************** */

/** Walkthrough mocked data */
const paWalkthrough: WalkthroughProps = {
  title: 'Come funziona?',
  items: [{
    icon: <CieIcon />,
    title: 'L’ente crea la richiesta di notifica',
    subtitle: 'Con l’uso di chiavi API o manualmente, l’ente crea la richiesta di notifica e carica gli allegati.'
  }, {
    icon: <CieIcon />,
    title: 'La piattaforma la prende in carico',
    subtitle: 'Piattaforma Notifiche verifica la correttezza e completezza delle informazioni. Ad ogni cambio di stato, viene sempre generata la relativa attestazione opponibile a terzi.'
  }, {
    icon: <CieIcon />,
    title: 'La notifica viene inviata',
    subtitle: 'Poi, la piattaforma comunica al destinatario la presenza di una notifica tramite diversi possibili canali: PEC, App IO, email, SMS. In alternativa, ricerca un indirizzo fisico e invia una raccomandata cartacea.'
  }, {
    icon: <CieIcon />,
    title: 'Il destinatario la riceve',
    subtitle: 'Ricevuto l’avviso di avvenuta ricezione, il destinatario accede alla piattaforma. Lì, può scaricare gli atti notificati e pagare contestualmente quanto dovuto, grazie all’integrazione con pagoPA.'
  }]
};

const pfWalkthrough: WalkthroughProps = {
  title: '',
  items: [{
    title: '',
    subtitle: ''
  }, {
    title: '',
    subtitle: ''
  }]
};

const coWalkthrough: WalkthroughProps = {
  title: '',
  items: [{
    title: '',
    subtitle: ''
  }, {
    title: '',
    subtitle: ''
  }]
};
/* ************************************** */

/** HorizontalNav mocked data */
// const paHoriziontalNav: HorizontalNavProps = {
const paHoriziontalNav = {
  sections: [{
    icon: <CieIcon />,
    title: 'Rappresenti un’impresa?',
    subtitle: 'Gestisci le notifiche della tua impresa in un unico spazio, in collaborazione con i colleghi.',
    cta: {
      label: 'Scopri i vantaggi per le imprese',
      title: 'CTA1',
      href: '#',
    }
  }, {
    icon: <CieIcon />,
    title: 'Sei una cittadina o un cittadino?',
    subtitle: 'Attiva il servizio sull’app IO: così se accederai a XYZ entro 7 giorni dalla ricezione del messaggio in app, non riceverai il cartaceo e rispamierai tempo e denaro.',
    cta: {
      label: 'Scopri i vantaggi per i cittadini',
      title: 'CTA1',
      href: '#',
    }
  }
]};

// const pfHoriziontalNav: HorizontalNavProps = {
const pfHoriziontalNav = {
  sections: [{
    title: '',
    subtitle: '',
    cta: {
      label: '',
      title: '',
      href: '',
    }
  }, {
    title: '',
    subtitle: '',
    cta: {
      label: '',
      title: '',
      href: '',
    }
  }
]};

// const pfHoriziontalNav: HorizontalNavProps = {
const coHoriziontalNav = {
  sections: [{
    title: '',
    subtitle: '',
    cta: {
      label: '',
      title: '',
      href: '',
    }
  }, {
    title: '',
    subtitle: '',
    cta: {
      label: '',
      title: '',
      href: '',
    }
  }
]};
/* ************************************** */

/** Application Data Mock */
export const enAppData = {
  pa: {
    hero: paHero,
    infoblocks: paInfoBlocks,
    showcase: paShowcase,
    walkthrough: paWalkthrough,
    horizontalNav: paHoriziontalNav,
  },
  pf: {
    hero: pfHero,
    infoblocks: pfInfoBlocks,
    showcase: pfShowcase,
    walkthrough: pfWalkthrough,
    horizontalNav: pfHoriziontalNav,
  },
  co: {
    hero: coHero,
    infoblocks: coInfoBlocks,
    showcase: coShowcase,
    walkthrough: coWalkthrough,
    horizontalNav: coHoriziontalNav,
  }
};