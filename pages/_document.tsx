import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pl">
      <Head>
        {/* meta */}
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <meta name="theme-color" content="#ffffff" />

        {/* apple */}
        <meta name="mobile-wep-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="apple-mobile-web-app-title" content="Fonetyka" />

        {/* favicon */}
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/icon-180x180.png" />

        {/* manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
