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
  title: "Send notifications? Easily said.",
  subtitle: `And, from today, easily done. SEND digitises the management of legal communications, 
      simplifying the process for everyone: those who send them, and those who receive them.`,
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
      title: "An easier way to manage notifications",
      content: (
        <>
          <Typography variant="body2">
            SEND digitises and simplifies the management of legal
            communications. The sending organisations only have to deposit the
            deed to be delivered: the platform will take care of the sending,
            either by digital or analogue means.
          </Typography>
          <Typography variant="body2">
            With SEND, the uncertainty of recipient availability is minimised,
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
            SEND integrates with the institutions’ protocol and offers both APIs
            for sending notifications automatically and the possibility of
            making manual submissions. Once the deeds and payment forms have
            been uploaded, the platform generates the IUN, a unique code
            identifying the notification.
          </Typography>
          <Typography variant="body2">
            Subsequently, it searches its archives and public registers for a
            PEC traceable to the recipient and sends the notification. It then
            sends a courtesy notice to the recipient’s other digital contacts
            (IO app, email and SMS).
          </Typography>
          <Typography variant="body2">
            If the recipient has not indicated a digital address and does not
            have access to the platform, the platform proceeds with the search
            for a physical address, and then with sending by registered mail.
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
            The recipient accesses the platform via SPID or CIE, where they can
            view and download the deed notified. Thanks to the integration with
            pagoPA, they can also pay what they owe at the same time. If they
            have activated the service on the IO app, they can do everything
            directly in the app.
          </Typography>
          <Typography variant="body2">
            Like the organisation, the recipient also has access to the history
            of the status of the notification and the certificates enforceable
            against third parties that prove it.
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
            Currently, organizations can start the technical activities
            necessary for integration into SEND.
          </Typography>

          <Typography variant="body2">
            In the meantime, organisations can consult:{" "}
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={MANUALE_URL}>the operations manual</Link> (updated
                20/11/2022),
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml">
                  the b2b API for public administrations
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery-push/develop/docs/openapi/api-external-b2b-webhook-v1.yaml">
                  the b2b API for the advancement of notifications
                </Link>
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body2">
                <Link href={PARTNER_AND_INTERMEDIARIES_PATH}>
                  the list of technology Partners and Intermediaries
                </Link>{" "}
                who are implementing the activities of integration to the
                platform and which can be used for support in the management of
                the technical aspects
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
/* ************************************** */

/** Walkthrough mocked data */
export const paWalkthrough: WalkthroughProps = {
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
      subtitle: `SEND verifies the completeness and correctness of the information. Each time there is 
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
/* ************************************** */
