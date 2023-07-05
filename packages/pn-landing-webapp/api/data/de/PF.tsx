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

const heroSubtitle = `Mit SEND kannst du rechtliche Mitteilungen einer Organisation sofort erhalten: Du kannst 
  Einschreiben, die dir normalerweise in Papierform zugestellt werden, direkt online oder in der App einsehen, verwalten 
  und bezahlen.`;

export const pfHero: HeroProps = {
  type: "image",
  title: "Bescheide? Sind zum Greifen nah.",
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
  ctaPrimary: heroCta,
  inverse: false,
  image: `${IMAGES_PATH}/pf-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
};
/* ************************************** */

/** Infoblocks mocked data */
const infoblock1_1 = `Bescheide sind Mitteilungen mit rechtlichem Wert, die offiziell von
einer Verwaltung herausgegeben werden, wie z. B. Bußgeldbescheide,
Steuerbescheide, Ergebnisse von Verwaltungsverfahren bei
öffentlichen Verwaltungen oder Erstattungen, die du bisher immer per
Einschreiben erhalten hast. Von nun an kannst du sie digital
empfangen und einsehen, indem du über SPID oder CIE oder direkt über
die IO-App auf Piattaforma Notifiche zugreifst.`;
const infoblock1_2 = `Außerdem kannst du dank der Integration mit pagoPA eventuell
angefallene Gebühren bezahlen, den Verlauf der erhaltenen Bescheide
einsehen und diese direkt online verwalten. Darüber hinaus benötigst
du nur eine Vollmacht, um auch die Bescheide deiner
Familienangehörigen zu verwalten.`;
const infoblock2_1 = `Bei der Versendung von rechtlicher Kommunikation gibt SEND immer den
digitalen Adressen der Empfänger den Vorrang. Du kannst jederzeit
mit SPID und CIE auf die Plattform zugreifen, um deine Präferenzen
zwischen PEC, App IO, E-Mail oder SMS anzugeben oder zu
aktualisieren. Wenn du keine Adresse angibst oder keinen Zugang zur
Plattform hast, erhältst du die Bescheide weiterhin per Einschreiben
in Papierform.`;
const infoblock3_1 =
  "Derzeit wird SEND mit einer kleinen Anzahl von Verwaltungen getestet.";
const infoblock3_2 =
  "Nach und nach wird die Plattform von den öffentlichen Verwaltungen übernommen und für die Übermittlung von Bescheiden an alle Bürger genutzt.";
export const pfInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      title: "Verpasse keine Bescheide mehr",
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
          <Typography variant="body2" tabIndex={0} aria-label={infoblock2_1}>
            {infoblock2_1}
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
          <Typography variant="body2" tabIndex={0} aria-label={infoblock3_1}>
            {infoblock3_1}
          </Typography>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock3_2}>
            {infoblock3_2}
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
const showcase1_1 =
  "Digitale Zustellung von Bescheiden führt zu niedrigeren Service- und Versandkosten";
const showcase1_2 =
  "Kein Warten oder Anstehen mehr bei der Abholung von Papiermitteilungen";
const showcase1_3 =
  "Du trägst zur Verringerung des Papierverbrauchs und der Transportemissionen bei";
const showcase1_4 =
  "Du musst keine gedruckten Dokumente mehr aufbewahren, da du diese digital herunterladen und archivieren kannst";
const showcase2_1 = `Wenn du eine PEC-Adresse hast, werden dir die Bescheide rechtmäßig
zugestellt, und es gibt keine Einschreiben in Papierform mehr. Die
dir zugesandte Empfangsbestätigung enthält den Link, über den du
auf den Inhalt auf SEND zugreifen kannst.`;
const showcase2_2 = `Wenn du den Dienst „Digitale Bescheide“ von SEND aktivierst,
kannst du rechtliche Kommunikation direkt in der App erhalten und verwalten. Wenn du
keine PEC hast und die Nachricht sofort liest, erhältst du kein
Einschreiben in Papierform und der Bescheid wird rechtmäßig
zugestellt.`;
const showcase2_3 = `Außerdem kannst du wählen, ob du eine Zahlungsaufforderung an
deine E-Mail-Adresse oder per SMS erhalten möchtest. Wenn du keine
PEC hast und über den entsprechenden Link auf die Plattform
zugreifst, erhältst du kein Einschreiben in Papierform und der
Bescheid gilt als rechtmäßig zugestellt.`;

export const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Was digitale Bescheide dir bieten",
      items: [
        {
          icon: <PiggyIcon />,
          title: "Bequemlichkeit",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_1}>
              {showcase1_1}
            </Typography>
          ),
        },
        {
          icon: <HourglassIcon />,
          title: "Zeit",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_2}>
              {showcase1_2}
            </Typography>
          ),
        },
        {
          icon: <EcologyIcon />,
          title: "Nachhaltigkeit",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_3}>
              {showcase1_3}
            </Typography>
          ),
        },
        {
          icon: <CloudIcon />,
          title: "Platz",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_4}>
              {showcase1_4}
            </Typography>
          ),
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
            <Typography variant="body2" tabIndex={0} aria-label={showcase2_1}>
              {showcase2_1}
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
            <Typography variant="body2" tabIndex={0} aria-label={showcase2_2}>
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
            <Typography variant="body2" tabIndex={0} aria-label={showcase2_3}>
              {showcase2_3}
            </Typography>
          ),
        },
      ],
    },
  },
];
/* ************************************** */

/** Walkthrough mocked data */
const walkthrough1 = `Bei jedem Bescheid prüft die Plattform, ob es eine dir zugeordnete oder von dir angegebene PEC für 
den Versand der Empfangsbestätigung gibt. Sie sendet dann eine Zahlungsaufforderung an deine anderen 
digitalen Kontakte (IO-App, E-Mail und SMS). Wenn du keine digitalen Kontaktdaten angegeben hast und 
keinen Zugang zur Plattform hast, erhältst du ein Einschreiben in Papierform.`;
const walkthrough2 = `Von der empfangenen Nachricht aus kannst du auf die Plattform zugreifen, um den Bescheid zu lesen und 
die entsprechenden Anhänge herunterzuladen. Wenn du den Dienst auf IO aktivierst, kannst du den Inhalt 
direkt in der App einsehen: Dies entspricht der Unterzeichnung des Rückscheins eines herkömmlichen 
Einschreibens.`;
const walkthrough3 = `Wenn ein Betrag zu zahlen ist, kannst du dank der Integration mit pagoPA gleichzeitig online von der 
Plattform oder direkt von IO aus fortfahren. Wenn du es vorziehst, einen Schalter aufzusuchen, musst 
du den mit dem Bescheid erhaltenen Zahlschein mitnehmen.`;
const walkthrough4 = `Wenn du möchtest, kannst du andere natürliche oder juristische Personen damit beauftragen, deine 
Bescheide online zu empfangen oder die beigefügten Dokumente in Papierform bei jeder Poststelle 
abzuholen.`;

export const pfWalkthrough: WalkthroughProps = {
  title: "Wie funktioniert das?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Du erhältst den Bescheid",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough1}>
          {walkthrough1}
        </Typography>
      ),
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Lies den Inhalt",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough2}>
          {walkthrough2}
        </Typography>
      ),
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Begleiche die Zahlung",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough3}>
          {walkthrough3}
        </Typography>
      ),
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "Selber handeln oder andere handeln lassen",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough4}>
          {walkthrough4}
        </Typography>
      ),
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
