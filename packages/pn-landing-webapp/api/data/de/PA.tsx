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
const heroSubtitle = `Und ab heute auch zu tun. SEND digitalisiert die Verwaltung rechtlicher Kommunikation und 
vereinfacht den Prozess für alle: für diejenigen, die sie versenden, und für diejenigen, die sie erhalten.`;

export const paHero: HeroProps = {
  type: "image",
  title: "Bescheide senden? Das ist leicht gesagt",
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
};
/* ************************************** */

/** Infoblocks mocked data */
const infoblock1_1 = `SEND digitalisiert und vereinfacht die Verwaltung von rechtlicher
Kommunikation. Die übermittelnden Stellen müssen lediglich das
zuzustellende Dokument hinterlegen: Die Plattform sorgt für den
Versand, entweder digital oder analog.`;
const infoblock1_2 = `Mit SEND wird die Ungewissheit hinsichtlich der Erreichbarkeit von
Empfängern verringert und der Verwaltungsaufwand und die Kosten
werden reduziert.`;
const infoblock2_1 = `SEND integriert sich in das Protokoll der Behörden und bietet sowohl
APIs für den automatischen Versand von Bescheiden als auch die
Möglichkeit, manuelle Sendungen zu tätigen. Nach dem Hochladen der
Zahlungsunterlagen und -formulare generiert die Plattform die UIN
(Unique Identification Number), einen eindeutigen
Identifikationscode für den Bescheid.`;
const infoblock2_2 = `Sie sucht dann in ihren Archiven und öffentlichen Registern nach
einer PEC, die sich auf den Adressaten zurückführen lässt, und
sendet den Bescheid. Danach sendet sie eine Zahlungsaufforderung an
die anderen digitalen Kontakte des Empfängers (IO-App, E-Mail und
SMS).`;
const infoblock2_3 = `Wenn der Empfänger keine digitale Adresse angegeben hat und keinen
Zugang zur Plattform hat, fährt die Plattform mit der Suche nach
einer physischen Adresse und anschließend mit dem Versand per
Einschreiben fort.`;
const infoblock3_1 = `Der Empfänger greift über SPID oder CIE auf die Plattform zu, wo er
das zugestellte Dokument einsehen und herunterladen kann. Dank der
Integration mit pagoPA kann er gleichzeitig auch die fälligen
Zahlungen leisten. Wenn er den Dienst in der IO-App aktiviert hat,
kann er alles direkt in der App erledigen.`;
const infoblock3_2 = `Wie die Behörde hat auch der Empfänger Zugriff auf die Historie des
Zustellungsstatus und die Bescheinigungen, die Dritten gegenüber
geltend gemacht werden können.`;
const infoblock4_1 =
  "Derzeit können Institutionen die technische Arbeit initiieren, die für die Integration mit SEND erforderlich ist.";
const infoblock4_2 = `die Liste der Technologiepartner und Vermittler die die Integrationsaktivitäten umsetzen, einsehen zur Plattform
und die zur Unterstützung bei der Verwaltung der technischen
Aspekte verwendet werden können`;

export const paInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      // overline: "Rappresenti un ente?",
      title: "Eine einfachere Möglichkeit, Bescheide zu verwalten",
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
      title: "Lade das Dokument hoch. Und dann lehn dich zurück.",
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
      title: "Und der Empfänger?",
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
      title: "Starten Sie die Integration",
      content: (
        <>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock4_1}>
            {infoblock4_1}
          </Typography>
          <Typography
            variant="body2"
            tabIndex={0}
            aria-label="In der Zwischenzeit können Behörden"
          >
            In der Zwischenzeit können Behörden:{" "}
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography
                variant="body2"
                tabIndex={0}
                aria-label="das Betriebshandbuch (aktualisiert am 20.11.2022)"
              >
                <Link
                  href={MANUALE_URL}
                  tabIndex={0}
                  aria-label="das Betriebshandbuch"
                >
                  das Betriebshandbuch
                </Link>{" "}
                (aktualisiert am 20.11.2022),{" "}
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml"
                  tabIndex={0}
                  aria-label="die b2b-APIs für öffentliche Verwaltungen"
                >
                  die b2b-APIs für öffentliche Verwaltungen
                </Link>
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml"
                  tabIndex={0}
                  aria-label="die b2b-APIs über den Stand der Benachrichtigungen konsultieren"
                >
                  die b2b-APIs über den Stand der Benachrichtigungen
                  konsultieren
                </Link>
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography
                variant="body2"
                tabIndex={0}
                aria-label={infoblock4_2}
              >
                <Link
                  href={PARTNER_AND_INTERMEDIARIES_PATH}
                  tabIndex={0}
                  aria-label="die Liste der Technologiepartner und Vermittler"
                >
                  die Liste der Technologiepartner und Vermittler
                </Link>{" "}
                die die Integrationsaktivitäten umsetzen, einsehen zur Plattform
                und die zur Unterstützung bei der Verwaltung der technischen
                Aspekte verwendet werden können
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
  "Bescheide werden über einen einzigen Kanal versandt, verwaltet und überwacht, der von mehreren Ansprechpartnern in derselben Organisation genutzt werden kann";
