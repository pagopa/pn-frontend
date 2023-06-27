import Head from "next/head";
import React from "react";

interface Props {
  title: string;
  description: string;
}

const PageHead = ({ title, description }: Props) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link
      rel="manifest"
      href="/static/manifest.webmanifest"
      crossOrigin="anonymous"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/static/icons/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/static/icons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/static/icons/favicon-16x16.png"
    />
  </Head>
);

export default PageHead;
