import { InfoblockProps } from "@pagopa/mui-italia";
import { ShowcaseProps, WalkthroughProps } from "@pagopa/mui-italia";
import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";
import { SvgIcon } from "@pagopa/mui-italia/node_modules/@mui/material";
import { CheckmarkIcon, CloudIcon, DelegationIcon, DeliverIcon, DocCheckIcon, EasyIcon, EcologyIcon, FireworksIcon, HourglassIcon, IOIcon, MessageIcon, NotificationIcon, PecIcon, PeopleIcon, PiggyIcon, SendIcon, SyncIcon, UploadIcon, WalletIcon } from "./icons";
// import { SELFCARE_URL } from "@utils/constants";
import { PAGOPA_HELP_EMAIL } from "@utils/constants";

const IMAGES_PATH = "static/images";
const PA = "pa";
const PF = "pf";
const CO = "co";

const assistanceLink = {
  label: "Assistenza",
  ariaLabel: "assistenza",
  href: `mailto:${PAGOPA_HELP_EMAIL}`
}

/** Hero mocked data */
const paHero: HeroProps = {
  title: "Inviare notifiche? Facile a dirsi.",
  subtitle:
    `E da oggi anche a farsi. Piattaforma Notifiche digitalizza la gestione delle comunicazioni a valore legale, 
    semplificando il processo per tutti: chi le invia, e chi le riceve.`,
  inverse: false,
  image: "",
  altText: "",
  background: `${IMAGES_PATH}/${PA}/hero.jpg`,
};

const pfHero: HeroProps = {
  title: "Le notifiche? Sono a portata di mano.",
  subtitle:
    `Con Piattaforma Notifiche puoi ricevere istantaneamente le comunicazioni a valore legale da parte di un ente: 
    potrai visualizzare, gestire e pagare direttamente online o in app le raccomandate che di solito ti vengono inviate in cartaceo.`,
  inverse: false,
  image: "",
  altText: "",
  background: `${IMAGES_PATH}/${PF}/hero.jpg`,
};

const coHero: HeroProps = {
  title: "",
};
/* ************************************** */

/** Infoblocks mocked data */

const paInfoBlocks: Array<{name: string, payload: InfoblockProps}> = [
  {
    name: "infoblock 1",
    payload: {
      // overline: "Rappresenti un ente?",
      title: "Un modo più semplice di gestire le notifiche",
      content:
      `Piattaforma Notifiche digitalizza e semplifica la gestione delle comunicazioni a valore legale. Gli enti mittenti 
      non devono che depositare l’atto da notificare: sarà la piattaforma a occuparsi dell’invio, per via digitale o analogica.

      Con Piattaforma Notifiche, diminuisce l’incertezza della reperibilità dei destinatari e si riducono i tempi e i costi di gestione.`,
      inverse: false,
      image: `${IMAGES_PATH}/${PA}/infoblock-1.png`,
      altText: "",
      imageShadow: true,
    },
  },
  {
    name: "infoblock 2",
    payload: {
      title: "Carica l’atto. Poi, dimenticatene",
      content:
      `Piattaforma Notifiche si integra con il protocollo degli enti e offre sia API per l'invio automatico delle notifiche, sia la 
      possibilità di fare invii manuali. Una volta effettuato il caricamento degli atti e dei moduli di pagamento, la piattaforma 
      genera lo IUN, un codice univoco identificativo della notifica.

      Successivamente, cerca nei suoi archivi e nei registri pubblici una PEC riconducibile al destinatario e invia la notifica. Poi, 
      invia un avviso di cortesia agli altri recapiti digitali (app IO, email e SMS) del destinatario. 
      
      Se il destinatario non ha indicato alcun recapito digitale e non ha accesso alla piattaforma, questa procede con la ricerca di un 
      indirizzo fisico, e quindi con l’invio tramite raccomandata cartacea.`,
      inverse: true,
      image: `${IMAGES_PATH}/${PA}/infoblock-2.png`,
      altText: "",
      imageShadow: false,
    },
  },
  {
    name: "infoblock 3",
    payload: {
      title: "E il destinatario?",
      content:
        `Il destinatario accede alla piattaforma tramite SPID o CIE, dove può visionare e scaricare l’atto notificato. 
        Grazie all’integrazione con pagoPA, può anche pagare contestualmente quanto dovuto. Se ha attivato il servizio 
        su app IO, potrà fare tutto direttamente in app.

        Come l’ente, anche il desinatario ha accesso alla cronologia degli stati della notifica e alle attestazioni 
        opponibili a terzi che ne danno prova.`,
      inverse: false,
      image: `${IMAGES_PATH}/${PA}/infoblock-3.png`,
      altText: "",
      imageShadow: false,
    },
  },
  {
    name: "infoblock 4",
    payload: {
      title: "Presto disponibile per gli enti",
      content:
        `Attualmente, Piattaforma Notifiche è oggetto di collaudo con un numero ristretto di enti pilota.

        Quando sarà operativa, anche il tuo ente potrà fare richiesta di adesione e adottarla per digitalizzare il processo di notificazione.`,
      inverse: false,
      image: `${IMAGES_PATH}/${PA}/infoblock-4.png`,
      altText: "",
      aspectRatio: "9/16",
      imageShadow: false,
    },
  },
];

