import type { Metadata, Viewport } from "next";
import Analytics from "@/components/analytics";

import "the-new-css-reset/css/reset.css";
import "./globals.scss";

import { Encode_Sans } from "next/font/google";
const EncodeSansFont = Encode_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Fonetyka",
  title: "Generator zapisu fonetycznego / klalo.pl",
  description:
    "Przekształcanie wyrazów w języku polskim na zapis fonetyczny w standardach AS i IPA.",
  icons: {
    icon: ["/favicons/favicon.ico", "/favicons/icon.svg"],
    apple: "/favicons/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      {process.env.NODE_ENV === "production" && <Analytics />}

      <body className={EncodeSansFont.className}>
        {children}

        <footer>
          <p>
            Stworzone <span>dla pewnej studentki filologii polskiej 💜</span>{" "}
            przez{" "}
            <a href="https://github.com/Quanosek" target="_blank">
              Jakuba Kłało
            </a>
          </p>

          <p>
            Wszelkie prawa zastrzeżone &#169; 2023-
            {new Date().getFullYear()} │ domena{" "}
            <a href="https://www.klalo.pl" target="_blank">
              klalo.pl
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
