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
  title: "Bescheide senden? Das ist leicht gesagt",
  subtitle: `Und ab heute auch zu tun. SEND digitalisiert die Verwaltung rechtlicher Kommunikation und 
      vereinfacht den Prozess für alle: für diejenigen, die sie versenden, und für diejenigen, die sie erhalten.`,
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
};
/* ************************************** */

/** Infoblocks mocked data */
export const paInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      // overline: "Rappresenti un ente?",
      title: "Eine einfachere Möglichkeit, Bescheide zu verwalten",
      content: (
        <>
          <Typography variant="body2">
            SEND digitalisiert und vereinfacht die Verwaltung von rechtlicher
            Kommunikation. Die übermittelnden Stellen müssen lediglich das
            zuzustellende Dokument hinterlegen: Die Plattform sorgt für den
            Versand, entweder digital oder analog.
          </Typography>
          <Typography variant="body2">
            Mit SEND wird die Ungewissheit hinsichtlich der Erreichbarkeit von
            Empfängern verringert und der Verwaltungsaufwand und die Kosten
            werden reduziert.
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
          <Typography variant="body2">
            SEND integriert sich in das Protokoll der Behörden und bietet sowohl
            APIs für den automatischen Versand von Bescheiden als auch die
            Möglichkeit, manuelle Sendungen zu tätigen. Nach dem Hochladen der
            Zahlungsunterlagen und -formulare generiert die Plattform die UIN
            (Unique Identification Number), einen eindeutigen
            Identifikationscode für den Bescheid.
          </Typography>
          <Typography variant="body2">
            Sie sucht dann in ihren Archiven und öffentlichen Registern nach
            einer PEC, die sich auf den Adressaten zurückführen lässt, und
            sendet den Bescheid. Danach sendet sie eine Zahlungsaufforderung an
            die anderen digitalen Kontakte des Empfängers (IO-App, E-Mail und
            SMS).
          </Typography>
          <Typography variant="body2">
            Wenn der Empfänger keine digitale Adresse angegeben hat und keinen
            Zugang zur Plattform hat, fährt die Plattform mit der Suche nach
            einer physischen Adresse und anschließend mit dem Versand per
            Einschreiben fort.
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
          <Typography variant="body2">
            Der Empfänger greift über SPID oder CIE auf die Plattform zu, wo er
            das zugestellte Dokument einsehen und herunterladen kann. Dank der
            Integration mit pagoPA kann er gleichzeitig auch die fälligen
            Zahlungen leisten. Wenn er den Dienst in der IO-App aktiviert hat,
            kann er alles direkt in der App erledigen.
          </Typography>
          <Typography variant="body2">
            Wie die Behörde hat auch der Empfänger Zugriff auf die Historie des
            Zustellungsstatus und die Bescheinigungen, die Dritten gegenüber
            geltend gemacht werden können.
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
          <Typography variant="body2">
            Derzeit können Institutionen die technische Arbeit initiieren, die
            für die Integration mit SEND erforderlich ist.
          </Typography>
          <Typography variant="body2">
            In der Zwischenzeit können Behörden:{" "}
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={MANUALE_URL}>das Betriebshandbuch</Link>{" "}
                (aktualisiert am 20.11.2022),{" "}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
                  die b2b-APIs für öffentliche Verwaltungen
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
                  die b2b-APIs über den Stand der Benachrichtigungen
                  konsultieren
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={PARTNER_AND_INTERMEDIARIES_PATH}>
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
export const paShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Eine Möglichkeit, in vielerlei Hinsicht zu sparen",
      items: [
        {
          icon: <PeopleIcon />,
          title: "Einzigartig",
          subtitle:
            "Bescheide werden über einen einzigen Kanal versandt, verwaltet und überwacht, der von mehreren Ansprechpartnern in derselben Organisation genutzt werden kann",
        },
        {
          icon: <FireworksIcon />,
          title: "Einfach",
          subtitle:
            "Bescheide können über API oder manuell hochgeladen werden: Sobald die Dokumente hinterlegt sind, kümmert sich die Plattform um den Versand und verfolgt die Statusänderungen",
        },
        {
          icon: <EasyIcon />,
          title: "Sofort",
          subtitle:
            "Wenn der Empfänger eine digitale Adresse hat, verkürzt sich die Sendezeit erheblich",
        },
        {
          icon: <CheckmarkIcon />,
          title: "Sicher",
          subtitle:
            "Der Zustellungsprozess ist standardisiert, und es besteht eine größere Sicherheit, dass die Zustellung an den Empfänger erfolgt",
        },
      ],
    },
  },
];
/* ************************************** */

/** Walkthrough mocked data */
export const paWalkthrough: WalkthroughProps = {
  title: "Wie funktioniert das?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "Die Organisation erstellt die Benachrichtigungsanfrage",
      subtitle:
        "Mit Hilfe von API-Schlüsseln oder manuell erstellt die Organisation die Benachrichtigungsanfrage und lädt die Anlagen hoch.",
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "Die Plattform übernimmt sie",
      subtitle: `SEND prüft die Vollständigkeit und Richtigkeit der Informationen. Bei jeder Statusänderung wird 
          immer ein Zertifikat erstellt, das gegenüber Dritten geltend gemacht werden kann.`,
    },
    {
      icon: <SendIcon color="primary" />,
      title: "Der Bescheid wird gesendet",
      subtitle: `Die Plattform informiert den Empfänger über das Vorhandensein eines Bescheides über verschiedene mögliche Kanäle:
          PEC, App IO, E-Mail, SMS. Alternativ kann sie auch eine physische Adresse finden und ein Einschreiben in Papierform versenden.`,
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Der Empfänger erhält den Bescheid",
      subtitle: `Der Empfänger greift auf die Plattform zu. Dort kann er die zugestellten Dokumente herunterladen und dank der 
          Integration mit pagoPA gleichzeitig die fälligen Beträge bezahlen. Wenn er sie über IO erhält, kann er alles direkt in der 
          App erledigen.`,
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
      title: "Repräsentierst du ein Unternehmen?",
      subtitle:
        "Verwalte die Bescheide deines Unternehmens zentral und in Zusammenarbeit mit deinen Kollegen.",
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
      subtitle:
        "Aktiviere den Dienst in der IO-App: Wenn du dich innerhalb von 7 Tagen nach Erhalt der Nachricht in der App bei XYZ anmeldest, erhältst du keinen Papierkram und sparst Zeit und Geld.",
      cta: {
        label: "Entdecke die Vorteile für die Bürger",
        title: "CTA1",
        href: "#",
      },
    },
  ],
};
/* ************************************** */
