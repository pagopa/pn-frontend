import { Typography, List, ListItem, SvgIcon } from "@mui/material";
import {
  HeroProps,
  HorizontalNavProps,
  WalkthroughProps,
} from "@pagopa/mui-italia";
import {
  IMAGES_PATH,
  MANUALE_URL,
  PARTNER_AND_INTERMEDIARIES_PATH,
} from "@utils/constants";
import { IInfoblockData, IShowcaseData } from "model";
import Link from "next/link";
import {
  PeopleIcon,
  FireworksIcon,
  EasyIcon,
  CheckmarkIcon,
  DeliverIcon,
  SendIcon,
  SyncIcon,
  UploadIcon,
} from "../icons";

const selfCareUrl = "https://selfcare.pagopa.it/auth/login?onSuccess=dashboard";

export const paHero: HeroProps = {
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
/* ************************************** */

/** Infoblocks mocked data */
export const paInfoBlocks: Array<IInfoblockData> = [
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
/* ************************************** */

/** Showcase mocked data */
export const paShowcases: Array<IShowcaseData> = [
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
/* ************************************** */

/** Walkthrough mocked data */
export const paWalkthrough: WalkthroughProps = {
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
/* ************************************** */

/** HorizontalNav mocked data */
export const paHorizontalNav: HorizontalNavProps = {
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
/* ************************************** */
