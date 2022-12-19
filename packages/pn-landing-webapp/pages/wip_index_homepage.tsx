import { useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";

// Questa è una homepage di servizio, nel senso che andando su "/" si viene ridirezionati sulla pagina dei cittadini
// e in nextjs con SSG non ho trovato altri modi. Per ora su cloudfront viene servito come rootObject direttamente /cittadini/index.html
// quindi metto questa pagina in stand-by
// Carlotta Dimatteo 08/09/2022

const HomePage: NextPage = () => {
  useEffect(() => {
    void Router.push("/cittadini/index.html");
  }, []);

  return (
    <>
      <Head>
        <title>Piattaforma Notifiche</title>
        <meta name="description" content="Piattaforma Notifiche" />
        <link rel="icon" href="/static/favicon.svg" />
      </Head>

      <main></main>
    </>
  );
};

export default HomePage;
