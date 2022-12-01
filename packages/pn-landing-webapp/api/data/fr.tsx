import { WalkthroughProps } from "@pagopa/mui-italia";
import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";
import { HorizontalNavProps } from "@pagopa/mui-italia";
import { SvgIcon } from "@mui/material";
import { Typography } from "@mui/material";
import Link from "next/link";

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
  IOIcon,
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
import { IMAGES_PATH, PAGOPA_HELP_EMAIL, PN_URL } from "@utils/constants";
import { IAppData, IInfoblockData, IShowcaseData } from "model";


const assistanceLink = {
  label: "Assistance",
  ariaLabel: "Assistance",
  href: `mailto:${PAGOPA_HELP_EMAIL}`,
};

const onReadClick = () => {
  window.open(PN_URL, "_blank");
};

// eslint-disable-next-line no-extra-boolean-cast
const heroCta = !!PN_URL
  ? {
      label: "Lis tes notifications",
      title: "Lis tes notifications",
      onClick: onReadClick,
    }
  : undefined;

/** Hero mocked data */
const paHero: HeroProps = {
  type: "image",
  title: "Envoyer des notifications ? Facile à dire.",
  subtitle: `Et à faire également à partir d’aujourd’hui. Piattaforma Notifiche numérise la gestion des communications à valeur juridique, en simplifiant le processus pour tous : qui les envoie et qui les reçoit.`,
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
};// cta: 'Lis tes notifications' ?????

