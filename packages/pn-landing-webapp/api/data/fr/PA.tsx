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
const heroSubtitle = `Et à faire également à partir d’aujourd’hui. SEND numérise la gestion des communications 
à valeur juridique, en simplifiant le processus pour tous : qui les envoie et qui les reçoit.`;

export const paHero: HeroProps = {
  type: "image",
  title: "Envoyer des notifications ? Facile à dire.",
  subtitle: (
    <Typography
      component="p"
      tabIndex={0}
      aria-label={heroSubtitle}
      sx={{
        color: "primary.contrastText",
      }}
    >
      {heroSubtitle}
    </Typography>
  ),
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
}; // cta: 'Lis tes notifications' ?????
/* ************************************** */

/** Infoblocks mocked data */
const infoblock1_1 = `SEND numérise et simplifie la gestion des communications à valeur
juridique. Les organismes émetteurs doivent seulement déposer l’acte
à notifier : ce sera la plateforme qui s’occupera de l’envoi, par
voie numérique ou analogique.`;
const infoblock1_2 = `Avec SEND, l’incertitude de la disponibilité des destinataires
diminue et les temps et les coûts de gestion sont réduits.`;
const infoblock2_1 = `SEND s’intègre au protocole des organismes et offre à la fois des
API pour l’envoi automatique des notifications et la possibilité de
faire des envois manuels. Une fois le chargement des actes et des
formulaires de paiement effectué, la plateforme génère l’IUN, un
code unique d’identification de la notification.`;
const infoblock2_2 = `Ensuite, elle recherche dans ses archives et dans les registres
publics une adresse PEC attribuée au destinataire et envoie la
notification. Ensuite, elle envoie un avis de courtoisie aux autres
coordonnées numériques (application IO, e-mail et SMS) du
destinataire.`;
const infoblock2_3 = `Si le destinataire n’a indiqué aucune coordonnée numérique et n’a
pas accès à la plateforme, celle-ci procède à la recherche d’une
adresse physique, puis à l’envoi par courrier recommandé papier.`;
const infoblock3_1 = `Le destinataire accède à la plateforme via SPID ou CIE, où il peut
visualiser et télécharger l’acte notifié. Grâce à l’intégration avec
pagoPA, il peut également payer ce qui est dû en même temps. S’il a
activé le service sur l’application IO, il peut tout faire
directement dans l’application.`;
const infoblock3_2 = `Comme l’organisme, le destinataire a également accès à l’historique
des états de la notification et aux attestations opposables aux
tiers qui en sont la preuve.`;
const infoblock4_1 = `Actuellement, les organisations peuvent démarrer les activités
techniques nécessaires à l'intégration dans SEND.`;
const infoblock4_2 = `Pendant ce temps, les organismes peuvent consulter le: `;
const infoblock4_3 = `la liste des Partenaires et Intermédiaires technologiques qui mettent en œuvre les activités d’intégration à la
plate-forme et qui peut servir de support dans la gestion des aspects techniques.`;

export const paInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      // overline: "Rappresenti un ente?",
      title: "Une façon plus simple de gérer les notifications",
      content: (
        <>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock1_1}>
            {infoblock1_1}
          </Typography>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock1_2}>
            {infoblock1_2}
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
          <Typography variant="body2" tabIndex={0} aria-label={infoblock2_1}>
            {infoblock2_1}
          </Typography>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock2_2}>
            {infoblock2_2}
          </Typography>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock2_3}>
            {infoblock2_3}
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
          <Typography variant="body2" tabIndex={0} aria-label={infoblock3_1}>
            {infoblock3_1}
          </Typography>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock3_2}>
            {infoblock3_2}
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
          <Typography variant="body2" tabIndex={0} aria-label={infoblock4_1}>
            {infoblock4_1}
          </Typography>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock4_2}>
            {infoblock4_2}
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography
                variant="body2"
                tabIndex={0}
                aria-label="manuel d’utilisation (mis à jour le 28/06/2022)"
              >
                <Link
                  href={MANUALE_URL}
                  tabIndex={0}
                  aria-label="manuel d’utilisation"
                >
                  manuel d’utilisation
                </Link>{" "}
                (mis à jour le 28/06/2022),
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml"
                  tabIndex={0}
                  aria-label="les API b2b pour les administrations publiques"
                >
                  les API b2b pour les administrations publiques
                </Link>
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml"
                  tabIndex={0}
                  aria-label="les API b2b pour l’avancement des notifications"
                >
                  les API b2b pour l’avancement des notifications.
                </Link>
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography
                variant="body2"
                tabIndex={0}
                aria-label={infoblock4_3}
              >
                <Link
                  href={PARTNER_AND_INTERMEDIARIES_PATH}
                  tabIndex={0}
                  aria-label="la liste des Partenaires et Intermédiaires technologiques"
                >
                  la liste des Partenaires et Intermédiaires technologiques
                </Link>{" "}
                qui mettent en œuvre les activités d’intégration à la
                plate-forme et qui peut servir de support dans la gestion des
                aspects techniques.
              </Typography>
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
const showcase1 =
  "Les notifications sont envoyées, gérées et surveillées par un seul canal, accessible par plusieurs référents d’un même organisme";
