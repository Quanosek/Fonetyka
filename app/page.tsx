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
  const [historyLog, setHistoryLog] = useState<string[]>([]);

  useEffect(() => {
    const scrollEvent = () => {
      const scrollButton = document.getElementById(
        "scrollButton"
      ) as HTMLInputElement;
      const scrollStyle = scrollButton.style;

      if (
        (document.body.scrollTop || document.documentElement.scrollTop) > 280
      ) {
        scrollStyle.visibility = "visible";
        scrollStyle.bottom = "1.3rem";
        scrollStyle.opacity = "1";
      } else {
        scrollStyle.visibility = "";
        scrollStyle.bottom = "";
        scrollStyle.opacity = "";
      }
    };

    window.addEventListener("scroll", scrollEvent);
    return () => window.removeEventListener("scroll", scrollEvent);
  }, []);

  const magicButton = () => {
    const inputElement = document.getElementById("input") as HTMLInputElement;
    const outputElement = document.getElementById("output") as HTMLInputElement;

    let input = inputElement.value
      .replace(/[0-9]/gi, "") //remove numbers
      .replace(/[ -\/:-@\[-\`{-~]/gi, "\n") // remove special characters
      .replace(/ +(?= )/g, "") // remove additional spaces
      .replace(/^[\r\n]+|[\r\n]+$/g, "") // remove empty lines
      .replace(/\n+(?=\n)/g, ""); // remove additional enters

    inputElement.value = input;

    if (!input) {
      outputElement.innerHTML = "<p>Poczekaj na wyniki...</p>"; // placeholder
      alert("Nie wpisano żadnych liter!");
    } else {
      // define output values
      const output = rewrite(input);

      inputElement.scrollTop = 0;
      outputElement.innerHTML = output;

      // remove history section placeholder
      const placeholderText = document.getElementById(
        "placeholderText"
      ) as HTMLInputElement;
      if (placeholderText) placeholderText.remove();

      // history handler
      const handler = document.createElement("div");
      handler.setAttribute("id", input);
      handler.setAttribute("class", styles.historyPosition);

      // set timestamp
      const date = new Date().toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const timeDate = document.createElement("p");
      timeDate.setAttribute("class", styles.timeDate);
      timeDate.innerHTML = date.toString();
      handler.appendChild(timeDate);

      // input value
      const firstText = document.createElement("p");
      firstText.setAttribute("class", domine.className);
      firstText.setAttribute("class", styles.firstText);
      firstText.innerHTML = input;
      handler.appendChild(firstText);

      // output value
      const resultText = document.createElement("p");
      resultText.setAttribute("class", domine.className);
      resultText.setAttribute("class", styles.resultText);
      resultText.innerHTML = output;
      handler.appendChild(resultText);

      // adding result to history
      const historyList = document.getElementById(
        "historyList"
      ) as HTMLInputElement;

      if (historyList.firstElementChild?.id !== input) {
        historyList.insertBefore(handler, historyList.firstChild);
      }

      // on click event
      handler.addEventListener("click", (e) => {
        if (e.target instanceof Element) {
          const inputElement = document.getElementById(
            "input"
          ) as HTMLInputElement;

          inputElement.value = e.target.id;
          magicButton();

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });
    }
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
          id="input"
          className={domine.className}
          placeholder="Dowolny wyraz"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <button
          title="Kliknij, aby wygenerować na zapis fonetyczny"
          className={styles.magicButton}
          onClick={() => {
            magicButton();

            // const newInput = textInput
            //   .replace(/[0-9]/gi, "")
            //   .replace(/[ -\/:-@\[-\`{-~]/gi, "\n")
            //   .replace(/ +(?= )/g, "")
            //   .replace(/^[\r\n]+|[\r\n]+$/g, "")
            //   .replace(/\n+(?=\n)/g, "");

            // setTextInput(newInput);
            // setResults([rewrite(newInput)]);
          }}
        >
          <p>Zamień</p>
        </button>

        <div id="output" className={domine.className}>
          {(!results.length && (
            <p className={styles.placeholder}>Zapis fonetyczny</p>
          )) ||
            results.map((result, index) => <p key={index}>{result}</p>)}
        </div>
      </div>

      <div className={styles.historyHandler}>
        <h2>Historia wyszukiwań:</h2>

        <div id="historyList" className={styles.history}>
          <p id="placeholderText">
            Zacznij wpisywać różne frazy,
            <br />
            aby wyświetlić historię wyszukiwania!
          </p>
        </div>
      </div>

      <button
        id="scrollButton"
        className={styles.scrollButton}
        title="Kliknij, aby powrócić na samą górę!"
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
    </main>
  );
}
