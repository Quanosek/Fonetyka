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

export default function HomePage() {
  const [scrollTop, showScrollTop] = useState<boolean>(false);

  const [textInput, setTextInput] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [historyLog, setHistoryLog] = useState<any>([]);

  // activate scroll-to-top button
  useEffect(() => {
    const scrollHandler = () => showScrollTop(window.scrollY > 200);

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

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
          onClick={() => {
            const newInput = textInput
              .replace(/[0-9]/gi, "")
              .replace(/[ -\/:-@\[-\`{-~]/gi, "\n")
              .replace(/ +(?= )/g, "")
              .replace(/^[\r\n]+|[\r\n]+$/g, "")
              .replace(/\n+(?=\n)/g, "");

            setTextInput(newInput);
            const result = rewrite(newInput);
            setResults(result);

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
          }}
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
              {historyLog.map((_: any, i: number) => {
                const log = historyLog[i];

                return (
                  <div className={styles.historyLog} key={i}>
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
          title="Kliknij, aby powrócić na samą górę!"
          className={styles.scrollTopButton}
          style={{ display: scrollTop ? "flex" : "none" }}
          onClick={() => {
            document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Image
            alt="strzałka do góry"
            src="/images/arrow.svg"
            height={50}
            width={50}
            draggable={false}
          />
        </button>
      </div>
    </main>
  );
}
