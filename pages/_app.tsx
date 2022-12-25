import { useEffect } from "react";

import type { AppProps } from "next/app";
import Head from "next/head";

import "the-new-css-reset/css/reset.css";
import "@styles/globals.scss";

import ReactGA from "react-ga";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize("G-N6HTG788NK");
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
