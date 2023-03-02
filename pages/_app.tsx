import Head from "next/head";
import type { AppProps } from "next/app";

import { GoogleAdSense } from "nextjs-google-adsense";
import { GoogleAnalytics } from "nextjs-google-analytics";

import "the-new-css-reset/css/reset.css";
import "@/styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <GoogleAdSense publisherId={"env.local"} />
      <GoogleAnalytics trackPageViews />

      <Component {...pageProps} />
    </>
  );
}
