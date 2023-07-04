import { Typography } from "@mui/material";
import { HeroProps, WalkthroughProps } from "@pagopa/mui-italia";
import { PN_PF_URL, IMAGES_PATH } from "@utils/constants";
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
      label: "Read your notifications",
      title: "Read your notifications",
      onClick: onReadClick,
    }
  : undefined;

/** Hero mocked data */
const heroSubtitle = `With SEND, you can instantly receive legal communications from an organisation: you 
can view, manage and pay for registered letters that are usually sent to you on paper directly online or through 
the app.`;

export const pfHero: HeroProps = {
  type: "image",
  title: "Notifications? At your fingertips.",
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
const infoblock1_1 = `Notifications are communications with legal value issued officially
by an administration, such as fines, tax assessment notices,
outcomes of administrative procedures initiated with public
administrations or refunds, which until now, you have always
received by registered mail. From now on, you can receive and
consult them digitally by accessing SEND via SPID or CIE or directly
on the IO app.`;
const infoblock1_2 = `You can also pay any fees thanks to the integration with pagoPA,
view the history of received notifications and manage them directly
online. In addition, you only need a proxy to handle your family
members’ registered mail as well.`;
const infoblock2 = `To send legal communications, SEND always gives priority to the
digital addresses of the recipient. At any time, you can access the
platform with SPID and CIE to indicate or update your preferences
between PEC, IO app, email or SMS. If you do not indicate any
address or do not have access to the platform, you will continue to
receive notifications by registered mail.`;
const infoblock3_1 = `Currently, SEND is being tested with a small number of administrations.`;
const infoblock3_2 = `Progressively, the platform will be adopted by public administrations and used to send notifications to all citizens.`;

export const pfInfoBlocks: Array<IInfoblockData> = [
  {
    name: "infoblock 1",
    data: {
      title: "Never miss a notification again",
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
      title: "You choose how to receive notifications",
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
      title: "The future of legal communications",
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
  "Digital delivery of notifications leads to lower service and delivery costs";
const showcase1_2 =
  "No more waiting or queuing to collect paper communications";
const showcase1_3 = "Help reduce paper consumption and transport emissions";
const showcase1_4 =
  "You no longer have to keep printed documents, thanks to the option to download and store deeds digitally";

const showcase2_1 = `If you have a PEC address, notifications will be legally delivered
  to you, with no more registered paper mail. The acknowledgement of
  receipt that will be sent to you contains the link to access the
  content on SEND.`;
// only aria-label
const showcase2_2 = `If you activate the Digital Notifications service of
  SEND, you can receive and manage legal communications
  directly in the app. If you do not have a PEC and
  read the message immediately, you will not receive the registered
  letter and the notification will be legally delivered.`;
const showcase2_3 = `In addition, you can also choose to receive a courtesy
notification at your email address or by SMS. If you do not have a
PEC and access the platform from the designated link, you will not
receive the registered letter and the notification will be legally
delivered.`;

export const pfShowcases: Array<IShowcaseData> = [
  {
    name: "showcase 1",
    data: {
      title: "What digital notifications offer you",
      items: [
        {
          icon: <PiggyIcon />,
          title: "Convenience",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_1}>
              {showcase1_1}
            </Typography>
          ),
        },
        {
          icon: <HourglassIcon />,
          title: "Time",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_2}>
              {showcase1_2}
            </Typography>
          ),
        },
        {
          icon: <EcologyIcon />,
          title: "Sustainability",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase1_3}>
              {showcase1_3}
            </Typography>
          ),
        },
        {
          icon: <CloudIcon />,
          title: "Space",
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
          title: "IO app",
          subtitle: (
            <Typography variant="body2" tabIndex={0} aria-label={showcase2_2}>
              If you activate the &quot;Digital Notifications&quot; service of
              SEND, you can receive and manage legal communications{" "}
              <strong>directly in the app</strong>. If you do not have a PEC and
              read the message immediately, you will not receive the registered
              letter and the notification will be legally delivered.
            </Typography>
          ),
        },
        {
          icon: <MessageIcon />,
          title: "Email or SMS",
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
const walkthrough1 = `
For each notification, the platform checks whether there is a PEC associated with you or indicated by you for 
sending the acknowledgement of receipt. It then sends a courtesy notice to your other digital contacts (IO app, 
  email and SMS). If you have not provided a digital address and do not have access to the platform, you will 
  receive a registered letter in paper form.
`;
const walkthrough2 = `
From the message you receive, you can access the platform to read the notification and download its attachments. 
If you activate the service on IO, you can view the content directly in the app: this is equivalent to signing 
the return receipt of a traditional registered letter.
`;
const walkthrough3 = `
If there is an amount to be paid, thanks to the integration with pagoPA, you can proceed simultaneously online 
from the platform or directly from IO. If you prefer to go to a counter, you will need to have the payment form 
with you.
`;
const walkthrough4 = `
If you wish, you can delegate other persons, natural or legal, to receive your notifications online or to collect 
the attached documents in paper form at any Post Office.
`;

export const pfWalkthrough: WalkthroughProps = {
  title: "How does it work?",
  items: [
    {
      icon: <NotificationIcon color="primary" />,
      title: "Receive the notification",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough1}>
          {walkthrough1}
        </Typography>
      ),
    },
    {
      icon: <DocCheckIcon color="primary" />,
      title: "Read the contents",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough2}>
          {walkthrough2}
        </Typography>
      ),
    },
    {
      icon: <WalletIcon color="primary" />,
      title: "Paying expenses",
      subtitle: (
        <Typography variant="body2" tabIndex={0} aria-label={walkthrough3}>
          {walkthrough3}
        </Typography>
      ),
    },
    {
      icon: <DelegationIcon color="primary" />,
      title: "You can delegate or be delegated",
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