const pfInfoBlocks: Array<{name: string, payload: InfoblockProps}> = [
  {
    name: "infoblock 1",
    payload: {
      title: "Non perderti più nessuna notifica",
      content:
        `Le notifiche sono comunicazioni a valore legale emesse in via ufficiale da un'amministrazione, come multe, 
        avvisi di accertamento di tributi, esiti di pratiche amministrative avviate con le Pubbliche Amministrazioni 
        o rimborsi, che fino ad ora hai sempre ricevuto tramite raccomandata. Da oggi puoi riceverle e consultarle 
        in digitale, accedendo a Piattaforma Notifiche tramite SPID o CIE o direttamente sull’app IO. 

        Puoi anche pagare eventuali costi grazie all’integrazione con pagoPA, visualizzare lo storico delle notifiche 
        ricevute e gestirle direttamente online. Inoltre, ti basta una delega per gestire anche le raccomandate dei 
        tuoi familiari.`,
      inverse: false,
      image: `${IMAGES_PATH}/${PF}/infoblock-1.png`,
      imageShadow: false,
    },
  },
  {
    name: "infoblock 2",
    payload: {
      title: "Scegli tu come ricevere le notifiche ",
      content:
        `Per inviare le comunicazioni a valore legale, Piattaforma Notifiche dà sempre la priorità ai recapiti 
        digitali del destinatario. In ogni momento, puoi accedere alla piattaforma con SPID e CIE per indicare 
        o aggiornare le tue preferenze tra PEC, App IO, email o SMS. Se non indichi alcun recapito o non hai 
        accesso alla piattaforma, continuerai a ricevere le notifiche tramite raccomandata cartacea.`,
      inverse: true,
      image: `${IMAGES_PATH}/${PF}/infoblock-2.png`,
      imageShadow: false,
    },
  },
  {
    name: "infoblock 3",
    payload: {
      title: "Il futuro delle comunicazioni a valore legale",
      content:
        `Attualmente, Piattaforma Notifiche è oggetto di collaudo con un numero ristretto di amministrazioni.

        Progressivamente, la piattaforma verrà adottata dalle Pubbliche Amministrazioni e utilizzata per 
        inviare notifiche a tutti i cittadini.`,
      inverse: false,
      image: `${IMAGES_PATH}/${PF}/infoblock-3.png`,
      imageShadow: false,
    },
  },
];

const coInfoBlocks: Array<{name: string, payload: InfoblockProps}> = [
  {
    name: "infoblock 1",
    payload: {
      title: "",
      inverse: false,
      image: "",
      imageShadow: false,
    },
  },
  {
    name: "infoblock 2",
    payload: {
      title: "",
      inverse: true,
      image: "",
      imageShadow: false,
    },
  },
];
/* ************************************** */

