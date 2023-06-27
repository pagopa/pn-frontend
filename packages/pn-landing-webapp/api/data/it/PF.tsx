import { Typography } from "@mui/material";
import { HeroProps, WalkthroughProps } from "@pagopa/mui-italia";
import { IMAGES_PATH, PN_PF_URL } from "@utils/constants";
import { IInfoblockData, IShowcaseData } from "model";
import {
  PiggyIcon,
  HourglassIcon,
  EcologyIcon,
  CloudIcon,
  PECIcon,
  MessageIcon,
  DelegationIcon,
  DocCheckIcon,
  NotificationIcon,
  WalletIcon,
} from "../icons";

const onReadClick = () => {
  window.open(PN_PF_URL, "_blank");
};

// eslint-disable-next-line no-extra-boolean-cast
const heroCta = !!PN_PF_URL
  ? {
      label: "Leggi le tue notifiche",
      title: "Leggi le tue notifiche",
      onClick: onReadClick,
    }
  : undefined;

export const pfHero: HeroProps = {
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
/* ************************************** */

/** Infoblocks mocked data */
export const pfInfoBlocks: Array<IInfoblockData> = [
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
export const pfShowcases: Array<IShowcaseData> = [
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
export const pfWalkthrough: WalkthroughProps = {
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
export const pfHorizontalNav = {
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
