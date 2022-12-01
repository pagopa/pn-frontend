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
  label: "Podpora strankam",
  ariaLabel: "Podpora strankam",
  href: `mailto:${PAGOPA_HELP_EMAIL}`,
};

const onReadClick = () => {
  window.open(PN_URL, "_blank");
};

// eslint-disable-next-line no-extra-boolean-cast
const heroCta = !!PN_URL
  ? {
      label: "Preberi svoja obvestila",
      title: "Preberi svoja obvestila",
      onClick: onReadClick,
    }
  : undefined;

/** Hero mocked data */
const paHero: HeroProps = {
  type: "image",
  title: "Pošiljanje obvestil? Lažje rečeno kot storjeno.",
  subtitle: `Od danes pa tudi storjeno. Piattaforma Notifiche digitalizira upravljanje komunikacij s pravno vrednostjo in 
    poenostavlja postopek za vse: pošiljatelje in prejemnike.`,
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
};

const pfHero: HeroProps = {
  type: "image",
  title: "Kaj pa obvestila? Imaš jih na dosegu roke.",
  subtitle: `S platformo Piattaforma Notifiche lahko takoj prejmeš sporočila s pravno vrednostjo, ki jih pošlje določena 
    ustanova: lahko si ogledaš, upravljaš in plačaš neposredno na spletu ali v aplikaciji. In to velja za vsa priporočena 
    pisma, ki jih običajno prejmeš v papirni obliki.`,
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
      title: "Enostavnejši način za upravljanje obvestil",
      content: (
        <>
          <Typography variant="body2">
            Piattaforma Notifiche digitalizira in poenostavlja upravljanje komunikacij s pravno vrednostjo. 
            Vse, kar morajo storiti ustanove pošiljateljice, je vložiti dokument za vročitev: platforma pa 
            bo poskrbela za pošiljanje, v digitalni ali analogni obliki.
          </Typography>
          <Typography variant="body2">
            S platformo Piattaforma Notifiche za obveščanje se zmanjša negotovost glede dosegljivosti 
            prejemnikov, zmanjšajo pa se tudi čas in stroški upravljanja.
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
      title: "Naloži dokument. Nato pa lahko nanj pozabiš",
      content: (
        <>
          <Typography variant="body2">
            Piattaforma Notifiche se integrira s protokolom ustanov in ponuja API za samodejno pošiljanje 
            obvestil, kot tudi možnost ročnega pošiljanja. Ko so dokumenti in plačilni obrazci naloženi, 
            platforma ustvari IUN, edinstveno identifikacijsko kodo obvestila.
          </Typography>
          <Typography variant="body2">
            Nato v svojih arhivih in javnih registrih poišče naslov certificirane elektronske pošte (PEC), 
            ki je povezan s prejemnikom, in pošlje obvestilo. Nato pošlje še vljudnostno obvestilo na druge 
            podatke za stik s prejemnikom v digitalni obliki (aplikacija IO, e-pošta in SMS).
          </Typography>
          <Typography variant="body2">
            Če prejemnik ni navedel nobenega podatka za stik v digitalni obliki in nima dostopa do platforme, 
            slednja poišče njegov fizični naslov, na kateri pošlje priporočeno pismo v papirni obliki.
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
      title: "Kaj pa prejemnik?",
      content: (
        <>
          <Typography variant="body2">
            Prejemnik dostopa do platforme z uporabo digitalnih identitet SPID ali CIE, na njej pa si lahko 
            ogleda in prenese vročeni dokument. Zahvaljujoč integraciji s platformo pagoPA lahko istočasno 
            tudi plača dolgovani znesek. Če je storitev aktiviral v aplikaciji IO, lahko vse to stori 
            neposredno v aplikaciji.
          </Typography>
          <Typography variant="body2">
            Tako kot ustanova pošiljateljica ima tudi prejemnik dostop do kronološkega pregleda stanja 
            obvestila in do potrdil, izvršljivih zoper tretje osebe, ki to dokazujejo.
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
      title: "Kmalu na voljo za ustanove",
      content: (
        <>
          <Typography variant="body2">
            Trenutno je Piattaforma Notifiche v fazi preizkusa, v katerem sodeluje le nekaj pilotnih ustanov.
          </Typography>
          <Typography variant="body2">
            Ko bo postala operativna, bo lahko tudi vaša ustanova zaprosila za članstvo in uvedla platformo 
            za digitalizacijo postopka obveščanja.
          </Typography>
          <Typography variant="body2">
            V tem času pa si lahko ustanove preberejo{" "}
            <Link href="https://www.pagopa.it/static/e190eb758489b75d4d81112a1357b5b2/Manuale-Operativo-Piattaforma-Notifiche.pdf">
              operativni priročnik
            </Link>
            {" "}(posodobljen dne 28. 6. 2022),{" "}
            <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
              API-je b2b za javno upravo
            </Link>
            {" "}in{" "}
            <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
              API-je b2b za potek postopka obveščanja
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
      title: "Nikoli več ne spreglej nobenega obvestila",
      content: (
        <>
          <Typography variant="body2">
            Obvestila so sporočila s pravno vrednostjo, ki jih uradno izda upravni organ, kot so globe, 
            obvestila o odmeri davka, rezultati upravnih postopkov, sproženih pri javnih upravah ali 
            povračila, ki si jih do sedaj vedno prejel s priporočeno pošto. Od danes jih lahko prejmeš 
            in si jih ogledaš v digitalni obliki, in sicer z dostopom do platforme Piattaforma Notifiche 
            z uporabo digitalnih identitet SPID ali CIE ali neposredno v aplikaciji IO.
          </Typography>
          <Typography variant="body2">
            Prav tako lahko plačaš morebitne stroške zahvaljujoč integraciji s platformo pagoPA, si 
            ogledaš zgodovino prejetih obvestil in jih upravljaš neposredno na spletu. Poleg tega je vse, 
            kar potrebuješ za upravljanje priporočenih sporočil za svoje družinske člane, le njihovo 
            pooblastilo.
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
          <Typography variant="body2">
            Za pošiljanje sporočil s pravno vrednostjo Piattaforma Notifiche da vedno prednost digitalnim 
            podatkom za stik prejemnika. Z uporabo digitalnih identitet SPID ali CIE lahko kadarkoli 
            dostopaš do platforme ter posodobiš svoje nastavitve z izbiro med PEC, aplikacijo IO, e-pošto 
            ali SMS. Če ne navedeš nobenih podatkov za stik ali nimaš dostopa do platforme, boš obvestila 
            še naprej prejemal s priporočeno pošto v papirni obliki.
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
          <Typography variant="body2">
            Trenutno je Piattaforma Notifiche v fazi preizkusa, v katerem sodelujejo le nekatere upravne ustanove.
          </Typography>
          <Typography variant="body2">
            Postopoma bodo javne uprave sprejele platformo in jo uporabljale za pošiljanje obvestil vsem državljanom.
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
      title: "En sam način, ki ti omogoči, da privarčuješ na mnogo načinov",
      items: [
        {
          icon: <PeopleIcon />,
          title: "Edinstveno",
          subtitle:
            "Obvestila se pošiljajo, upravljajo in spremljajo prek enega samega kanala, do katerega lahko dostopa več oseb iz iste ustanove",
        },
        {
          icon: <FireworksIcon />,
          title: "Enostavno",
          subtitle:
            "Obvestila lahko naložiš prek API-ja ali ročno: ko so dokumenti vloženi, platforma poskrbi za pošiljanje in spremlja spremembe stanja",
        },
        {
          icon: <EasyIcon />,
          title: "Neposredno",
          subtitle:
            "Če ima prejemnik digitalni naslov, se čas dostave bistveno skrajša",
        },
        {
          icon: <CheckmarkIcon />,
          title: "Zanesljivo",
          subtitle:
            "Postopek obveščanja je urejen, kar zagotavlja večjo zanesljivost dostave prejemniku",
        },
      ],
    },
  },
];

const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "Kaj ti nudijo digitalna obvestila",
      items: [
        {
          icon: <PiggyIcon />,
          title: "Udobje",
          subtitle:
            "Dostava obvestil v digitalni obliki omogoča nižje stroške obveščanja in pošiljanja",
        },
        {
          icon: <HourglassIcon />,
          title: "Čas",
          subtitle:
            "Nič več čakanja v vrsti za prevzem pisem v papirni obliki",
        },
        {
          icon: <EcologyIcon />,
          title: "Trajnost",
          subtitle:
            "Pomagaj zmanjšati porabo papirja in emisije, ki jih povzroča promet",
        },
        {
          icon: <CloudIcon />,
          title: "Prostor",
          subtitle:
            "Z možnostjo digitalnega prenosa in arhiviranja dokumentov v digitalni obliki ti ni treba več hraniti natisnjenih dokumentov",
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
              Če imaš naslov PEC, bodo obvestila dostavljena zakonito, brez dodatnih priporočenih 
              pisem v papirni obliki. Obvestilo o prejemu, ki bo poslano, vsebuje povezavo za dostop 
              do vsebine na platformi Piattaforma Notifiche.
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
            <Typography variant="body2">
              Če aktiviraš storitev »Digitalna obvestila« na platformi Piattaforma Notifiche, lahko 
              prejmeš in upravljaš sporočila s pravno vrednostjo <strong>neposredno v aplikaciji.</strong>{" "}
              Če nimaš naslova PEC in takoj prebereš sporočilo, ne boš prejel priporočenega pisma v 
              papirni obliki, obvestilo pa bo zakonito vročeno.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "E-pošta ali SMS",
          subtitle: (
            <Typography variant="body2">
              Poleg tega se lahko odločiš tudi za prejemanje vljudnostnega obvestila na svoj e-naslov 
              ali prek sporočila SMS. Če nimaš naslova PEC in dostopaš do platforme prek ustrezne povezave, 
              ne boš prejel priporočenega pisma v papirni obliki, obvestilo pa bo zakonito vročeno.
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
  title: "Kako deluje?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "Ustanova ustvari zahtevo za obvestilo",
      subtitle:
        "Z uporabo ključev API ali ročno ustanova ustvari zahtevo za obvestilo in naloži priloge.",
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "Platforma to prevzame",
      subtitle: `Piattaforma Notifiche preveri popolnost in pravilnost informacij. Ob vsaki spremembi stanja obvestila 
        se vedno ustvari tudi ustrezno potrdilo, izvršljivo zoper tretje osebe.`,
    },
    {
      icon: <SendIcon color="primary" />,
      title: "Obvestilo je nato poslano",
      subtitle: `Platforma sporoči prejemniku prisotnost obvestila prek različnih možnih kanalov: PEC, aplikacija IO, 
        e-pošta, SMS. Druga možnost je, da poišče fizični naslov in pošlje priporočeno pismo v papirni obliki.`,
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Prejemnik ga prejme",
      subtitle: `Prejemnik dostopi do platforme. Tam lahko prenese vročene dokumente in hkrati plača dolgovani znesek, 
        zahvaljujoč integraciji s platformo pagoPA. Če ga prejme prek aplikacije IO, lahko vse to stori neposredno v 
        aplikaciji.`,
    },
  ],
};

const pfWalkthrough: WalkthroughProps = {
  title: "Kako deluje?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Prejmi obvestilo",
      subtitle: `
        Za vsako obvestilo platforma preveri, ali obstaja naslov PEC, ki je povezan s teboj oziroma si ga 
        ti navedel za pošiljanje obvestila o opravljenem prejemu. Nato pošlje še vljudnostno obvestilo na 
        tvoje druge podatke za stik v digitalni obliki (aplikacija IO, e-pošta in SMS). Če ne navedeš 
        nobenih digitalnih podatkov za stik in nimaš dostopa do platforme, boš prejel priporočeno pismo v 
        papirni obliki.
      `,
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Preberi vsebino",
      subtitle: `
        Iz prejetega sporočila lahko dostopaš do platforme in prebereš obvestilo ter preneseš njegove priloge. 
        Če aktiviraš storitev v aplikaciji IO, si lahko ogledaš vsebino neposredno v aplikaciji: to je 
        enakovredno podpisu povratnice običajnega priporočenega pisma.
      `,
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Plačaj stroške",
      subtitle: `
        Če moraš plačati določen znesek, lahko zahvaljujoč integraciji s platformo pagoPA to storiš neposredno 
        na spletu s platforme ali neposredno v aplikaciji IO. Če pa se raje odpraviš k okencu, moraš imeti pri 
        sebi prejeti plačilni obrazec, ki ga prejmeš skupaj z obvestilom.
      `,
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "Lahko pooblastiš ali postaneš pooblaščenec",
      subtitle: `
        Če želiš, lahko druge osebe, fizične ali pravne, pooblastiš za prejemanje tvojih obvestil preko spleta 
        ali za prevzem priloženih dokumentov v papirni obliki na kateremkoli poštnem uradu.
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
      title: "Zastopaš podjetje?",
      subtitle:
        "Upravljaj obvestila svojega podjetja na enem mestu, skupaj s sodelavci.",
      cta: {
        label: "Odkrij prednosti za podjetja",
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
      title: "Si državljan ali državljanka?",
      subtitle:
        "Aktiviraj storitev v aplikaciji IO: če se prijaviš v XYZ v roku 7 dni od prejema sporočila v aplikaciji, ne boš prejel obvestila v papirni obliki ter tako prihranil čas in denar.",
      cta: {
        label: "Odkrij prednosti za državljane",
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
export const slAppData: IAppData = {
  common: {
    alert:
      "Platforma ne deluje. Trenutno poteka preizkus samo nekaterih funkcij, opisanih na tej strani, do katerih lahko dostopa izključno omejeno število uporabnikov, ki bodo prejemniki obvestil, ki jih pošiljajo ustanove, vključene v pilotni projekt.",
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