/** Showcase mocked data */
const paShowcase: ShowcaseProps = {
  title: "Un solo modo per risparmiare in tanti modi",
  items: [
    {
      icon: <PeopleIcon />,
      title: "Unico",
      subtitle:
        "Le notifiche sono inviate, gestite e monitorate tramite un solo canale, accessibile da più referenti dello stesso ente",
    },
    {
      icon: <FireworksIcon />,
      title: "Semplice",
      subtitle:
        "Si possono caricare notifiche tramite API o manualmente: depositati i documenti, la piattaforma si occupa dell’invio e tiene traccia dei cambi di stato",
    },
    {
      icon: <EasyIcon />,
      title: "Immediato",
      subtitle:
        "Se il destinatario ha un recapito digitale, i tempi di invio diminuiscono notevolmente",
    },
    {
      icon: <CheckmarkIcon />,
      title: "Certo",
      subtitle:
        "Il processo di notificazione è normato  e c’è maggiore certezza di consegna al destinatario",
    },
  ],
};

const pfShowcase: ShowcaseProps = {
  title: "Cosa ti offrono le notifiche digitali",
  items: [
    {
      icon: <PiggyIcon />,
      title: "Convenienza",
      subtitle:
        "Il recapito delle notifiche in digitale comporta minori costi di notificazione e spedizione",
    },
    {
      icon: <HourglassIcon />,
      title: "Tempo",
      subtitle:
        "Niente più attese o code per il ritiro delle comunicazioni cartacee",
    },
    {
      icon: <EcologyIcon />,
      title: "Sostenibilità",
      subtitle:
        "Contribuisci a ridurre il consumo di carta e le emissioni per il trasporto",
    },
    {
      icon: <CloudIcon />,
      title: "Spazio",
      subtitle:
        "Non devi più conservare i documenti stampati",
    },
  ],
};

const coShowcase: ShowcaseProps = {
  title: "",
  items: [
    {
      icon: <PecIcon />,
      title: "PEC",
      subtitle: `
        Se hai un indirizzo PEC, le notifiche ti risulteranno legalmente consegnate, senza più 
        raccomandate cartacee. L’avviso di avvenuta ricezione che ti sarà inviato contiene il 
        link per accedere al contenuto su Piattaforma Notifiche.
        `,
    },
    {
      icon: <IOIcon />,
      title: "App IO",
      subtitle: `
      Se attivi il servizio “Avvisi di cortesia” di Piattaforma Notifiche, puoi ricevere e gestire 
      direttamente in app le comunicazioni a valore legale. Se non hai la PEC e leggi subito il messaggio, 
      non riceverai la raccomandata cartacea e la notifica ti risulterà legalmente recapitata.
      `,
    },
    {
      icon: <MessageIcon />,
      title: "Email o SMS",
      subtitle:`
      In più, puoi anche scegliere di ricevere un avviso di cortesia al tuo indirizzo email o tramite SMS. 
      Se non hai la PEC e accedi alla piattaforma dall’apposito link, non riceverai la raccomandata 
      cartacea e la notifica ti risulterà legalmente recapitata.
      `,
    },
  ],
};
/* ************************************** */

/** Walkthrough mocked data */
const paWalkthrough: WalkthroughProps = {
  title: "Come funziona?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "L’ente crea la richiesta di notifica",
      subtitle:
        "Con l’uso di chiavi API o manualmente, l’ente crea la richiesta di notifica e carica gli allegati.",
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "La piattaforma la prende in carico",
      subtitle:
        `Piattaforma Notifiche verifica la completezza e correttezza delle informazioni. Ad ogni cambio di 
        stato, viene sempre generata la relativa attestazione opponibile a terzi.`,
    },
    {
      icon: <SendIcon color="primary" />,
      title: "La notifica viene inviata",
      subtitle:
        `La piattaforma comunica al destinatario la presenza di una notifica tramite diversi possibili canali: 
        PEC, App IO, email, SMS. In alternativa, ricerca un indirizzo fisico e invia una raccomandata cartacea.`,
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Il destinatario la riceve",
      subtitle:
        `Il destinatario accede alla piattaforma. Lì, può scaricare gli i documenti notificati e pagare 
        contestualmente quanto dovuto, grazie all’integrazione con pagoPA. Se la riceve tramite IO, può fare 
        tutto direttamente in app.`,
    },
  ],
};