const showcase2 =
  "Tu peux télécharger des notifications via l’API ou manuellement : les documents sont déposés, et la plateforme s’occupe de l’envoi et suit les changements d’état";
const showcase3 =
  "Si le destinataire a une coordonnée numérique, les temps d’envoi diminuent considérablement";
const showcase4 =
  "Le processus de notification est normalisé et il y a une plus grande certitude de livraison au destinataire";

export const paShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Un seul moyen d’économiser de nombreuses façons",
      items: [
        {
          icon: <PeopleIcon />,
          title: "Unique",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1}>
              {showcase1}
            </Typography>
          ),
        },
        {
          icon: <FireworksIcon />,
          title: "Simple",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase2}>
              {showcase2}
            </Typography>
          ),
        },
        {
          icon: <EasyIcon />,
          title: "Immédiat",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase3}>
              {showcase3}
            </Typography>
          ),
        },
        {
          icon: <CheckmarkIcon />,
          title: "Certain",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase4}>
              {showcase4}
            </Typography>
          ),
        },
      ],
    },
  },
];
/* ************************************** */

/** Walkthrough mocked data */
const walkthrough1 =
  "À l’aide de clés API ou manuellement, l’organisme crée la demande de notification et télécharge les pièces jointes.";
const walkthrough2 = `SEND vérifie l’exhaustivité et l’exactitude des informations. 
  À chaque changement d’état, l’attestation correspondante opposable à des tiers est 
  toujours générée.`;
const walkthrough3 = `La plateforme informe le destinataire de la présence d’une notification via 
  plusieurs canaux possibles : adresse PEC, application IO, e-mail, SMS. Elle peut 
  également rechercher une adresse physique et envoyer un courrier recommandé papier.`;
const walkthrough4 = `Le destinataire accède à la plateforme. Là, il peut télécharger les documents 
  notifiés et payer en même temps ce qui est dû, grâce à l’intégration avec pagoPA. 
  S’il la reçoit via IO, il peut tout faire directement dans l’application.`;

export const paWalkthrough: WalkthroughProps = {
  title: "Comment ça fonctionne ?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "L’organisme crée la demande de notification",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough1}>
          {walkthrough1}
        </Typography>
      ),
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "La plateforme la prend en charge",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough2}>
          {walkthrough2}
        </Typography>
      ),
    },
    {
      icon: <SendIcon color="primary" />,
      title: "La notification est envoyée",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough3}>
          {walkthrough3}
        </Typography>
      ),
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Le destinataire la reçoit",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough4}>
          {walkthrough4}
        </Typography>
      ),
    },
  ],
};
/* ************************************** */

/** HorizontalNav mocked data */
const horizontalNav1 =
  "Gère les notifications de ton entreprise dans un seul espace, en collaboration avec tes collègues.";
const horizontalNav2 =
  "Active le service sur l’application IO : ainsi, si tu accèdes à XYZ dans les 7 jours suivant la réception du message dans l’application, tu ne recevras pas le papier et tu gagneras du temps et de l’argent.";
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
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={horizontalNav1}>
          {horizontalNav1}
        </Typography>
      ),
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
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={horizontalNav2}>
          {horizontalNav2}
        </Typography>
      ),
      cta: {
        label: "Découvre les avantages pour les citoyens",
        title: "CTA1",
        href: "#",
      },
    },
  ],
};
/* ************************************** */
