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
      label: "Lis tes notifications",
      title: "Lis tes notifications",
      onClick: onReadClick,
    }
  : undefined;

/** Hero mocked data */
export const pfHero: HeroProps = {
  type: "image",
  title: "Les notifications ? Elles sont à portée de main.",
  subtitle: `Avec SEND, tu peux recevoir instantanément les communications à valeur juridique d’un organisme : 
      tu peux visualiser, gérer et payer directement en ligne ou dans l’application les courriers recommandés qui te sont généralement envoyés sur papier.`,
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
      title: "Ne rate plus aucune notification",
      content: (
        <>
          <Typography variant="body2">
            Les notifications sont des communications à valeur juridique émises
            officiellement par une administration, telles que des amendes, des
            avis d’imposition, des résultats de procédures administratives
            engagées avec les Administrations publiques ou des remboursements,
            que tu as jusqu’à présent toujours reçus par courrier recommandé. À
            partir d’aujourd’hui, tu peux les recevoir et les consulter en
            numérique, en accédant à SEND via SPID ou CIE ou directement sur
            l’application IO.
          </Typography>
          <Typography variant="body2">
            Tu peux également payer les éventuels coûts grâce à l’intégration
            avec pagoPA, consulter l’historique des notifications reçues et les
            gérer directement en ligne. De plus, il te suffit d’une délégation
            pour gérer les courriers recommandés de tes proches.
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
            Pour envoyer les communications à valeur juridique, SEND donne
            toujours la priorité aux coordonnées numériques du destinataire. Tu
            peux à tout moment te connecter à la plateforme avec SPID et CIE
            pour indiquer ou mettre à jour tes préférences entre l’adresse PEC,
            l’application IO, l’e-mail ou le SMS. Si tu n’indiques aucune
            coordonnée ou si tu n’as pas accès à la plateforme, tu continueras à
            recevoir les notifications par courrier recommandé papier.
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
            Actuellement, SEND est testée avec un nombre limité
            d’administrations.
          </Typography>
          <Typography variant="body2">
            Progressivement, la plateforme sera adoptée par les Administrations
            publiques et utilisée pour envoyer des notifications à tous les
            citoyens.
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
              Si tu as une adresse PEC, les notifications te seront légalement
              remises, sans plus de courriers recommandés papier. L’avis de
              réception qui te sera envoyé contient le lien pour accéder au
              contenu sur SEND.
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
              Si tu actives le service « Notifications numériques » de SEND, tu
              peux recevoir et gérer{" "}
              <strong>directement dans l’application</strong> les communications
              à valeur juridique. Si tu n’as pas de PEC et que tu lis
              immédiatement le message, tu ne recevras pas le courrier
              recommandé papier et la notification te sera légalement remise.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "E-mail ou SMS",
          subtitle: (
            <Typography variant="body2">
              En outre, tu peux également choisir de recevoir une notification
              de courtoisie à ton adresse électronique ou par SMS. Si tu n’as
              pas de PEC et que tu accèdes à la plateforme à partir du lien
              approprié, tu ne recevras pas le courrier recommandé papier et la
              notification te sera légalement remise.
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
/* ************************************** */

/** HorizontalNav mocked data */
// const pfHorizontalNav: HorizontalNavProps = {
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