const pfWalkthrough: WalkthroughProps = {
  title: "Come funziona?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Ricevi la notifica",
      subtitle: `
        Per ogni notifica, la piattaforma  verifica che ci sia una PEC a te associata o da te indicata per 
        l’invio dell’avviso di avvenuta ricezione. Poi, invia un avviso di cortesia ai tuoi altri recapiti 
        digitali (app IO, email e sms). Se non hai indicato alcun recapito digitale e non hai accesso alla 
        piattaforma, riceverai una raccomandata cartacea.
        `,
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Leggi il contenuto",
      subtitle: `
      Dal messaggio ricevuto, puoi accedere alla piattafoma per leggere la notifica e scaricare i relativi 
      allegati. Se attivi il servizio su IO, puoi visualizzare il contenuto direttamente in app: questo 
      equivale a firmare la ricevuta di ritorno di una raccomandata tradizionale.
      `,
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Paga le spese",
      subtitle: `
      Se c’è un importo da pagare, grazie all’integrazione con pagoPA, puoi procedere contestualmente online 
      dalla piattaforma oppure direttamente da IO. Se preferisci recarti a uno sportello, dovrai avere con te 
      il modulo di pagamento ricevuto con la notifica.
      `,
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "Puoi delegare o essere delegato",
      subtitle: `
      Se lo desideri, puoi delegare altre persone, fisiche o giuridiche, a ricevere le tue notifiche online o 
      a ritirare i documenti allegati in versione cartacea presso qualsiasi Ufficio Postale.
      `,
    },
  ],
};

const coWalkthrough: WalkthroughProps = {
  title: "",
  items: [
    {
      title: "",
      subtitle: "",
    },
    {
      title: "",
      subtitle: "",
    },
  ],
};
/* ************************************** */

/** HorizontalNav mocked data */
// const paHorizontalNav: HorizontalNavProps = {
const paHorizontalNav = {
  sections: [
    {
      icon: <SvgIcon component="image"><img src="static/icons/HORIZONTAL-NAV-1.svg" /></SvgIcon>,
      title: "Rappresenti un’impresa?",
      subtitle:
        "Gestisci le notifiche della tua impresa in un unico spazio, in collaborazione con i colleghi.",
      cta: {
        label: "Scopri i vantaggi per le imprese",
        title: "CTA1",
        href: "#",
      },
    },
    {
      icon: <SvgIcon component="image"><img src="static/icons/HORIZONTAL-NAV-2.svg" /></SvgIcon>,
      title: "Sei una cittadina o un cittadino?",
      subtitle:
        "Attiva il servizio sull’app IO: così se accederai a XYZ entro 7 giorni dalla ricezione del messaggio in app, non riceverai il cartaceo e rispamierai tempo e denaro.",
      cta: {
        label: "Scopri i vantaggi per i cittadini",
        title: "CTA1",
        href: "#",
      },
    },
  ],
};

// const pfHorizontalNav: HorizontalNavProps = {
const pfHorizontalNav = {
  sections: [
    {
      title: "",
      subtitle: "",
      cta: {
        label: "",
        title: "",
        href: "",
      },
    },
    {
      title: "",
      subtitle: "",
      cta: {
        label: "",
        title: "",
        href: "",
      },
    },
  ],
};

// const pfHorizontalNav: HorizontalNavProps = {
const coHorizontalNav = {
  sections: [
    {
      title: "",
      subtitle: "",
      cta: {
        label: "",
        title: "",
        href: "",
      },
    },
    {
      title: "",
      subtitle: "",
      cta: {
        label: "",
        title: "",
        href: "",
      },
    },
  ],
};
/* ************************************** */

/** Application Data Mock */
export const itAppData = {
  common: {
    alert: "La piattaforma non è operativa. Attualmente sono in fase di collaudo solo alcune delle funzionalità descritte in questa pagina, disponibili esclusivamente per un numero limitato di utenti che saranno destinatari delle notifiche inviate dagli enti pilota.",
    assistance: assistanceLink,
  },
  pa: {
    hero: paHero,
    infoblocks: paInfoBlocks,
    showcase: paShowcase,
    walkthrough: paWalkthrough,
    horizontalNav: paHorizontalNav,
  },
  pf: {
    hero: pfHero,
    infoblocks: pfInfoBlocks,
    showcase: pfShowcase,
    walkthrough: pfWalkthrough,
    horizontalNav: pfHorizontalNav,
  },
  co: {
    hero: coHero,
    infoblocks: coInfoBlocks,
    showcase: coShowcase,
    walkthrough: coWalkthrough,
    horizontalNav: coHorizontalNav,
  },
};
