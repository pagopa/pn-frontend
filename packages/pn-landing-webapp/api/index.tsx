import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";
import { ShowcaseProps } from "@pagopa/mui-italia/dist/components/Showcase";
import { WalkthroughProps } from '@pagopa/mui-italia/dist/components/Walkthrough';
import {CieIcon} from "@pagopa/mui-italia/dist/icons";
import { infoBlocks } from "./mocks";

const ASSETS_PATH = process.env.NEXT_PUBLIC_ASSETS_URL;

export enum UserType {
  PA = "PA",
  PF = "PF",
  COMPANY = "COMPANY"
}

type PageName = "HOME";


export const getHeroData = (userType: UserType = UserType.PA): HeroProps => ({
  title: 'Inviare notifiche a valore legale? Facile a dirsi.',
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
  // inverse?: boolean,
  image: `${ASSETS_PATH}/images/hero.png`,
  altText: "",
  background: "BACKGROUND_IMAGE_URL",
});

// export const getAllInfoblocksData = (): Array<InfoblockProps> => ({
export const getAllInfoblocksData = (userType: UserType = UserType.PA) => infoBlocks.map((item) => item.payload);

// export const getInfoblockData = (): InfoblockProps => ({
export const getInfoblockData = (userType: UserType = UserType.PA, name: string = "") => {
  const infoblock = infoBlocks.filter((item) => (item.name === name))[0];
  return infoblock.payload;
};

export const getShowcaseData = (userType: UserType = UserType.PA): ShowcaseProps => ({
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
});

// export const getHorizontalNavData = (): HorizontalNavProps => ({

// });

export const getWalkthroughData = (userType: UserType = UserType.PA,): WalkthroughProps => ({
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
});

// export const getFooterData = (): FooterProps => ({

// });
