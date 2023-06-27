import { Link, List, ListItem, SvgIcon, Typography } from "@mui/material";

import {
  FooterLinksType,
  HeroProps,
  HorizontalNavProps,
  PreLoginFooterLinksType,
  WalkthroughProps,
} from "@pagopa/mui-italia";

import {
  IAppData,
  IInfoblockData,
  ILinkData,
  INavigationBarProps,
  IShowcaseData,
} from "model";

import {
  IMAGES_PATH,
  PAGOPA_HOME,
  PN_PF_URL,
  MANUALE_URL,
  PARTNER_AND_INTERMEDIARIES_PATH,
} from "@utils/constants";
import {
  CheckmarkIcon,
  CloudIcon,
  DelegationIcon,
  DeliverIcon,
  DocCheckIcon,
  EasyIcon,
  EcologyIcon,
  FireworksIcon,
  HourglassIcon,
  MessageIcon,
  NotificationIcon,
  PECIcon,
  PeopleIcon,
  PiggyIcon,
  SendIcon,
  SyncIcon,
  UploadIcon,
  WalletIcon,
} from "./icons";

const assistanceLink = {
  label: "Assistenza",
  ariaLabel: "assistenza"
};

const onReadClick = () => {
  window.open(PN_PF_URL, "_blank");
};

const navigation: INavigationBarProps = {
  title: "SEND Servizio Notifiche Digitali",
  chip: "Beta",
  pf: "Cittadini",
  pa: "Enti",
  faq: "FAQ",
  image: `${IMAGES_PATH}/logo.svg`,
};

const selfCareUrl = "https://selfcare.pagopa.it/auth/login?onSuccess=dashboard";

// eslint-disable-next-line no-extra-boolean-cast
const heroCta = !!PN_PF_URL
  ? {
      label: "Leggi le tue notifiche",
      title: "Leggi le tue notifiche",
      onClick: onReadClick,
    }
  : undefined;

/** Hero mocked data */
const paHero: HeroProps = {
  type: "image",
  title: "Inviare notifiche? Facile a dirsi.",
  subtitle: `E da oggi anche a farsi. SEND, Servizio Notifiche Digitali (anche nota come Piattaforma Notifiche Digitali di cui all'art. 26 del decreto-legge 76/2020 s.m.i.)  digitalizza la gestione delle comunicazioni a valore legale, semplificando il processo per tutti: chi le invia, e chi le riceve.`,
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
  ctaPrimary: {
    label: "Scopri come aderire",
    title: "Scopri come aderire",
    /* Carlotta Dimatteo - workaround per gestire un anchor interno alla pagina richiesto dal team di comunicazione il 16/02/2023 */
    onClick: function onClick() {
      let loc = document.location.toString().split("#")[0];
      document.location = loc + "#start-integration";
      return false;
    },
  },
  ctaSecondary: {
    label: "Accedi",
    title: "Accedi",
    /* Carlotta Dimatteo - aggiunta della CTA richiesta dal team di comunicazione il 17/02/2023 */
    onClick: function onClick() {
      window.open(selfCareUrl, "_blank");
      return false;
    },
  },
};

