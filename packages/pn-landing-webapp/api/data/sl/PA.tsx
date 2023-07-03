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
const heroSubtitle = `Od danes pa tudi storjeno. SEND digitalizira upravljanje komunikacij s pravno vrednostjo in 
poenostavlja postopek za vse: pošiljatelje in prejemnike.`;

export const paHero: HeroProps = {
  type: "image",
  title: "Pošiljanje obvestil? Lažje rečeno kot storjeno.",
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
const infoblock1_1 = `SEND digitalizira in poenostavlja upravljanje komunikacij s pravno
vrednostjo. Vse, kar morajo storiti ustanove pošiljateljice, je
vložiti dokument za vročitev: platforma pa bo poskrbela za
pošiljanje, v digitalni ali analogni obliki.`;
const infoblock1_2 = `S platformo SEND za obveščanje se zmanjša negotovost glede
dosegljivosti prejemnikov, zmanjšajo pa se tudi čas in stroški
upravljanja.`;
const infoblock2_1 = `SEND se integrira s protokolom ustanov in ponuja API za samodejno
pošiljanje obvestil, kot tudi možnost ročnega pošiljanja. Ko so
dokumenti in plačilni obrazci naloženi, platforma ustvari IUN,
edinstveno identifikacijsko kodo obvestila.`;
const infoblock2_2 = `Nato v svojih arhivih in javnih registrih poišče naslov
certificirane elektronske pošte (PEC), ki je povezan s prejemnikom,
in pošlje obvestilo. Nato pošlje še vljudnostno obvestilo na druge
podatke za stik s prejemnikom v digitalni obliki (aplikacija IO,
e-pošta in SMS).`;
const infoblock2_3 = `Če prejemnik ni navedel nobenega podatka za stik v digitalni obliki
in nima dostopa do platforme, slednja poišče njegov fizični naslov,
na kateri pošlje priporočeno pismo v papirni obliki.`;
const infoblock3_1 = `Prejemnik dostopa do platforme z uporabo digitalnih identitet SPID
ali CIE, na njej pa si lahko ogleda in prenese vročeni dokument.
Zahvaljujoč integraciji s platformo pagoPA lahko istočasno tudi
plača dolgovani znesek. Če je storitev aktiviral v aplikaciji IO,
lahko vse to stori neposredno v aplikaciji.`;
const infoblock3_2 = `Tako kot ustanova pošiljateljica ima tudi prejemnik dostop do
kronološkega pregleda stanja obvestila in do potrdil, izvršljivih
zoper tretje osebe, ki to dokazujejo.`;
const infoblock4_1 = `Trenutno lahko institucije začnejo tehnične dejavnosti, potrebne za integracijo v SEND.`;
const infoblock4_2 = "V tem času pa si lahko ustanove preberejo";
const infoblock4_3 = `seznam tehnoloških partnerjev in posrednikov, ki izvajajo dejavnosti integracije platforme in ki jih je
mogoče uporabiti za podporo pri upravljanju tehničnih vidikov.`;

export const paInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      // overline: "Rappresenti un ente?",
      title: "Enostavnejši način za upravljanje obvestil",
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
      title: "Naloži dokument. Nato pa lahko nanj pozabiš",
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
      title: "Kaj pa prejemnik?",
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
      title: "Zaženite integracijo",
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
                aria-label="operativni priročnik (posodobljen dne 20. 11. 2022)"
              >
                <Link
                  href={MANUALE_URL}
                  tabIndex={0}
                  aria-label="operativni priročnik"
                >
                  operativni priročnik
                </Link>{" "}
                (posodobljen dne 20. 11. 2022),
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml"
                  tabIndex={0}
                  aria-label="API-je b2b za javno upravo"
                >
                  API-je b2b za javno upravo
                </Link>
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link
                  href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml"
                  tabIndex={0}
                  aria-label="API-je b2b za potek postopka obveščanja"
                >
                  API-je b2b za potek postopka obveščanja
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
                  aria-label="seznam tehnoloških partnerjev in posrednikov"
                >
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
const showcases1 =
  "Obvestila se pošiljajo, upravljajo in spremljajo prek enega samega kanala, do katerega lahko dostopa več oseb iz iste ustanove";
const showcases2 =
  "Obvestila lahko naložiš prek API-ja ali ročno: ko so dokumenti vloženi, platforma poskrbi za pošiljanje in spremlja spremembe stanja";
const showcases3 =
  "Če ima prejemnik digitalni naslov, se čas dostave bistveno skrajša";
const showcases4 =
  "Postopek obveščanja je urejen, kar zagotavlja večjo zanesljivost dostave prejemniku";

export const paShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "En sam način, ki ti omogoči, da privarčuješ na mnogo načinov",
      items: [
        {
          icon: <PeopleIcon />,
          title: "Edinstveno",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcases1}>
              {showcases1}
            </Typography>
          ),
        },
        {
          icon: <FireworksIcon />,
          title: "Enostavno",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcases2}>
              {showcases2}
            </Typography>
          ),
        },
        {
          icon: <EasyIcon />,
          title: "Neposredno",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcases3}>
              {showcases3}
            </Typography>
          ),
        },
        {
          icon: <CheckmarkIcon />,
          title: "Zanesljivo",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcases4}>
              {showcases4}
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
  "Z uporabo ključev API ali ročno ustanova ustvari zahtevo za obvestilo in naloži priloge.";
const walkthrough2 = `SEND preveri popolnost in pravilnost informacij. Ob vsaki spremembi stanja obvestila
se vedno ustvari tudi ustrezno potrdilo, izvršljivo zoper tretje osebe.`;
const walkthrough3 = `Platforma sporoči prejemniku prisotnost obvestila prek različnih možnih kanalov: PEC, aplikacija IO,
e-pošta, SMS. Druga možnost je, da poišče fizični naslov in pošlje priporočeno pismo v papirni obliki.`;
const walkthrough4 = `Prejemnik dostopi do platforme. Tam lahko prenese vročene dokumente in hkrati plača dolgovani znesek,
zahvaljujoč integraciji s platformo pagoPA. Če ga prejme prek aplikacije IO, lahko vse to stori neposredno v aplikaciji.`;

export const paWalkthrough: WalkthroughProps = {
  title: "Kako deluje?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "Ustanova ustvari zahtevo za obvestilo",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough1}>
          {walkthrough1}
        </Typography>
      ),
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "Platforma to prevzame",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough2}>
          {walkthrough2}
        </Typography>
      ),
    },
    {
      icon: <SendIcon color="primary" />,
      title: "Obvestilo je nato poslano",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough3}>
          {walkthrough3}
        </Typography>
      ),
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "Prejemnik ga prejme",
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
  "Upravljaj obvestila svojega podjetja na enem mestu, skupaj s sodelavci.";
const horizontalNav2 =
  "Aktiviraj storitev v aplikaciji IO: če se prijaviš v XYZ v roku 7 dni od prejema sporočila v aplikaciji, ne boš prejel obvestila v papirni obliki ter tako prihranil čas in denar.";
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
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={horizontalNav1}>
          {horizontalNav1}
        </Typography>
      ),
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
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={horizontalNav2}>
          {horizontalNav2}
        </Typography>
      ),
      cta: {
        label: "Odkrij prednosti za državljane",
        title: "CTA1",
        href: "#",
      },
    },
  ],
};
