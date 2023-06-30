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
  title: "Pošiljanje obvestil? Lažje rečeno kot storjeno.",
  subtitle: `Od danes pa tudi storjeno. SEND digitalizira upravljanje komunikacij s pravno vrednostjo in 
      poenostavlja postopek za vse: pošiljatelje in prejemnike.`,
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
      title: "Enostavnejši način za upravljanje obvestil",
      content: (
        <>
          <Typography variant="body2">
            SEND digitalizira in poenostavlja upravljanje komunikacij s pravno
            vrednostjo. Vse, kar morajo storiti ustanove pošiljateljice, je
            vložiti dokument za vročitev: platforma pa bo poskrbela za
            pošiljanje, v digitalni ali analogni obliki.
          </Typography>
          <Typography variant="body2">
            S platformo SEND za obveščanje se zmanjša negotovost glede
            dosegljivosti prejemnikov, zmanjšajo pa se tudi čas in stroški
            upravljanja.
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
            SEND se integrira s protokolom ustanov in ponuja API za samodejno
            pošiljanje obvestil, kot tudi možnost ročnega pošiljanja. Ko so
            dokumenti in plačilni obrazci naloženi, platforma ustvari IUN,
            edinstveno identifikacijsko kodo obvestila.
          </Typography>
          <Typography variant="body2">
            Nato v svojih arhivih in javnih registrih poišče naslov
            certificirane elektronske pošte (PEC), ki je povezan s prejemnikom,
            in pošlje obvestilo. Nato pošlje še vljudnostno obvestilo na druge
            podatke za stik s prejemnikom v digitalni obliki (aplikacija IO,
            e-pošta in SMS).
          </Typography>
          <Typography variant="body2">
            Če prejemnik ni navedel nobenega podatka za stik v digitalni obliki
            in nima dostopa do platforme, slednja poišče njegov fizični naslov,
            na kateri pošlje priporočeno pismo v papirni obliki.
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
            Prejemnik dostopa do platforme z uporabo digitalnih identitet SPID
            ali CIE, na njej pa si lahko ogleda in prenese vročeni dokument.
            Zahvaljujoč integraciji s platformo pagoPA lahko istočasno tudi
            plača dolgovani znesek. Če je storitev aktiviral v aplikaciji IO,
            lahko vse to stori neposredno v aplikaciji.
          </Typography>
          <Typography variant="body2">
            Tako kot ustanova pošiljateljica ima tudi prejemnik dostop do
            kronološkega pregleda stanja obvestila in do potrdil, izvršljivih
            zoper tretje osebe, ki to dokazujejo.
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
      title: "Zaženite integracijo",
      content: (
        <>
          <Typography variant="body2">
            Trenutno lahko institucije začnejo tehnične dejavnosti, potrebne za
            integracijo v SEND.
          </Typography>

          <Typography variant="body2">
            V tem času pa si lahko ustanove preberejo
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={MANUALE_URL}>operativni priročnik</Link>{" "}
                (posodobljen dne 20. 11. 2022),{" "}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
                  API-je b2b za javno upravo
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
                  API-je b2b za potek postopka obveščanja
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={PARTNER_AND_INTERMEDIARIES_PATH}>
                  seznam tehnoloških partnerjev in posrednikov
                </Link>
                , ki izvajajo dejavnosti integracije platforme in ki jih je
                mogoče uporabiti za podporo pri upravljanju tehničnih vidikov.
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
/* ************************************** */

/** Walkthrough mocked data */
export const paWalkthrough: WalkthroughProps = {
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
      subtitle: `SEND preveri popolnost in pravilnost informacij. Ob vsaki spremembi stanja obvestila
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