const pfHero: HeroProps = {
  type: "image",
  title: "Les notifications ? Elles sont à portée de main.",
  subtitle: `Avec Piattaforma Notifiche, tu peux recevoir instantanément les communications à valeur juridique d’un organisme : 
    tu peux visualiser, gérer et payer directement en ligne ou dans l’application les courriers recommandés qui te sont généralement envoyés sur papier.`,
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
      title: "Une façon plus simple de gérer les notifications",
      content: (
        <>
          <Typography variant="body2">
          Piattaforma Notifiche numérise et simplifie la gestion des communications à valeur juridique. 
          Les organismes émetteurs doivent seulement déposer l’acte à notifier : ce sera la plateforme 
          qui s’occupera de l’envoi, par voie numérique ou analogique.
          </Typography>
          <Typography variant="body2">
          Avec Piattaforma Notifiche, l’incertitude de la disponibilité des destinataires diminue et les 
          temps et les coûts de gestion sont réduits.
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
      title: "Télécharge l’acte. Et puis, oublie ça",
      content: (
        <>
          <Typography variant="body2">
          Piattaforma Notifiche s’intègre au protocole des organismes et offre 
          à la fois des API pour l’envoi automatique des notifications et la 
          possibilité de faire des envois manuels. Une fois le chargement des 
          actes et des formulaires de paiement effectué, la plateforme génère 
          l’IUN, un code unique d’identification de la notification.
          </Typography>
          <Typography variant="body2">
          Ensuite, elle recherche dans ses archives et dans les registres publics 
          une adresse PEC attribuée au destinataire et envoie la notification. 
          Ensuite, elle envoie un avis de courtoisie aux autres coordonnées 
          numériques (application IO, e-mail et SMS) du destinataire.
          </Typography>
          <Typography variant="body2">
          Si le destinataire n’a indiqué aucune coordonnée numérique et n’a pas 
          accès à la plateforme, celle-ci procède à la recherche d’une adresse 
          physique, puis à l’envoi par courrier recommandé papier.
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
      title: "Et le destinataire ?",
      content: (
        <>
          <Typography variant="body2">
            Le destinataire accède à la plateforme via SPID ou CIE, où il peut 
            visualiser et télécharger l’acte notifié. Grâce à l’intégration avec 
            pagoPA, il peut également payer ce qui est dû en même temps. S’il a 
            activé le service sur l’application IO, il peut tout faire directement 
            dans l’application.
          </Typography>
          <Typography variant="body2">
            Comme l’organisme, le destinataire a également accès à l’historique 
            des états de la notification et aux attestations opposables aux tiers 
            qui en sont la preuve.
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
      title: "Bientôt disponible pour les organismes",
      content: (
        <>
          <Typography variant="body2">
            Actuellement, Piattaforma Notifiche est testée avec un nombre limité 
            d’organismes pilotes.
          </Typography>
          <Typography variant="body2">
            Lorsqu’elle sera opérationnelle, ton organisme pourra également faire 
            une demande d’adhésion et l’adopter pour numériser le processus de notification.
          </Typography>
          <Typography variant="body2">
             Pendant ce temps, les organismes peuvent consulter le{" "}
            <Link href="https://www.pagopa.it/static/e190eb758489b75d4d81112a1357b5b2/Manuale-Operativo-Piattaforma-Notifiche.pdf">
              manuel d’utilisation
            </Link>
            {" "}(mis à jour le 28/06/2022),{" "}
            <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
              les API b2b pour les administrations publiques
            </Link>
            {" "}et{" "}
            <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
              les API b2b pour l’avancement des notifications.
            </Link>
            .
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
      title: "Ne rate plus aucune notification",
      content: (
        <>
          <Typography variant="body2">
            Les notifications sont des communications à valeur juridique émises officiellement 
            par une administration, telles que des amendes, des avis d’imposition, des résultats 
            de procédures administratives engagées avec les Administrations publiques ou des 
            remboursements, que tu as jusqu’à présent toujours reçus par courrier recommandé. 
            À partir d’aujourd’hui, tu peux les recevoir et les consulter en numérique, en 
            accédant à Piattaforma Notifiche via SPID ou CIE ou directement sur l’application IO.
          </Typography>
          <Typography variant="body2">
            Tu peux également payer les éventuels coûts grâce à l’intégration avec pagoPA, 
            consulter l’historique des notifications reçues et les gérer directement en ligne. 
            De plus, il te suffit d’une délégation pour gérer les courriers recommandés de tes 
            proches.
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
      title: "Choisis comment recevoir les notifications",
      content: (
        <>
          <Typography variant="body2">
            Pour envoyer les communications à valeur juridique, Piattaforma Notifiche donne 
            toujours la priorité aux coordonnées numériques du destinataire. Tu peux à tout 
            moment te connecter à la plateforme avec SPID et CIE pour indiquer ou mettre à 
            jour tes préférences entre l’adresse PEC, l’application IO, l’e-mail ou le SMS. 
            Si tu n’indiques aucune coordonnée ou si tu n’as pas accès à la plateforme, tu 
            continueras à recevoir les notifications par courrier recommandé papier.
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
      title: "L’avenir des communications à valeur juridique",
      content: (
        <>
          <Typography variant="body2">
            Actuellement, Piattaforma Notifiche est testée avec un nombre limité d’administrations.
          </Typography>
          <Typography variant="body2">
            Progressivement, la plateforme sera adoptée par les Administrations publiques et utilisée 
            pour envoyer des notifications à tous les citoyens.
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

const coInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      title: "",
      inverse: false,
      image: "",
      imageShadow: false,
    },
  },
  {
    name: "infoblock 2",
    data: {
      title: "",
      inverse: true,
      image: "",
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
      title: "Un seul moyen d’économiser de nombreuses façons",
      items: [
        {
          icon: <PeopleIcon />,
          title: "Unique",
          subtitle:
            "Les notifications sont envoyées, gérées et surveillées par un seul canal, accessible par plusieurs référents d’un même organisme",
        },
        {
          icon: <FireworksIcon />,
          title: "Simple",
          subtitle:
            "Tu peux télécharger des notifications via l’API ou manuellement : les documents sont déposés, et la plateforme s’occupe de l’envoi et suit les changements d’état",
        },
        {
          icon: <EasyIcon />,
          title: "Immédiat",
          subtitle:
            "Si le destinataire a une coordonnée numérique, les temps d’envoi diminuent considérablement",
        },
        {
          icon: <CheckmarkIcon />,
          title: "Certain",
          subtitle:
            "Le processus de notification est normalisé et il y a une plus grande certitude de livraison au destinataire",
        },
      ],
    },
  },
];

const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Ce que t’offrent les notifications numériques",
      items: [
        {
          icon: <PiggyIcon />,
          title: "Commodité",
          subtitle:
            "L’envoi de notifications numériques entraîne une réduction des coûts de notification et d’expédition",
        },
        {
          icon: <HourglassIcon />,
          title: "Temps",
          subtitle:
            "Plus d’attente ou de files d’attente pour le retrait des communications papier",
        },
        {
          icon: <EcologyIcon />,
          title: "Développement durable",
          subtitle:
            "Contribue à réduire la consommation de papier et les émissions liées au transport",
        },
        {
          icon: <CloudIcon />,
          title: "Espace",
          subtitle:
            "Tu n’as plus besoin de conserver les documents imprimés, grâce à la possibilité de télécharger et d’archiver les documents numériques",
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
              Si tu as une adresse PEC, les notifications te seront légalement remises, sans plus de 
              courriers recommandés papier. L’avis de réception qui te sera envoyé contient le lien 
              pour accéder au contenu sur Piattaforma Notifiche.
            </Typography>
          ),
        },
        {
          /**
           * Waiting for IOIcon
           */
          // icon: <IOIcon />,
          icon: <img src={`${IMAGES_PATH}/IOIcon.svg`} />,
          title: "Application IO",
          subtitle: (
            <Typography variant="body2">
              Si tu actives le service « Notifications numériques » de Piattaforma Notifiche, tu peux 
              recevoir et gérer{" "}<strong>directement dans l’application</strong> les communications 
              à valeur juridique. Si tu n’as pas de PEC et que tu lis immédiatement le message, tu ne 
              recevras pas le courrier recommandé papier et la notification te sera légalement remise.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "E-mail ou SMS",
          subtitle: (
            <Typography variant="body2">
              En outre, tu peux également choisir de recevoir une notification de courtoisie à ton 
              adresse électronique ou par SMS. Si tu n’as pas de PEC et que tu accèdes à la plateforme 
              à partir du lien approprié, tu ne recevras pas le courrier recommandé papier et la 
              notification te sera légalement remise.
            </Typography>
          ),
        },
      ],
    },
  },
];

const coShowcases: Array<IShowcaseData> = [
  {
    name: "",
    data: {
      title: "",
      items: [
        {
          icon: <PECIcon />,
          title: "",
          subtitle: `
            `,
        },
        {
          icon: <IOIcon />,
          title: "",
          subtitle: `
          `,
        },
        {
          icon: <MessageIcon />,
          title: "",
          subtitle: `
          `,
        },
      ],
    },
  },
];
/* ************************************** */

/** Walkthrough mocked data */
const paWalkthrough: WalkthroughProps = {
  title: "Comment ça fonctionne ?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "L’organisme crée la demande de notification",
      subtitle:
        "À l’aide de clés API ou manuellement, l’organisme crée la demande de notification et télécharge les pièces jointes.",
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "La plateforme la prend en charge",
      subtitle: `Piattaforma Notifiche vérifie l’exhaustivité et l’exactitude des informations. 
        À chaque changement d’état, l’attestation correspondante opposable à des tiers est 
        toujours générée.`,
    },
    {
      icon: <SendIcon color="primary" />,
      title: "La notification est envoyée",
      subtitle: `La plateforme informe le destinataire de la présence d’une notification via 
        plusieurs canaux possibles : adresse PEC, application IO, e-mail, SMS. Elle peut 
        également rechercher une adresse physique et envoyer un courrier recommandé papier.`,
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Le destinataire la reçoit",
      subtitle: `Le destinataire accède à la plateforme. Là, il peut télécharger les documents 
        notifiés et payer en même temps ce qui est dû, grâce à l’intégration avec pagoPA. 
        S’il la reçoit via IO, il peut tout faire directement dans l’application.`,
    },
  ],
};

