"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "@/styles/home.module.scss";
import rewrite from "@/functions/rewrite";

import { Domine } from "next/font/google";
const domine = Domine({
  subsets: ["latin"],
  display: "swap",
});

interface HistoryLog {
  date: string;
  input: string;
  output: string[];
}

export default function HomePage() {
  const [scrollTop, showScrollTop] = useState<boolean>(false);

  const [textInput, setTextInput] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);

  // activate scroll-to-top button
  useEffect(() => {
    const scrollHandler = () => showScrollTop(window.scrollY > 200);

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const magicButton = (input: string) => {
    if (!input) return alert("Nie wpisano żadnych liter!");

    // reformat input
    const newInput = input
      .replace(/[0-9]/gi, "")
      .replace(/[ -\/:-@\[-\`{-~]/gi, "\n")
      .replace(/ +(?= )/g, "")
      .replace(/^[\r\n]+|[\r\n]+$/g, "")
      .replace(/\n+(?=\n)/g, "");

    setTextInput(newInput);

    const result = rewrite(newInput);
    setResults(result);

    // before adding check if not included
    if (historyLog.length > 0) {
      if (historyLog[0].input === newInput) return;
    }

    // save to history array
    setHistoryLog([
      {
        date: new Date().toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        input: newInput,
        output: result,
      },
      ...historyLog,
    ]);
  };

  return (
    <main>
      <Image
        className={styles.titleImage}
        src="/images/title.svg"
        alt="Generator zapisu fonetycznego"
        width={600}
        height={180}
        draggable={false}
        priority={true}
      />

      <div className={styles.main}>
        <textarea
          className={domine.className}
          placeholder="Dowolny wyraz"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <button
          title="Kliknij, aby wygenerować na zapis fonetyczny"
          className={styles.magicButton}
          onClick={() => magicButton(textInput)}
        >
          <p>Zamień</p>
        </button>

        <div className={domine.className}>
          {(!results.length && (
            <p className={styles.placeholder}>Zapis fonetyczny</p>
          )) ||
            results.map((result, index) => <p key={index}>{result}</p>)}
        </div>
      </div>

      <div className={styles.historyHandler}>
        <h2>Historia wyszukiwań:</h2>

        <div className={styles.history}>
          {(!historyLog.length && <p>Lista na razie jest pusta</p>) || (
            <>
              {historyLog.map((_, i) => {
                const log = historyLog[i];

                return (
                  <div
                    key={i}
                    className={styles.historyLog}
                    onClick={() => {
                      setTextInput(log.input);
                      magicButton(log.input);
                    }}
                  >
                    <div>
                      <p className={styles.inputValue}>{log.input}</p>
                      <p className={styles.timeDate}>{log.date}</p>
                    </div>

                    <p className={styles.outputValue}>{log.output}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className={styles.scrollTopHandler}>
        <button
          title="Powrót na górę strony"
          className={styles.scrollTopButton}
          style={{ display: scrollTop ? "flex" : "none" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image
            alt="arrow-up"
            src="/images/arrow-up.svg"
            height={50}
            width={50}
            draggable={false}
          />
        </button>
      </div>
    </main>
  );
}