const showcase2 =
  "Bescheide können über API oder manuell hochgeladen werden: Sobald die Dokumente hinterlegt sind, kümmert sich die Plattform um den Versand und verfolgt die Statusänderungen";
const showcase3 =
  "Wenn der Empfänger eine digitale Adresse hat, verkürzt sich die Sendezeit erheblich";
const showcase4 =
  "Der Zustellungsprozess ist standardisiert, und es besteht eine größere Sicherheit, dass die Zustellung an den Empfänger erfolgt";
export const paShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Eine Möglichkeit, in vielerlei Hinsicht zu sparen",
      items: [
        {
          icon: <PeopleIcon />,
          title: "Einzigartig",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1}>
              {showcase1}
            </Typography>
          ),
        },
        {
          icon: <FireworksIcon />,
          title: "Einfach",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase2}>
              {showcase2}
            </Typography>
          ),
        },
        {
          icon: <EasyIcon />,
          title: "Sofort",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase3}>
              {showcase3}
            </Typography>
          ),
        },
        {
          icon: <CheckmarkIcon />,
          title: "Sicher",
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
  "Mit Hilfe von API-Schlüsseln oder manuell erstellt die Organisation die Benachrichtigungsanfrage und lädt die Anlagen hoch.";
const walkthrough2 = `SEND prüft die Vollständigkeit und Richtigkeit der Informationen. Bei jeder Statusänderung wird 
immer ein Zertifikat erstellt, das gegenüber Dritten geltend gemacht werden kann.`;
const walkthrough3 = `Die Plattform informiert den Empfänger über das Vorhandensein eines Bescheides über verschiedene mögliche Kanäle:
PEC, App IO, E-Mail, SMS. Alternativ kann sie auch eine physische Adresse finden und ein Einschreiben in Papierform versenden.`;
const walkthrough4 = `Der Empfänger greift auf die Plattform zu. Dort kann er die zugestellten Dokumente herunterladen und dank der 
Integration mit pagoPA gleichzeitig die fälligen Beträge bezahlen. Wenn er sie über IO erhält, kann er alles direkt in der 
App erledigen.`;

export const paWalkthrough: WalkthroughProps = {
  title: "Wie funktioniert das?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "Die Organisation erstellt die Benachrichtigungsanfrage",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough1}>
          {walkthrough1}
        </Typography>
      ),
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "Die Plattform übernimmt sie",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough2}>
          {walkthrough2}
        </Typography>
      ),
    },
    {
      icon: <SendIcon color="primary" />,
      title: "Der Bescheid wird gesendet",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough3}>
          {walkthrough3}
        </Typography>
      ),
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Der Empfänger erhält den Bescheid",
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
  "Verwalte die Bescheide deines Unternehmens zentral und in Zusammenarbeit mit deinen Kollegen.";
const horizontalNav2 =
  "Aktiviere den Dienst in der IO-App: Wenn du dich innerhalb von 7 Tagen nach Erhalt der Nachricht in der App bei XYZ anmeldest, erhältst du keinen Papierkram und sparst Zeit und Geld.";
export const paHorizontalNav: HorizontalNavProps = {
  // const paHorizontalNav = {
  sections: [
    {
      icon: (
        <SvgIcon component="image">
          <img src="static/icons/HORIZONTAL-NAV-1.svg" />
        </SvgIcon>
      ),
      title: "Repräsentierst du ein Unternehmen?",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={horizontalNav1}>
          {horizontalNav1}
        </Typography>
      ),
      cta: {
        label: "Entdecke die Vorteile für Unternehmen",
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
      title: "Bist du Bürger*in?",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={horizontalNav2}>
          {horizontalNav2}
        </Typography>
      ),
      cta: {
        label: "Entdecke die Vorteile für die Bürger",
        title: "CTA1",
        href: "#",
      },
    },
  ],
};
/* ************************************** */