const pfWalkthrough: WalkthroughProps = {
  title: "Comment ça fonctionne ?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Tu reçois la notification",
      subtitle: `
        Pour chaque notification, la plateforme vérifie qu’il y a une PEC qui t’est associée 
        ou que tu as indiquée pour l’envoi de l’avis de réception. Ensuite, elle envoie un avis 
        de courtoisie à tes autres coordonnées numériques (application IO, e-mail et SMS). Si 
        tu n’as pas indiqué de coordonnée numérique et que tu n’as pas accès à la plateforme, 
        tu recevras un courrier recommandé papier.
      `,
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Lis le contenu",
      subtitle: `
        À partir du message reçu, tu peux accéder à la plateforme pour lire la notification et 
        télécharger les pièces jointes correspondantes. Si tu actives le service sur IO, tu 
        peux visualiser le contenu directement dans l’application : cela équivaut à signer le 
        reçu de retour d’un courrier recommandé traditionnel.
      `,
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Paye les frais",
      subtitle: `
        S’il y a un montant à payer, grâce à l’intégration avec pagoPA, tu peux procéder 
        simultanément en ligne depuis la plateforme ou directement depuis l’IO. Si tu préfères 
        te rendre à un guichet, tu devras avoir avec toi le formulaire de paiement reçu avec 
        la notification.
      `,
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "Tu peux déléguer ou être délégué",
      subtitle: `
        Si tu le souhaites, tu peux déléguer d’autres personnes, physiques ou morales, à recevoir 
        tes notifications en ligne ou à retirer les documents joints en version papier à n’importe 
        quel bureau de poste.
      `,
      isSequential: false,
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
const paHorizontalNav: HorizontalNavProps = {
  // const paHorizontalNav = {
  sections: [
    {
      icon: (
        <SvgIcon component="image">
          <img src="static/icons/HORIZONTAL-NAV-1.svg" />
        </SvgIcon>
      ),
      title: "Tu représentes une entreprise ?",
      subtitle:
        "Gère les notifications de ton entreprise dans un seul espace, en collaboration avec tes collègues.",
      cta: {
        label: "Découvre les avantages pour les entreprises",
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
      title: "Tu es une citoyenne ou un citoyen ?",
      subtitle:
        "Active le service sur l’application IO : ainsi, si tu accèdes à XYZ dans les 7 jours suivant la réception du message dans l’application, tu ne recevras pas le papier et tu gagneras du temps et de l’argent.",
      cta: {
        label: "Découvre les avantages pour les citoyens",
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
export const frAppData: IAppData = {
  common: {
    alert:
      "La plateforme n’est pas opérationnelle. À l’heure actuelle, seules quelques-unes des fonctionnalités décrites sur cette page sont en cours de test, et ne sont disponibles que pour un nombre limité d’utilisateurs qui seront les destinataires des notifications envoyées par les organismes pilotes.",
    assistance: assistanceLink,
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
  co: {
    hero: coHero,
    infoblocks: coInfoBlocks,
    showcases: coShowcases,
    walkthrough: coWalkthrough,
    horizontalNav: coHorizontalNav,
  },
};
