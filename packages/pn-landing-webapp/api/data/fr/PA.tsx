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

/** Hero mocked data */
export const paHero: HeroProps = {
  type: "image",
  title: "Envoyer des notifications ? Facile à dire.",
  subtitle: `Et à faire également à partir d’aujourd’hui. SEND numérise la gestion des communications à valeur juridique, en simplifiant le processus pour tous : qui les envoie et qui les reçoit.`,
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
}; // cta: 'Lis tes notifications' ?????
/* ************************************** */

/** Infoblocks mocked data */
export const paInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      // overline: "Rappresenti un ente?",
      title: "Une façon plus simple de gérer les notifications",
      content: (
        <>
          <Typography variant="body2">
            SEND numérise et simplifie la gestion des communications à valeur
            juridique. Les organismes émetteurs doivent seulement déposer l’acte
            à notifier : ce sera la plateforme qui s’occupera de l’envoi, par
            voie numérique ou analogique.
          </Typography>
          <Typography variant="body2">
            Avec SEND, l’incertitude de la disponibilité des destinataires
            diminue et les temps et les coûts de gestion sont réduits.
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
            SEND s’intègre au protocole des organismes et offre à la fois des
            API pour l’envoi automatique des notifications et la possibilité de
            faire des envois manuels. Une fois le chargement des actes et des
            formulaires de paiement effectué, la plateforme génère l’IUN, un
            code unique d’identification de la notification.
          </Typography>
          <Typography variant="body2">
            Ensuite, elle recherche dans ses archives et dans les registres
            publics une adresse PEC attribuée au destinataire et envoie la
            notification. Ensuite, elle envoie un avis de courtoisie aux autres
            coordonnées numériques (application IO, e-mail et SMS) du
            destinataire.
          </Typography>
          <Typography variant="body2">
            Si le destinataire n’a indiqué aucune coordonnée numérique et n’a
            pas accès à la plateforme, celle-ci procède à la recherche d’une
            adresse physique, puis à l’envoi par courrier recommandé papier.
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
            activé le service sur l’application IO, il peut tout faire
            directement dans l’application.
          </Typography>
          <Typography variant="body2">
            Comme l’organisme, le destinataire a également accès à l’historique
            des états de la notification et aux attestations opposables aux
            tiers qui en sont la preuve.
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
      title: "Démarrer l'intégration",
      content: (
        <>
          <Typography variant="body2">
            Actuellement, les organisations peuvent démarrer les activités
            techniques nécessaires à l'intégration dans SEND.
          </Typography>
          <Typography variant="body2">
            Pendant ce temps, les organismes peuvent consulter le
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={MANUALE_URL}>manuel d’utilisation</Link> (mis à jour
                le 28/06/2022),{" "}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2"></Typography>
              <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
                les API b2b pour les administrations publiques
              </Link>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2"></Typography>
              <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
                les API b2b pour l’avancement des notifications.
              </Link>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2"></Typography>
              <Link href={PARTNER_AND_INTERMEDIARIES_PATH}>
                la liste des Partenaires et Intermédiaires technologiques
              </Link>
              qui mettent en œuvre les activités d’intégration à la plate-forme
              et qui peut servir de support dans la gestion des aspects
              techniques.
            </ListItem>
          </List>
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
/* ************************************** */

/** Walkthrough mocked data */
export const paWalkthrough: WalkthroughProps = {
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
      subtitle: `SEND vérifie l’exhaustivité et l’exactitude des informations. 
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
/* ************************************** */
