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
      label: "Lies deine Bescheide",
      title: "Lies deine Bescheide",
      onClick: onReadClick,
    }
  : undefined;

export const pfHero: HeroProps = {
  type: "image",
  title: "Bescheide? Sind zum Greifen nah.",
  subtitle: `Mit SEND kannst du rechtliche Mitteilungen einer Organisation sofort erhalten: Du kannst 
    Einschreiben, die dir normalerweise in Papierform zugestellt werden, direkt online oder in der App einsehen, verwalten 
    und bezahlen.`,
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
      title: "Verpasse keine Bescheide mehr",
      content: (
        <>
          <Typography variant="body2">
            Bescheide sind Mitteilungen mit rechtlichem Wert, die offiziell von
            einer Verwaltung herausgegeben werden, wie z. B. Bußgeldbescheide,
            Steuerbescheide, Ergebnisse von Verwaltungsverfahren bei
            öffentlichen Verwaltungen oder Erstattungen, die du bisher immer per
            Einschreiben erhalten hast. Von nun an kannst du sie digital
            empfangen und einsehen, indem du über SPID oder CIE oder direkt über
            die IO-App auf Piattaforma Notifiche zugreifst.
          </Typography>
          <Typography variant="body2">
            Außerdem kannst du dank der Integration mit pagoPA eventuell
            angefallene Gebühren bezahlen, den Verlauf der erhaltenen Bescheide
            einsehen und diese direkt online verwalten. Darüber hinaus benötigst
            du nur eine Vollmacht, um auch die Bescheide deiner
            Familienangehörigen zu verwalten.
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
            Bei der Versendung von rechtlicher Kommunikation gibt SEND immer den
            digitalen Adressen der Empfänger den Vorrang. Du kannst jederzeit
            mit SPID und CIE auf die Plattform zugreifen, um deine Präferenzen
            zwischen PEC, App IO, E-Mail oder SMS anzugeben oder zu
            aktualisieren. Wenn du keine Adresse angibst oder keinen Zugang zur
            Plattform hast, erhältst du die Bescheide weiterhin per Einschreiben
            in Papierform.
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
            Derzeit wird SEND mit einer kleinen Anzahl von Verwaltungen
            getestet.
          </Typography>
          <Typography variant="body2">
            Nach und nach wird die Plattform von den öffentlichen Verwaltungen
            übernommen und für die Übermittlung von Bescheiden an alle Bürger
            genutzt.
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
              Wenn du eine PEC-Adresse hast, werden dir die Bescheide rechtmäßig
              zugestellt, und es gibt keine Einschreiben in Papierform mehr. Die
              dir zugesandte Empfangsbestätigung enthält den Link, über den du
              auf den Inhalt auf SEND zugreifen kannst.
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
              Wenn du den Dienst „Digitale Bescheide“ von SEND aktivierst,
              kannst du rechtliche Kommunikation{" "}
              <strong>direkt in der App</strong> erhalten und verwalten. Wenn du
              keine PEC hast und die Nachricht sofort liest, erhältst du kein
              Einschreiben in Papierform und der Bescheid wird rechtmäßig
              zugestellt.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "E-Mail oder SMS",
          subtitle: (
            <Typography variant="body2">
              Außerdem kannst du wählen, ob du eine Zahlungsaufforderung an
              deine E-Mail-Adresse oder per SMS erhalten möchtest. Wenn du keine
              PEC hast und über den entsprechenden Link auf die Plattform
              zugreifst, erhältst du kein Einschreiben in Papierform und der
              Bescheid gilt als rechtmäßig zugestellt.
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
/* ************************************** */
