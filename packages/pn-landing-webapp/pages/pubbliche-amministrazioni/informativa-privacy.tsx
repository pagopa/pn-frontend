import type { NextPage } from "next";
import Head from "next/head";

import { PA_PRIVACY_DOCUMENT_PATH } from "@utils/constants";

// const FAVICON_PATH = `${process.env.NEXT_PUBLIC_ASSETS_URL}/favicon.svg`;

const PrivacyPage: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche</title>
      <meta name="description" content="Informativa Privacy Piattaforma notifiche per le Pubbliche Amministrazioni" />
      <link rel="icon" href="/static/favicon.svg" />
    </Head>

    <main>
      <object data={PA_PRIVACY_DOCUMENT_PATH} type="application/pdf" width="100%" height="800px">
        <p>Il tuo browser non supporta la visualizzazione all&apos;interno della pagina, per scaricare il file clicca <a href={PA_PRIVACY_DOCUMENT_PATH}>qui</a>!</p>
      </object>
    </main>
  </>
);

export default PrivacyPage;
