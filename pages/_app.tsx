import type { AppProps } from "next/app";
import Head from "next/head";

import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "nextjs-google-adsense";

import "the-new-css-reset/css/reset.css";
import "@/styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {process.env.NODE_ENV !== "development" && (
        <>
          <GoogleAnalytics
            gaMeasurementId={
              process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string
            }
            trackPageViews
          />

          <GoogleAdSense
            publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID as string}
          />
        </>
      )}

      <Component {...pageProps} />
    </>
  );
}
