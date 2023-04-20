import Link from "next/link";

import { List, ListItem, SvgIcon, Typography } from "@mui/material";

import {
  FooterLinksType,
  HeroProps,
  HorizontalNavProps,
  PreLoginFooterLinksType,
  WalkthroughProps
} from "@pagopa/mui-italia";

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
import { IAppData, IInfoblockData, ILinkData, INavigationBarProps, IShowcaseData } from "model";

import {
  IMAGES_PATH,
  MANUALE_URL,
  PAGOPA_HELP_EMAIL,
  PAGOPA_HOME,
  PARTNER_AND_INTERMEDIARIES_PATH,
  PN_PF_URL
} from "@utils/constants";


const onReadClick = () => {
  window.open(PN_PF_URL, "_blank");
};

const navigation: INavigationBarProps = {
  title: "Piattaforma Notifiche",
  chip: "Beta",
  pf: "Bürger",
  pa: "Einrichtungen",
  faq: 'FAQ',
};

// eslint-disable-next-line no-extra-boolean-cast
const heroCta = !!PN_PF_URL
  ? {
    label: "Lies deine Bescheide",
    title: "Lies deine Bescheide",
    onClick: onReadClick,
  }
  : undefined;

/** Hero mocked data */
const paHero: HeroProps = {
  type: "image",
  title: "Bescheide senden? Das ist leicht gesagt",
  subtitle: `Und ab heute auch zu tun. Piattaforma Notifiche digitalisiert die Verwaltung rechtlicher Kommunikation und 
    vereinfacht den Prozess für alle: für diejenigen, die sie versenden, und für diejenigen, die sie erhalten.`,
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
};

const pfHero: HeroProps = {
  type: "image",
  title: "Bescheide? Sind zum Greifen nah.",
  subtitle: `Mit Piattaforma Notifiche kannst du rechtliche Mitteilungen einer Organisation sofort erhalten: Du kannst 
  Einschreiben, die dir normalerweise in Papierform zugestellt werden, direkt online oder in der App einsehen, verwalten 
  und bezahlen.`,
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
      title: "Eine einfachere Möglichkeit, Bescheide zu verwalten",
      content: (
        <>
          <Typography variant="body2">
            Piattaforma Notifiche digitalisiert und vereinfacht die Verwaltung von rechtlicher Kommunikation.
            Die übermittelnden Stellen müssen lediglich das zuzustellende Dokument hinterlegen: Die Plattform
            sorgt für den Versand, entweder digital oder analog.
          </Typography>
          <Typography variant="body2">
            Mit Piattaforma Notifiche wird die Ungewissheit hinsichtlich der Erreichbarkeit von Empfängern
            verringert und der Verwaltungsaufwand und die Kosten werden reduziert.
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
            Piattaforma Notifiche integriert sich in das Protokoll der Behörden und bietet sowohl APIs für
            den automatischen Versand von Bescheiden als auch die Möglichkeit, manuelle Sendungen zu tätigen.
            Nach dem Hochladen der Zahlungsunterlagen und -formulare generiert die Plattform die UIN (Unique
            Identification Number), einen eindeutigen Identifikationscode für den Bescheid.
          </Typography>
          <Typography variant="body2">
            Sie sucht dann in ihren Archiven und öffentlichen Registern nach einer PEC, die sich auf den
            Adressaten zurückführen lässt, und sendet den Bescheid. Danach sendet sie eine Zahlungsaufforderung
            an die anderen digitalen Kontakte des Empfängers (IO-App, E-Mail und SMS).
          </Typography>
          <Typography variant="body2">
            Wenn der Empfänger keine digitale Adresse angegeben hat und keinen Zugang zur Plattform hat, fährt
            die Plattform mit der Suche nach einer physischen Adresse und anschließend mit dem Versand per
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
            Der Empfänger greift über SPID oder CIE auf die Plattform zu, wo er das zugestellte Dokument
            einsehen und herunterladen kann. Dank der Integration mit pagoPA kann er gleichzeitig auch die
            fälligen Zahlungen leisten. Wenn er den Dienst in der IO-App aktiviert hat, kann er alles
            direkt in der App erledigen.
          </Typography>
          <Typography variant="body2">
            Wie die Behörde hat auch der Empfänger Zugriff auf die Historie des Zustellungsstatus und die
            Bescheinigungen, die Dritten gegenüber geltend gemacht werden können.
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
            Derzeit können Institutionen die technische Arbeit initiieren, die für die Integration mit Piattaforma Notifiche erforderlich ist.
          </Typography>
          <Typography variant="body2">
            In der Zwischenzeit können Behörden:{" "}
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href={MANUALE_URL}>
                  das Betriebshandbuch
                </Link>
                {" "}(aktualisiert am 20.11.2022),{" "}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
                  die b2b-APIs für öffentliche Verwaltungen
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
                  die b2b-APIs über den Stand der Benachrichtigungen konsultieren
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href={PARTNER_AND_INTERMEDIARIES_PATH}>
                  die Liste der Technologiepartner und Vermittler
                </Link>
                {" "}die die Integrationsaktivitäten umsetzen, einsehen zur Plattform und die zur Unterstützung bei der Verwaltung der technischen Aspekte verwendet werden können
              </Typography>
            </ListItem>
          </List>

        </>
      ),
      inverse: false,
      image: `${IMAGES_PATH}/pa-infoblock-4.png`,
      altText: "",
      aspectRatio: "9/16",
      imageShadow: false
    },
  },
];

const pfInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      title: "Verpasse keine Bescheide mehr",
      content: (
        <>
          <Typography variant="body2">
            Bescheide sind Mitteilungen mit rechtlichem Wert, die offiziell von einer Verwaltung herausgegeben werden,
            wie z. B. Bußgeldbescheide, Steuerbescheide, Ergebnisse von Verwaltungsverfahren bei öffentlichen
            Verwaltungen oder Erstattungen, die du bisher immer per Einschreiben erhalten hast. Von nun an kannst du
            sie digital empfangen und einsehen, indem du über SPID oder CIE oder direkt über die IO-App auf Piattaforma
            Notifiche zugreifst.
          </Typography>
          <Typography variant="body2">
            Außerdem kannst du dank der Integration mit pagoPA eventuell angefallene Gebühren bezahlen, den Verlauf der
            erhaltenen Bescheide einsehen und diese direkt online verwalten. Darüber hinaus benötigst du nur eine
            Vollmacht, um auch die Bescheide deiner Familienangehörigen zu verwalten.
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
      title: "Du entscheidest, wie du Bescheide erhältst",
      content: (
        <>
          <Typography variant="body2">
            Bei der Versendung von rechtlicher Kommunikation gibt Piattaforma Notifiche immer den digitalen Adressen der
            Empfänger den Vorrang. Du kannst jederzeit mit SPID und CIE auf die Plattform zugreifen, um deine Präferenzen
            zwischen PEC, App IO, E-Mail oder SMS anzugeben oder zu aktualisieren. Wenn du keine Adresse angibst oder
            keinen Zugang zur Plattform hast, erhältst du die Bescheide weiterhin per Einschreiben in Papierform.
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
      title: "Die Zukunft der rechtlichen Kommunikation",
      content: (
        <>
          <Typography variant="body2">
            Derzeit wird Piattaforma Notifiche mit einer kleinen Anzahl von Verwaltungen getestet.
          </Typography>
          <Typography variant="body2">
            Nach und nach wird die Plattform von den öffentlichen Verwaltungen übernommen und für die Übermittlung von
            Bescheiden an alle Bürger genutzt.
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

const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Was digitale Bescheide dir bieten",
      items: [
        {
          icon: <PiggyIcon />,
          title: "Bequemlichkeit",
          subtitle:
            "Digitale Zustellung von Bescheiden führt zu niedrigeren Service- und Versandkosten",
        },
        {
          icon: <HourglassIcon />,
          title: "Zeit",
          subtitle:
            "Kein Warten oder Anstehen mehr bei der Abholung von Papiermitteilungen",
        },
        {
          icon: <EcologyIcon />,
          title: "Nachhaltigkeit",
          subtitle:
            "Du trägst zur Verringerung des Papierverbrauchs und der Transportemissionen bei",
        },
        {
          icon: <CloudIcon />,
          title: "Platz",
          subtitle:
            "Du musst keine gedruckten Dokumente mehr aufbewahren, da du diese digital herunterladen und archivieren kannst",
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
          title: "Zertifizierte Mail (PEC)",
          subtitle: (
            <Typography variant="body2">
              Wenn du eine PEC-Adresse hast, werden dir die Bescheide rechtmäßig zugestellt, und es gibt keine Einschreiben
              in Papierform mehr. Die dir zugesandte Empfangsbestätigung enthält den Link, über den du auf den Inhalt auf
              Piattaforma Notifiche zugreifen kannst.
            </Typography>
          ),
        },
        {
          /**
           * Waiting for IOIcon
           */
          // icon: <IOIcon />,
          icon: <img src={`${IMAGES_PATH}/IOIcon.svg`} />,
          title: "IO-App",
          subtitle: (
            <Typography variant="body2">
              Wenn du den Dienst „Digitale Bescheide“ von Piattaforma Notifiche aktivierst, kannst du rechtliche Kommunikation{" "}
              <strong>direkt in der App</strong> erhalten und verwalten. Wenn du keine PEC hast und die Nachricht sofort liest,
              erhältst du kein Einschreiben in Papierform und der Bescheid wird rechtmäßig zugestellt.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "E-Mail oder SMS",
          subtitle: (
            <Typography variant="body2">
              Außerdem kannst du wählen, ob du eine Zahlungsaufforderung an deine E-Mail-Adresse oder per SMS erhalten möchtest.
              Wenn du keine PEC hast und über den entsprechenden Link auf die Plattform zugreifst, erhältst du kein Einschreiben
              in Papierform und der Bescheid gilt als rechtmäßig zugestellt.
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
      subtitle: `Piattaforma Notifiche prüft die Vollständigkeit und Richtigkeit der Informationen. Bei jeder Statusänderung wird 
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

const pfWalkthrough: WalkthroughProps = {
  title: "Wie funktioniert das?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Du erhältst den Bescheid",
      subtitle: `
        Bei jedem Bescheid prüft die Plattform, ob es eine dir zugeordnete oder von dir angegebene PEC für 
        den Versand der Empfangsbestätigung gibt. Sie sendet dann eine Zahlungsaufforderung an deine anderen 
        digitalen Kontakte (IO-App, E-Mail und SMS). Wenn du keine digitalen Kontaktdaten angegeben hast und 
        keinen Zugang zur Plattform hast, erhältst du ein Einschreiben in Papierform.
      `,
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Lies den Inhalt",
      subtitle: `
        Von der empfangenen Nachricht aus kannst du auf die Plattform zugreifen, um den Bescheid zu lesen und 
        die entsprechenden Anhänge herunterzuladen. Wenn du den Dienst auf IO aktivierst, kannst du den Inhalt 
        direkt in der App einsehen: Dies entspricht der Unterzeichnung des Rückscheins eines herkömmlichen 
        Einschreibens.
      `,
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Begleiche die Zahlung",
      subtitle: `
        Wenn ein Betrag zu zahlen ist, kannst du dank der Integration mit pagoPA gleichzeitig online von der 
        Plattform oder direkt von IO aus fortfahren. Wenn du es vorziehst, einen Schalter aufzusuchen, musst 
        du den mit dem Bescheid erhaltenen Zahlschein mitnehmen.
      `,
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "Selber handeln oder andere handeln lassen",
      subtitle: `
        Wenn du möchtest, kannst du andere natürliche oder juristische Personen damit beauftragen, deine 
        Bescheide online zu empfangen oder die beigefügten Dokumente in Papierform bei jeder Poststelle 
        abzuholen.
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

/**
 * Footer data
 */
const pagoPALink: ILinkData = {
  label: "PagoPA S.p.A.",
  href: PAGOPA_HOME ?? "",
  ariaLabel: "Link: Gehe auf die Website von PagoPA S.p.A."
};

const assistanceLink = {
  label: "Hilfe",
  ariaLabel: "Hilfe",
  href: `mailto:${PAGOPA_HELP_EMAIL}`,
};

const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — Aktiengesellschaft mit einem einzigen Gesellschafter -
    voll eingezahltes Grundkapital von 1.000.000 Euro - eingetragener Sitz in Rom,
    Piazza Colonna 370
    <br />
    PLZ 00187 - Eintragungsnummer im Handelsregister von Rom, Steuernummer und USt-IdNr. 15376371009
  </>
);

const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "Über uns",
        href: `${pagoPALink.href}societa/chi-siamo`,
        ariaLabel: "Zum Link: Über uns",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}opportunita/pnrr/progetti`,
        ariaLabel: "Zum Link: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}media`,
        ariaLabel: "Zum Link: Media",
        linkType: "external",
      },
      {
        label: "Karriere",
        href: `${pagoPALink.href}lavora-con-noi`,
        ariaLabel: "Zum Link: Karriere",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Quellen",
    links: [
      {
        label: "Datenschutzerklärung",
        href: `/informativa-privacy/`,
        ariaLabel: "Zum Link: Datenschutzerklärung",
        linkType: "internal",
      },
      {
        label: "Zertifizierungen",
        href: "https://www.pagopa.it/static/10ffe3b3d90ecad83d1bbebea0512188/Certificato-SGSI-PagoPA-2020.pdf",
        ariaLabel: "Zum Link: Zertifizierungen",
        linkType: "internal",
      },
      {
        label: "Informationssicherheit",
        href: "https://www.pagopa.it/static/781646994f1f8ddad2d95af3aaedac3d/Sicurezza-delle-informazioni_PagoPA-S.p.A..pdf",
        ariaLabel: "Zum Link: Informationssicherheit",
        linkType: "internal",
      },
      {
        label: "Recht auf Schutz personenbezogener Daten",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel: "Zum Link: Recht auf Schutz personenbezogener Daten",
        linkType: "internal",
      },
      // {
      //   label: "Cookie-Einstellungen",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Zum Link: Cookie-Einstellungen",
      //   linkType: "internal",
      // },
      {
        label: "Transparente Gesellschaft",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Zum Link: Transparente Gesellschaft",
        linkType: "internal",
      },
      {
        label: "Responsible Disclosure Policy",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Zum Link: Responsible Disclosure Policy",
        linkType: "internal",
      },
      {
        label: "Modell 321",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Zum Link: Modell 321",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Folge uns auf",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel: "Link: Gehe auf die Website LinkedIn von PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel: "Link: Gehe auf die Website Twitter von PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel: "Link: Gehe auf die Website Instagram von PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel: "Link: Gehe auf die Website Medium von PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Zugänglichkeit",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Zum Link: Zugänglichkeit",
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

/** Application Data Mock */
export const deAppData: IAppData = {
  common: {
    navigation,
    assistance: assistanceLink,
    pagoPALink,
    companyLegalInfo,
    preLoginLinks,
    postLoginLinks
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
  }
};
