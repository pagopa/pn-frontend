import { NextPage } from "next";
import Head from "next/head";
import { PA_PARTNERS_AND_INTERMEDIARIES_DOCUMENT_PATH } from "@utils/constants";

const PartnerEIntermediariPage: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche - Pubbliche amministrazioni</title>
      <meta name="description" content="Pagina per le pubbliche amministrazioni" />
      <link rel="icon" href="/static/favicon.svg" />
    </Head>
    <main>
      <object data={PA_PARTNERS_AND_INTERMEDIARIES_DOCUMENT_PATH} type="application/pdf" width="100%" height="800px">
        <p>Il tuo browser non supporta la visualizzazione all&apos;interno della pagina, per scaricare il file clicca <a href={PA_PARTNERS_AND_INTERMEDIARIES_DOCUMENT_PATH}>qui</a>!</p>
      </object>
    </main>
    </>
);

export default PartnerEIntermediariPage;