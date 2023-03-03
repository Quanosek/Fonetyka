import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";

import styles from "@/styles/main.module.scss";
import rewrite from "@/scripts/rewrite";

export default function Home() {
  useEffect(() => {
    window.addEventListener("scroll", () => {
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
    });
  });

  return (
    <>
      <Head>
        <title>Fonetyka</title>
        <meta
          name="description"
          content="Zamiana podanych wyrazów na poprawny polski zapis fonetyczny w standardach AS i IPA."
        />
        <meta
          name="keywords"
          content="Jakub Kłało, klalo.pl, konwerter, zamiana, generator, fonetyka, zapis fonetyczny, zapisu fonetycznego, AS, IPA, format, formatowanie, standard, standardy, za darmo, darmowy, human, humanizm, filologia polska, język polski, polskie wyrazy, wyraz, przekształcenie, przekształcanie, gramatyka, wymowa"
        />
      </Head>

      <main>
        <div className={styles.algorithm}>
          <h1>Generator Zapisu Fonetycznego</h1>
          <p>
            Zamiana podanych wyrazów na poprawny polski zapis fonetyczny w
            standardach AS i IPA.
          </p>
        </div>

        <Image
          className={styles.title}
          alt="Generator Zapisu Fonetycznego"
          src="/images/title.svg"
          width={400}
          height={120}
          priority={true}
          draggable={false}
        />

        <div className={styles.main}>
          <textarea
            id="input"
            className="scrollable_item_1"
            placeholder="Wpisz tutaj frazę"
            data-scrollsync
          ></textarea>

          <button
            title="Kliknij, aby zamienić na zapis fonetyczny!"
            className={styles.magicButton}
            onClick={magicButton}
          >
            <p>Zamień</p>
          </button>

          <div
            id="output"
            className={`${styles.output} scrollable_item_2`}
            data-scrollsync
          >
            <p>Poczekaj na wyniki...</p>
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

      <footer>
        <p>
          Stworzone,{" "}
          <span>
            aby&nbsp;ułatwić&nbsp;życie pewnej&nbsp;studentce
            na&nbsp;filologii&nbsp;polskiej...
          </span>{" "}
          przez&nbsp;
          <a href="https://github.com/Quanosek">Jakuba&nbsp;Kłało</a>.
        </p>
        <p>
          Wszelki prawa zastrzeżone &#169;&nbsp;2023 │ domena&nbsp;
          <a href="https://www.klalo.pl">klalo.pl</a>
        </p>
      </footer>
    </>
  );
}

function magicButton() {
  const inputElement = document.getElementById("input") as HTMLInputElement;
  const outputElement = document.getElementById("output") as HTMLInputElement;

  // reformat input text
  let input = (inputElement.value = inputElement.value
    .replace(/[0-9]/gi, "") //remove numbers
    .replace(/[ -\/:-@\[-\`{-~]/gi, "\n") // remove special characters
    .replace(/ +(?= )/g, "") // remove additional spaces
    .replace(/^[\r\n]+|[\r\n]+$/g, "") // remove empty lines
    .replace(/\n+(?=\n)/g, "")); // remove additional enters

  // function
  if (!input) {
    outputElement.innerHTML = "<p>Poczekaj na wyniki...</p>"; // placeholder
    alert("Nie wpisano żadnych liter!");
  } else {
    // define output values
    const output = rewrite(input);

    inputElement.scrollTop = 0;
    outputElement.innerHTML = output;

    // remove placeholder
    const placeholderText = document.getElementById(
      "placeholderText"
    ) as HTMLInputElement;
    if (placeholderText) placeholderText.remove();

    /* HISTORY HANDLING */
    const handler = document.createElement("div");
    handler.setAttribute("id", input);
    handler.setAttribute("class", styles.historyPosition);

    // timestamp
    const date = new Date().toLocaleTimeString(undefined, {
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
    firstText.setAttribute("class", styles.firstText);
    firstText.innerHTML = input;
    handler.appendChild(firstText);

    // output value
    const resultText = document.createElement("p");
    resultText.setAttribute("class", styles.resultText);
    resultText.innerHTML = output;
    handler.appendChild(resultText);

    const historyList = document.getElementById(
      "historyList"
    ) as HTMLInputElement;
    if (historyList.firstElementChild?.id !== input)
      historyList.insertBefore(handler, historyList.firstChild);

    // click event
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
}
