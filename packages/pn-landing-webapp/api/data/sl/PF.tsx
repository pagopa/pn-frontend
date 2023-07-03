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
      label: "Preberi svoja obvestila",
      title: "Preberi svoja obvestila",
      onClick: onReadClick,
    }
  : undefined;

/** Hero mocked data */
const heroSubtitle = `S platformo SEND lahko takoj prejmeš sporočila s pravno vrednostjo, ki jih pošlje določena 
ustanova: lahko si ogledaš, upravljaš in plačaš neposredno na spletu ali v aplikaciji. In to velja za vsa priporočena 
pisma, ki jih običajno prejmeš v papirni obliki.`;

export const pfHero: HeroProps = {
  type: "image",
  title: "Kaj pa obvestila? Imaš jih na dosegu roke.",
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
const infoblock1_1 = `Obvestila so sporočila s pravno vrednostjo, ki jih uradno izda
upravni organ, kot so globe, obvestila o odmeri davka, rezultati
upravnih postopkov, sproženih pri javnih upravah ali povračila, ki
si jih do sedaj vedno prejel s priporočeno pošto. Od danes jih lahko
prejmeš in si jih ogledaš v digitalni obliki, in sicer z dostopom do
platforme SEND z uporabo digitalnih identitet SPID ali CIE ali
neposredno v aplikaciji IO.`;
const infoblock1_2 = `Prav tako lahko plačaš morebitne stroške zahvaljujoč integraciji s
platformo pagoPA, si ogledaš zgodovino prejetih obvestil in jih
upravljaš neposredno na spletu. Poleg tega je vse, kar potrebuješ za
upravljanje priporočenih sporočil za svoje družinske člane, le
njihovo pooblastilo.`;
const infoblock2 = `Za pošiljanje sporočil s pravno vrednostjo SEND da vedno prednost
digitalnim podatkom za stik prejemnika. Z uporabo digitalnih
identitet SPID ali CIE lahko kadarkoli dostopaš do platforme ter
posodobiš svoje nastavitve z izbiro med PEC, aplikacijo IO, e-pošto
ali SMS. Če ne navedeš nobenih podatkov za stik ali nimaš dostopa do
platforme, boš obvestila še naprej prejemal s priporočeno pošto v
papirni obliki.`;
const infoblock3_1 =
  "Trenutno je SEND v fazi preizkusa, v katerem sodelujejo le nekatere upravne ustanove.";
const infoblock3_2 =
  "Postopoma bodo javne uprave sprejele platformo in jo uporabljale za pošiljanje obvestil vsem državljanom.";

export const pfInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      title: "Nikoli več ne spreglej nobenega obvestila",
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
      title: "Izbira načina prejemanja obvestil je tvoja",
      content: (
        <>
          <Typography variant="body2" tabIndex={0} aria-label={infoblock2}>
            {infoblock2}
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
      title: "Prihodnost sporočil s pravno vrednostjo",
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
  "Dostava obvestil v digitalni obliki omogoča nižje stroške obveščanja in pošiljanja";
const showcase1_2 = "Nič več čakanja v vrsti za prevzem pisem v papirni obliki";
const showcase1_3 =
  "Pomagaj zmanjšati porabo papirja in emisije, ki jih povzroča promet";
const showcase1_4 =
  "Z možnostjo digitalnega prenosa in arhiviranja dokumentov v digitalni obliki ti ni treba več hraniti natisnjenih dokumentov";
const showcase2_1 = `Če imaš naslov PEC, bodo obvestila dostavljena zakonito, brez
dodatnih priporočenih pisem v papirni obliki. Obvestilo o prejemu,
ki bo poslano, vsebuje povezavo za dostop do vsebine na platformi
SEND.`;
const showcase2_2 = `Če aktiviraš storitev »Digitalna obvestila« na platformi SEND,
lahko prejmeš in upravljaš sporočila s pravno vrednostjo neposredno v aplikaciji. Če nimaš naslova PEC in
takoj prebereš sporočilo, ne boš prejel priporočenega pisma v
papirni obliki, obvestilo pa bo zakonito vročeno.`;
const showcase2_3 = `Poleg tega se lahko odločiš tudi za prejemanje vljudnostnega
obvestila na svoj e-naslov ali prek sporočila SMS. Če nimaš
naslova PEC in dostopaš do platforme prek ustrezne povezave, ne
boš prejel priporočenega pisma v papirni obliki, obvestilo pa bo
zakonito vročeno.`;

export const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Kaj ti nudijo digitalna obvestila",
      items: [
        {
          icon: <PiggyIcon />,
          title: "Udobje",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_1}>
              {showcase1_1}
            </Typography>
          ),
        },
        {
          icon: <HourglassIcon />,
          title: "Čas",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_2}>
              {showcase1_2}
            </Typography>
          ),
        },
        {
          icon: <EcologyIcon />,
          title: "Trajnost",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_3}>
              {showcase1_3}
            </Typography>
          ),
        },
        {
          icon: <CloudIcon />,
          title: "Prostor",
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
          title: "PEC",
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
          title: "Aplikacija IO",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase2_2}>
              Če aktiviraš storitev »Digitalna obvestila« na platformi SEND,
              lahko prejmeš in upravljaš sporočila s pravno vrednostjo{" "}
              <strong>neposredno v aplikaciji.</strong> Če nimaš naslova PEC in
              takoj prebereš sporočilo, ne boš prejel priporočenega pisma v
              papirni obliki, obvestilo pa bo zakonito vročeno.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "E-pošta ali SMS",
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
const walkthrough1 = `Za vsako obvestilo platforma preveri, ali obstaja naslov PEC, ki je povezan s teboj oziroma si ga
ti navedel za pošiljanje obvestila o opravljenem prejemu. Nato pošlje še vljudnostno obvestilo na
tvoje druge podatke za stik v digitalni obliki (aplikacija IO, e-pošta in SMS). Če ne navedeš
nobenih digitalnih podatkov za stik in nimaš dostopa do platforme, boš prejel priporočeno pismo v
papirni obliki.`;
const walkthrough2 = `Iz prejetega sporočila lahko dostopaš do platforme in prebereš obvestilo ter preneseš njegove priloge.
Če aktiviraš storitev v aplikaciji IO, si lahko ogledaš vsebino neposredno v aplikaciji: to je
enakovredno podpisu povratnice običajnega priporočenega pisma.`;
const walkthrough3 = `Če moraš plačati določen znesek, lahko zahvaljujoč integraciji s platformo pagoPA to storiš neposredno
na spletu s platforme ali neposredno v aplikaciji IO. Če pa se raje odpraviš k okencu, moraš imeti pri
sebi prejeti plačilni obrazec, ki ga prejmeš skupaj z obvestilom.`;
const walkthrough4 = `Če želiš, lahko druge osebe, fizične ali pravne, pooblastiš za prejemanje tvojih obvestil preko spleta
ali za prevzem priloženih dokumentov v papirni obliki na kateremkoli poštnem uradu.`;

export const pfWalkthrough: WalkthroughProps = {
  title: "Kako deluje?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Prejmi obvestilo",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough1}>
          {walkthrough1}
        </Typography>
      ),
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Preberi vsebino",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough2}>
          {walkthrough2}
        </Typography>
      ),
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Plačaj stroške",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough3}>
          {walkthrough3}
        </Typography>
      ),
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "Lahko pooblastiš ali postaneš pooblaščenec",
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
