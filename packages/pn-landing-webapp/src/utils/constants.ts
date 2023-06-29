// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const IMAGES_PATH = process.env.NEXT_PUBLIC_IMAGES_PATH;

export const PA_PARTNERS_AND_INTERMEDIARIES_DOCUMENT_PATH =
  process.env.NEXT_PUBLIC_PA_PARTNERS_PATH;

export const PAGOPA_HOME = process.env.NEXT_PUBLIC_PAGOPA_HOME;
export const PAGOPA_HELP_EMAIL = process.env.NEXT_PUBLIC_PAGOPA_HELP_EMAIL;
export const SEND_PF_HELP_EMAIL = process.env.NEXT_PUBLIC_SEND_PF_HELP_EMAIL || "";

export const PN_PF_URL = process.env.NEXT_PUBLIC_PIATTAFORMA_NOTIFICHE_PF_URL;

export const PN_PG_URL = process.env.NEXT_PUBLIC_PIATTAFORMA_NOTIFICHE_PG_URL;

export const MANUALE_URL = "https://docs.pagopa.it/pn-manuale-operativo/";

const ONE_TRUST_DRAFT_MODE = !!process.env.NEXT_PUBLIC_ONE_TRUST_DRAFT_MODE;
const ONE_TRUST_PP = process.env.NEXT_PUBLIC_ONE_TRUST_PP || "";
export const ONE_TRUST_CDN = `https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/${ONE_TRUST_DRAFT_MODE ? "draft/" : ""
  }${ONE_TRUST_PP}.json`;

export const PARTNER_AND_INTERMEDIARIES_PATH =
  "https://docs.pagopa.it/lista-partner-tecnologici-pn_pagopa-s.p.a./";

export const PERFEZIONAMENTO_PATH = process.env.NEXT_PUBLIC_PERFEZIONAMENTO_PATH;
