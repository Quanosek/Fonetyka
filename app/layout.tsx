import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "the-new-css-reset/css/reset.css";
import "@/styles/globals.scss";

import Analytics from "@/components/analytics";

import { Encode_Sans } from "next/font/google";
const encodeSans = Encode_Sans({
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
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      {process.env.NODE_ENV !== "development" && <Analytics />}

      <body className={encodeSans.className}>
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