const pfHero: HeroProps = {
  type: "image",
  title: "Le notifiche? Sono a portata di mano.",
  subtitle: `Con SEND - Servizio Notifiche Digitali (anche nota come Piattaforma Notifiche Digitali di cui all'art. 26 del decreto-legge 76/2020 s.m.i.) puoi ricevere istantaneamente le comunicazioni a valore legale da parte di un ente. 
    Potrai visualizzarle, gestirle e pagarle direttamente online sulla piattaforma dedicata o dall'app IO.`,
  ctaPrimary: heroCta,
  inverse: false,
  image: `${IMAGES_PATH}/pf-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
};

const coHero: HeroProps = {
  type: "text",
  title: "",
};
/* ************************************** */

/** Infoblocks mocked data */

const paInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      // overline: "Rappresenti un ente?",
      title: "Un modo più semplice di gestire le notifiche",
      content: (
        <>
          <Typography variant="body2">
            SEND digitalizza e semplifica la gestione delle comunicazioni a
            valore legale. Gli enti mittenti devono solo depositare l'atto da
            notificare: sarà la piattaforma a occuparsi dell'invio, per via
            digitale o analogica.
          </Typography>
          <Typography variant="body2">
            Con SEND diminuisce l'incertezza della reperibilità dei destinatari
            e si riducono i tempi e i costi di gestione.
          </Typography>
        </>
      ),
      inverse: false,
      image: `${IMAGES_PATH}/pa-infoblock-1.png`,
      altText: "",
      imageShadow: true,
    },
  },
  {
    name: "infoblock 2",
    data: {
      title: "Carica l'atto. Poi, dimenticatene",
      content: (
        <>
          <Typography variant="body2">
            SEND si integra con il protocollo degli enti e offre sia API per
            l'invio automatico delle notifiche, sia la possibilità di fare invii
            manuali. Una volta effettuato il caricamento degli atti e dei moduli
            di pagamento, la piattaforma genera lo IUN, un codice univoco
            identificativo della notifica.
          </Typography>
          <Typography variant="body2">
            Successivamente, cerca nei suoi archivi e nei registri pubblici una
            PEC riconducibile al destinatario e invia la notifica. Poi, invia un
            avviso di cortesia agli altri recapiti digitali (app IO, email e
            SMS) del destinatario.
          </Typography>
          <Typography variant="body2">
            Se il destinatario non ha indicato alcun recapito digitale e non ha
            accesso alla piattaforma, questa procede con la ricerca di un
            indirizzo fisico, e quindi con l'invio tramite raccomandata
            cartacea.
          </Typography>
        </>
      ),
      inverse: true,
      image: `${IMAGES_PATH}/pa-infoblock-2.png`,
      altText: "",
      imageShadow: false,
    },
  },
  {
    name: "infoblock 3",
    data: {
      title: "E il destinatario?",
      content: (
        <>
          <Typography variant="body2">
            Il destinatario accede alla piattaforma tramite SPID o CIE, dove può
            visionare e scaricare l'atto notificato. Grazie all'integrazione con
            pagoPA, può anche pagare contestualmente quanto dovuto. Se ha
            attivato il servizio su app IO, potrà fare tutto direttamente in
            app.
          </Typography>
          <Typography variant="body2">
            Come l'ente, anche il destinatario ha accesso alla cronologia degli
            stati della notifica e alle attestazioni opponibili a terzi che ne
            danno prova.
          </Typography>
        </>
      ),
      inverse: false,
      image: `${IMAGES_PATH}/pa-infoblock-3.png`,
      altText: "",
      imageShadow: false,
    },
  },
  {
    name: "infoblock 4",
    data: {
      title: "Scopri come aderire",
      content: (
        <>
          <Typography variant="body2">
            La procedura per avviare le attività tecniche e amministrative
            necessarie per l'adesione e l'integrazione degli enti a SEND,
            Servizio Notifiche Digitali, prevede le seguenti fasi:
          </Typography>

          <Typography variant="h6">01. Scegli come integrarti</Typography>

          <Typography variant="body2">
            Ogni ente può decidere se integrarsi a SEND direttamente oppure
            tramite un fornitore. Nel secondo caso, è disponibile{" "}
            <Link href={PARTNER_AND_INTERMEDIARIES_PATH}>
              <a target="_blank" rel="noopener noreferrer">
                la lista dei Partner e Intermediari tecnologici
              </a>
            </Link>{" "}
            che stanno implementando le attività di integrazione alla
            piattaforma e di cui è possibile avvalersi per un supporto nella
            gestione degli aspetti tecnici.
          </Typography>
          <Typography variant="caption">
            I soggetti che intendono integrarsi a SEND in qualità di Partner o
            Intermediari Tecnologici possono manifestare il proprio interesse ad
            avviare la procedura ed essere inseriti nella lista inviando una
            mail all'indirizzo account@pagopa.it.
          </Typography>
          <Typography variant="h6">
            02. Sottoscrivi l'accordo di adesione
          </Typography>
          <Typography variant="body2">
            Per ricevere l'accordo di adesione, l'ente dovrà accedere all'
            <Link
              href={
                "https://selfcare.pagopa.it/auth/login?onSuccess=%2Fonboarding%2Fprod-pn"
              }
            >
              <a target="_blank" rel="noopener noreferrer">
                Area Riservata
              </a>
            </Link>{" "}
            e seguire i passaggi descritti in{" "}
            <Link href="https://docs.pagopa.it/area-riservata-enti-piattaforma-notifiche/">
              <a target="_blank" rel="noopener noreferrer">
                questa guida.
              </a>
            </Link>
            <br></br>
            Una volta sottoscritto l'accordo in digitale, l'ente dovrà caricarlo
            e inviarlo a PagoPA S.p.A. sempre dall'Area Riservata. Inoltre, a
            integrazione dell'accordo, dovranno essere inviati i seguenti moduli
            debitamente compilati ove richiesto:
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href={
                    "https://docs.pagopa.it/allegato-1bis-al-contratto-di-adesione/"
                  }
                >
                  <a target="_blank" rel="noopener noreferrer">
                    Allegato 1-Bis
                  </a>
                </Link>{" "}
                al Contratto di Adesione
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href={"/static/documents/Modulo preventivo di fornitura.xlsx"}
                >
                  Modulo di Profilazione
                </Link>{" "}
                necessario per l'avvio in esercizio
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href={
                    "/static/documents/Modulo Ordinativo Commessa per Anticipazione.xlsx"
                  }
                >
                  Modulo Commessa
                </Link>{" "}
                necessario per la fatturazione
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={"https://docs.pagopa.it/sla-di-servizio/"}>
                  <a target="_blank" rel="noopener noreferrer">
                    SLA di servizio
                  </a>
                </Link>
              </Typography>
            </ListItem>
          </List>
          <Typography variant="h6">
            03. Avvia l'integrazione tecnologica
          </Typography>
          <Typography variant="body2">
            Di seguito sono consultabili i materiali necessari per integrare i
            sistemi dell'ente a SEND:
          </Typography>

          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={MANUALE_URL}>
                  <a target="_blank" rel="noopener noreferrer">
                    manuale operativo
                  </a>
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-bundle.yaml">
                  <a target="_blank" rel="noopener noreferrer">
                    API b2b per le pubbliche amministrazioni
                  </a>
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-bundle.yaml">
                  <a target="_blank" rel="noopener noreferrer">
                    API b2b per l'avanzamento delle notifiche
                  </a>
                </Link>
              </Typography>
            </ListItem>
          </List>
          <Typography variant="body2">
            Per ulteriori informazioni e chiarimenti, è possibile consultare{" "}
            <Link href={"https://docs.pagopa.it/faq-enti/"}>
              <a target="_blank" rel="noopener noreferrer">
                qui
              </a>
            </Link>{" "}
            le principali FAQ.{" "}
          </Typography>
        </>
      ),
      inverse: false,
      image: `${IMAGES_PATH}/pa-infoblock-4.png`,
      altText: "",
      aspectRatio: "9/16",
      imageShadow: false,
    },
  },
];

const pfInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      title: "Non perderti più nessuna notifica",
      content: (
        <>
          <Typography variant="body2">
            Le notifiche sono comunicazioni a valore legale emesse in via
            ufficiale da un'amministrazione pubblica, come esiti di pratiche
            amministrative o rimborsi, multe e avvisi di accertamento di
            tributi. Da oggi puoi riceverle e consultarle in digitale, accedendo
            online a SEND - Servizio Notifiche Digitali tramite SPID o CIE o
            direttamente da app IO.
          </Typography>
          <Typography variant="body2">
            Puoi anche pagare eventuali costi grazie all'integrazione con
            pagoPA, visualizzare lo storico delle notifiche ricevute e gestirle
            direttamente online. Inoltre, ti basta accettare una delega per
            accedere anche alle notifiche dei tuoi familiari.
          </Typography>
        </>
      ),
      inverse: false,
      image: `${IMAGES_PATH}/pf-infoblock-1.png`,
      imageShadow: false,
    },
  },
  {
    name: "infoblock 2",
    data: {
      title: "Scegli tu come ricevere le notifiche",
      content: (
        <>
          <Typography variant="body2">
            Per inviare le comunicazioni a valore legale, SEND dà sempre la
            priorità ai recapiti digitali del destinatario. In ogni momento,
            puoi accedere online al Servizio Notifiche Digitali con SPID e CIE
            per indicare o aggiornare le tue preferenze tra PEC, App IO, email
            e/o numero di cellulare . Se non indichi alcun recapito o non accedi
            alla notifica attraverso SEND da canali diversi dalla PEC entro i
            tempi di seguito indicati, continuerai a ricevere le notifiche
            tramite raccomandata cartacea.
          </Typography>
        </>
      ),
      inverse: true,
      image: `${IMAGES_PATH}/pf-infoblock-2.png`,
      imageShadow: false,
    },
  },
  {
    name: "infoblock 3",
    data: {
      title: "Il futuro delle comunicazioni a valore legale",
      content: (
        <>
          <Typography variant="body2">
            <strong>SEND</strong> è a disposizione di tutte le Pubbliche
            Amministrazioni che vorranno utilizzarlo per inviare notifiche ai
            destinatari delle loro comunicazioni a valore legale.
          </Typography>
          <Typography variant="body2">
            Il servizio sarà adottato dagli enti progressivamente e, per
            favorirne la graduale diffusione tra i cittadini, in una prima fase
            assicurerà l'invio anche della copia analogica conforme degli atti
            notificati tramite raccomandata cartacea ai destinatari non dotati
            di domicilio digitale.
          </Typography>
        </>
      ),
      inverse: false,
      image: `${IMAGES_PATH}/pf-infoblock-3.png`,
      aspectRatio: "9/16",
      imageShadow: false,
    },
  },
];

/* ************************************** */

/** Showcase mocked data */
const paShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
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
            "Si possono caricare notifiche tramite API o manualmente: depositati i documenti, la piattaforma si occupa dell'invio e tiene traccia dei cambi di stato",
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
            "Il processo di notificazione è normato  e c'è maggiore certezza di consegna al destinatario",
        },
      ],
    },
  },
];

const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
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
            "Non devi più conservare i documenti stampati, grazie alla possibilità di scaricare e archiviare gli atti in digitale",
        },
      ],
    },
  },
  {
    name: "showcase 2",
    data: {
      title: "",
      items: [
        {
          icon: <PECIcon />,
          title: "PEC",
          subtitle: (
            <Typography variant="body2">
              Se hai un indirizzo PEC, le notifiche ti risulteranno legalmente
              consegnate, senza più raccomandate cartacee. L'avviso di avvenuta
              ricezione che ti sarà inviato contiene il link per accedere al
              contenuto su SEND.
            </Typography>
          ),
        },
        {
          /**
           * Waiting for IOIcon
           */
          // icon: <IOIcon />,
          icon: <img src={`${IMAGES_PATH}/IOIcon.svg`} />,
          title: "App IO",
          subtitle: (
            <Typography variant="body2">
              Se attivi il servizio “Avvisi di cortesia” di SEND, puoi ricevere
              e gestire direttamente in app le comunicazioni a valore legale. Se
              non hai la PEC ma accedi alla notifica attraverso SEND dall'app e
              leggi la notifica entro 5 giorni (120 ore) dalla sua ricezione,
              questa ti risulterà legalmente recapitata e non riceverai alcuna
              raccomandata cartacea.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "Email e SMS",
          subtitle: (
            <Typography variant="body2">
              In più, puoi anche scegliere di ricevere un avviso di cortesia al
              tuo indirizzo e-mail o tramite SMS. Se non hai la PEC ma accedi
              alla notifica attraverso SEND dall'apposito link entro 5 giorni
              (120 ore) dalla ricezione della notifica, questa ti risulterà
              legalmente recapitata e non riceverai alcuna raccomandata
              cartacea.
            </Typography>
          ),
        },
      ],
    },
  },
];
/* ************************************** */

/** Walkthrough mocked data */
const paWalkthrough: WalkthroughProps = {
  title: "Come funziona?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "L'ente crea la richiesta di notifica",
      subtitle:
        "Con l'uso di API Key o manualmente, l'ente crea la richiesta di notifica e carica gli allegati.",
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "La piattaforma la prende in carico",
      subtitle: `SEND verifica la completezza e correttezza delle informazioni. Ad ogni cambio di 
        stato, viene sempre generata la relativa attestazione opponibile a terzi.`,
    },
    {
      icon: <SendIcon color="primary" />,
      title: "La notifica viene inviata",
      subtitle: `SEND comunica al destinatario la presenza di una notifica tramite diversi possibili canali: 
        PEC, App IO, email, SMS. In alternativa, ricerca un indirizzo fisico e invia una raccomandata cartacea.`,
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Il destinatario la riceve",
      subtitle: `Il destinatario accede alla piattaforma. Lì, può scaricare i documenti notificati e pagare 
        contestualmente quanto dovuto, grazie all'integrazione con pagoPA. Se la riceve tramite IO, può fare 
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
      Per ogni notifica, SEND verifica che ci sia una PEC a te associata o da te indicata per l'invio dell'avviso 
      di avvenuta ricezione. Invia anche un avviso di cortesia agli altri tuoi recapiti digitali 
      (app IO, e-mail e numero di cellulare), se li hai inseriti. Se non hai indicato alcun recapito digitale 
      e non accedi online  alla notifica attraverso SEND, riceverai una raccomandata cartacea.
      `,
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Leggi il contenuto",
      subtitle: `
      Dal messaggio ricevuto, puoi accedere online alla piattaforma per leggere la notifica e scaricare i relativi 
      documenti allegati. Se attivi il servizio su IO, puoi visualizzare il contenuto direttamente in app: questo 
      equivale alla firma della ricevuta di ritorno di una raccomandata tradizionale e al perfezionamento immediato della notifica.
      `,
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Paga le spese",
      subtitle: `
      Se c'è un importo da pagare, grazie all'integrazione con pagoPA, puoi procedere contestualmente online da SEND 
      oppure direttamente da IO. Se preferisci recarti presso uno sportello, dovrai avere con te il modulo di pagamento 
      allegato alla notifica.
      `,
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "Puoi delegare o essere delegato",
      subtitle: `
      Se lo desideri, puoi delegare altre persone, fisiche o giuridiche, a ricevere le tue notifiche online. 
      Per farlo, accedi a SEND con SPID o CIE e inserisci nella sezione Deleghe i dati della persona che vuoi delegare.
      `,
      isSequential: false,
    },
  ],
};

/* ************************************** */

/** HorizontalNav mocked data */
const paHorizontalNav: HorizontalNavProps = {
  // const paHorizontalNav = {
  sections: [
    {
      icon: (
        <SvgIcon component="image">
          <img src="static/icons/HORIZONTAL-NAV-1.svg" />
        </SvgIcon>
      ),
      title: "Rappresenti un'impresa?",
      subtitle:
        "Gestisci le notifiche della tua impresa in un unico spazio, in collaborazione con i colleghi.",
      cta: {
        label: "Scopri i vantaggi per le imprese",
        title: "CTA1",
        href: "#",
      },
    },
    {
      icon: (
        <SvgIcon component="image">
          <img src="static/icons/HORIZONTAL-NAV-2.svg" />
        </SvgIcon>
      ),
      title: "Sei una cittadina o un cittadino?",
      subtitle:
        "Attiva il servizio sull'app IO: così se accederai a XYZ entro 7 giorni dalla ricezione del messaggio in app, non riceverai il cartaceo e rispamierai tempo e denaro.",
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
/* ************************************** */

/**
 * Footer data
 */
const pagoPALink: ILinkData = {
  label: "PagoPA S.p.A.",
  href: PAGOPA_HOME ?? "",
  ariaLabel: "Link: vai al sito di PagoPA S.p.A.",
};

const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — società per azioni con socio unico -
    capitale sociale di euro 1,000,000 interamente versato - sede legale in
    Roma, Piazza Colonna 370,
    <br />
    CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA
    15376371009
  </>
);

const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "Chi siamo",
        href: `${pagoPALink.href}/societa/chi-siamo`,
        ariaLabel: "Vai al link: Chi siamo",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}/opportunita/pnrr/progetti`,
        ariaLabel: "Vai al link: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}/media`,
        ariaLabel: "Vai al link: Media",
        linkType: "external",
      },
      {
        label: "Lavora con noi",
        href: `${pagoPALink.href}/lavora-con-noi`,
        ariaLabel: "Vai al link: Lavora con noi",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Risorse",
    links: [
      {
        label: "Informativa Privacy",
        href: `/informativa-privacy/`,
        ariaLabel: "Vai al link: Informativa Privacy",
        linkType: "internal",
      },
      {
        label: "Certificazioni",
        href: "https://www.pagopa.it/it/certificazioni/",
        ariaLabel: "Vai al link: Certificazioni",
        linkType: "internal",
      },
      {
        label: "Sicurezza delle informazioni",
        href: "https://www.pagopa.it/it/politiche-per-la-sicurezza-delle-informazioni/",
        ariaLabel: "Vai al link: Sicurezza delle informazioni",
        linkType: "internal",
      },
      {
        label: "Diritto alla protezione dei dati personali",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel: "Vai al link: Diritto alla protezione dei dati personali",
        linkType: "internal",
      },
      // {
      //   label: "Preferenze Cookie",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Vai al link: Preferenze Cookie",
      //   linkType: "internal",
      // },
      {
        label: "Società trasparente",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Vai al link: Società trasparente",
        linkType: "internal",
      },
      {
        label: "Responsible Disclosure Policy",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Vai al link: Responsible Disclosure Policy",
        linkType: "internal",
      },
      {
        label: "Modello 231",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Vai al link: Modello 231",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Seguici su",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel: "Link: vai al sito LinkedIn di PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel: "Link: vai al sito Twitter di PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel: "Link: vai al sito Instagram di PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel: "Link: vai al sito Medium di PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Accessibilità",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Vai al link: Accessibilità",
        linkType: "internal",
      },
    ],
  },
};

const postLoginLinks: Array<FooterLinksType> = [
  {
    label: "Privacy policy",
    href: "privacy-policy",
    ariaLabel: "Vai al link: Privacy policy",
    linkType: "internal",
  },
  {
    label: "Accessibilità",
    href: "accessibilita",
    ariaLabel: "Vai al link: Accessibilità",
    linkType: "internal",
  },
];

const productJson = "/static/product.json";

/** Application Data Mock */
export const itAppData: IAppData = {
  common: {
    navigation,
    assistance: assistanceLink,
    pagoPALink,
    companyLegalInfo,
    preLoginLinks,
    postLoginLinks,
    productJson,
  },
  pa: {
    hero: paHero,
    infoblocks: paInfoBlocks,
    showcases: paShowcases,
    walkthrough: paWalkthrough,
    horizontalNav: paHorizontalNav,
  },
  pf: {
    hero: pfHero,
    infoblocks: pfInfoBlocks,
    showcases: pfShowcases,
    walkthrough: pfWalkthrough,
    horizontalNav: pfHorizontalNav,
  },
};
