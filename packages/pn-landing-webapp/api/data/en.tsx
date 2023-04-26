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
  pf: "The general public",
  pa: "Entities",
  faq: 'FAQ',
};

// eslint-disable-next-line no-extra-boolean-cast
const heroCta = !!PN_PF_URL
  ? {
    label: "Read your notifications",
    title: "Read your notifications",
    onClick: onReadClick,
  }
  : undefined;

/** Hero mocked data */
const paHero: HeroProps = {
  type: "image",
  title: "Send notifications? Easily said.",
  subtitle: `And, from today, easily done. Piattaforma Notifiche digitises the management of legal communications, 
    simplifying the process for everyone: those who send them, and those who receive them.`,
  inverse: false,
  image: `${IMAGES_PATH}/pa-hero-foreground.png`,
  altText: "",
  background: `${IMAGES_PATH}/hero-background.png`,
};

const pfHero: HeroProps = {
  type: "image",
  title: "Notifications? At your fingertips.",
  subtitle: `With Piattaforma Notifiche, you can instantly receive legal communications from an organisation: you 
    can view, manage and pay for registered letters that are usually sent to you on paper directly online or through 
    the app.`,
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
      title: "An easier way to manage notifications",
      content: (
        <>
          <Typography variant="body2">
            Piattaforma Notifiche digitises and simplifies the management of legal communications.
            The sending organisations only have to deposit the deed to be delivered: the platform
            will take care of the sending, either by digital or analogue means.
          </Typography>
          <Typography variant="body2">
            With Piattaforma Notifiche, the uncertainty of recipient availability is minimised,
            and management time and costs are reduced.
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
      title: "Upload the deed. Then forget about it",
      content: (
        <>
          <Typography variant="body2">
            Piattaforma Notifiche integrates with the institutions’ protocol and offers both APIs
            for sending notifications automatically and the possibility of making manual submissions.
            Once the deeds and payment forms have been uploaded, the platform generates the IUN, a
            unique code identifying the notification.
          </Typography>
          <Typography variant="body2">
            Subsequently, it searches its archives and public registers for a PEC traceable to the
            recipient and sends the notification. It then sends a courtesy notice to the recipient’s
            other digital contacts (IO app, email and SMS).
          </Typography>
          <Typography variant="body2">
            If the recipient has not indicated a digital address and does not have access to the
            platform, the platform proceeds with the search for a physical address, and then with
            sending by registered mail.
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
      title: "What about the recipient?",
      content: (
        <>
          <Typography variant="body2">
            The recipient accesses the platform via SPID or CIE, where they can view and download
            the deed notified. Thanks to the integration with pagoPA, they can also pay what they
            owe at the same time. If they have activated the service on the IO app, they can do
            everything directly in the app.
          </Typography>
          <Typography variant="body2">
            Like the organisation, the recipient also has access to the history of the status of
            the notification and the certificates enforceable against third parties that prove it.
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
      title: "Start the integration",
      content: (
        <>
          <Typography variant="body2">
            Currently, organizations can start the technical activities necessary for integration into Piattaforma Notifiche.
          </Typography>

          <Typography variant="body2">
            In the meantime, organisations can consult:{" "}
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href={MANUALE_URL}>
                  the operations manual
                </Link>
                {" "}(updated 20/11/2022),
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
                  the b2b API for public administrations
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
                  the b2b API for the advancement of notifications
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                <Link href={PARTNER_AND_INTERMEDIARIES_PATH}>
                  the list of technology Partners and Intermediaries
                </Link>
                {" "}who are implementing the activities of integration to the platform and which can be used for support in the management of the technical aspects
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
      title: "Never miss a notification again",
      content: (
        <>
          <Typography variant="body2">
            Notifications are communications with legal value issued officially by an administration, such
            as fines, tax assessment notices, outcomes of administrative procedures initiated with public
            administrations or refunds, which until now, you have always received by registered mail. From
            now on, you can receive and consult them digitally by accessing Piattaforma Notifiche via SPID
            or CIE or directly on the IO app.
          </Typography>
          <Typography variant="body2">
            You can also pay any fees thanks to the integration with pagoPA, view the history of received
            notifications and manage them directly online. In addition, you only need a proxy to handle
            your family members’ registered mail as well.
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
      title: "You choose how to receive notifications",
      content: (
        <>
          <Typography variant="body2">
            To send legal communications, Piattaforma Notifiche always gives priority to the digital
            addresses of the recipient. At any time, you can access the platform with SPID and CIE to
            indicate or update your preferences between PEC, IO app, email or SMS. If you do not indicate
            any address or do not have access to the platform, you will continue to receive notifications
            by registered mail.
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
      title: "The future of legal communications",
      content: (
        <>
          <Typography variant="body2">
            Currently, Piattaforma Notifiche is being tested with a small number of administrations.
          </Typography>
          <Typography variant="body2">
            Progressively, the platform will be adopted by public administrations and used to send
            notifications to all citizens.
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
      title: "One way to save in many",
      items: [
        {
          icon: <PeopleIcon />,
          title: "Unique ways",
          subtitle:
            "Notifications are sent, managed and monitored through a single channel, accessible by several representatives of the same organisation",
        },
        {
          icon: <FireworksIcon />,
          title: "Simple",
          subtitle:
            "Notifications can be uploaded via API or manually: once the documents have been deposited, the platform takes care of sending them and keeps track of status changes",
        },
        {
          icon: <EasyIcon />,
          title: "Immediate",
          subtitle:
            "If the recipient has a digital address, mailing times are considerably reduced",
        },
        {
          icon: <CheckmarkIcon />,
          title: "Certain",
          subtitle:
            "The notification process is regulated and there is greater certainty of delivery to the recipient",
        },
      ],
    },
  },
];

const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "What digital notifications offer you",
      items: [
        {
          icon: <PiggyIcon />,
          title: "Convenience",
          subtitle:
            "Digital delivery of notifications leads to lower service and delivery costs",
        },
        {
          icon: <HourglassIcon />,
          title: "Time",
          subtitle:
            "No more waiting or queuing to collect paper communications",
        },
        {
          icon: <EcologyIcon />,
          title: "Sustainability",
          subtitle:
            "Help reduce paper consumption and transport emissions",
        },
        {
          icon: <CloudIcon />,
          title: "Space",
          subtitle:
            "You no longer have to keep printed documents, thanks to the option to download and store deeds digitally",
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
              If you have a PEC address, notifications will be legally delivered to you, with no more
              registered paper mail. The acknowledgement of receipt that will be sent to you contains
              the link to access the content on Piattaforma Notifiche.
            </Typography>
          ),
        },
        {
          /**
           * Waiting for IOIcon
           */
          // icon: <IOIcon />,
          icon: <img src={`${IMAGES_PATH}/IOIcon.svg`} />,
          title: "IO app",
          subtitle: (
            <Typography variant="body2">
              If you activate the &quot;Digital Notifications&quot; service of Piattaforma Notifiche, you can
              receive and manage legal communications <strong>directly in the app</strong>. If you
              do not have a PEC and read the message immediately, you will not receive the registered
              letter and the notification will be legally delivered.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "Email or SMS",
          subtitle: (
            <Typography variant="body2">
              In addition, you can also choose to receive a courtesy notification at your email address
              or by SMS. If you do not have a PEC and access the platform from the designated link, you
              will not receive the registered letter and the notification will be legally delivered.
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
  title: "How does it work?",
  items: [
    {
      icon: <UploadIcon color="primary" />,
      title: "The organisation creates the notification request",
      subtitle:
        "Using API keys or manually, the organisation creates the notification request and uploads the attachments.",
    },
    {
      icon: <SyncIcon color="primary" />,
      title: "The platform takes care of it",
      subtitle: `Piattaforma Notifiche verifies the completeness and correctness of the information. Each time there is 
        a status change, the corresponding certificate enforceable against third parties is always generated.`,
    },
    {
      icon: <SendIcon color="primary" />,
      title: "The notification is sent",
      subtitle: `The platform notifies the recipient of the presence of a notification through several possible channels: 
        PEC, IO app, email, or SMS. Alternatively, it finds a physical address and sends a registered letter.`,
    },
    {
      icon: <DeliverIcon color="primary" />,
      title: "The recipient receives it",
      subtitle: `The recipient accesses the platform. There, they can download the notified documents and simultaneously 
        pay what is due, thanks to the integration with pagoPA. If they receive it via IO, they can do everything directly 
        in the app.`,
    },
  ],
};

const pfWalkthrough: WalkthroughProps = {
  title: "How does it work?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Receive the notification",
      subtitle: `
        For each notification, the platform checks whether there is a PEC associated with you or indicated by you for 
        sending the acknowledgement of receipt. It then sends a courtesy notice to your other digital contacts (IO app, 
          email and SMS). If you have not provided a digital address and do not have access to the platform, you will 
          receive a registered letter in paper form.
        `,
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Read the contents",
      subtitle: `
        From the message you receive, you can access the platform to read the notification and download its attachments. 
        If you activate the service on IO, you can view the content directly in the app: this is equivalent to signing 
        the return receipt of a traditional registered letter.
      `,
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Paying expenses",
      subtitle: `
        If there is an amount to be paid, thanks to the integration with pagoPA, you can proceed simultaneously online 
        from the platform or directly from IO. If you prefer to go to a counter, you will need to have the payment form 
        with you.
      `,
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "You can delegate or be delegated",
      subtitle: `
      If you wish, you can delegate other persons, natural or legal, to receive your notifications online or to collect 
      the attached documents in paper form at any Post Office.
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
      title: "Do you represent a company?",
      subtitle:
        "Manage your company's notifications in one place, in collaboration with colleagues.",
      cta: {
        label: "Discover the benefits for businesses",
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
      title: "Are you a citizen?",
      subtitle:
        "Activate the service on the IO app: so if you access XYZ within 7 days of receiving the message in the app, you will not receive the paper copy, and you will save time and money.",
      cta: {
        label: "Discover the benefits for citizens",
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
  ariaLabel: "Link: go to the website of PagoPA S.p.A."
};

const assistanceLink = {
  label: "Support",
  ariaLabel: "Support",
  href: `mailto:${PAGOPA_HELP_EMAIL}`,
};

const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — joint stock company with sole shareholder -
    share capital of 1,000,000 euros fully paid up - registered office in Rome,
    Piazza Colonna 370
    <br />
    CAP 00187 - Reg. no. in the Rome Business Register, Tax code and VAT number 15376371009
  </>
);

const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "About us",
        href: `${pagoPALink.href}societa/chi-siamo`,
        ariaLabel: "Go to link: About us",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}opportunita/pnrr/progetti`,
        ariaLabel: "Go to link: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}media`,
        ariaLabel: "Go to link: Media",
        linkType: "external",
      },
      {
        label: "Work with us",
        href: `${pagoPALink.href}lavora-con-noi`,
        ariaLabel: "Go to link: Work with us",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Resources",
    links: [
      {
        label: "Privacy Policy",
        href: `/informativa-privacy/`,
        ariaLabel: "Go to link: Privacy Policy",
        linkType: "internal",
      },
      {
        label: "Certifications",
        href: "https://www.pagopa.it/static/10ffe3b3d90ecad83d1bbebea0512188/Certificato-SGSI-PagoPA-2020.pdf",
        ariaLabel: "Go to link: Certifications",
        linkType: "internal",
      },
      {
        label: "Information security",
        href: "https://www.pagopa.it/static/781646994f1f8ddad2d95af3aaedac3d/Sicurezza-delle-informazioni_PagoPA-S.p.A..pdf",
        ariaLabel: "Go to link: Information security",
        linkType: "internal",
      },
      {
        label: "Right to protection of personal data",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel: "Go to link: Right to protection of personal data",
        linkType: "internal",
      },
      // {
      //   label: "Cookie Preferences",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Go to link: Cookie Preferences",
      //   linkType: "internal",
      // },
      {
        label: "Transparent company",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Go to link: Transparent company",
        linkType: "internal",
      },
      {
        label: "Responsible Disclosure Policy",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Go to link: Responsible Disclosure Policy",
        linkType: "internal",
      },
      {
        label: "Model 321",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Go to link: Model 321",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Follow us on",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel: "Link: go to the website LinkedIn of PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel: "Link: go to the website Twitter of PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel: "Link: go to the website Instagram of PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel: "Link: go to the website Medium of PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Accessibility",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Go to link: Accessibility",
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
export const enAppData: IAppData = {
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
