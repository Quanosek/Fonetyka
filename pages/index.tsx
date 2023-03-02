import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";

import style from "@/styles/main.module.scss";
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
          content="Jakub Kłało, klalo.pl, generator, fonetyka, zapis fonetyczny, zapisu fonetycznego, AS, IPA, format, formatowanie, standard, standardy, za darmo, darmowy, human, humanizm, filologia polska, język polski, polskie wyrazy, wyraz, przekształcenie, przekształcanie"
        />
      </Head>

      <main>
        {/* title */}
        <div className={style.title}>
          <h1>Generator zapisu fonetycznego</h1>
          <p>
            Stworzone, aby ułatwić życie pewnej studentce na filologii
            polskiej...
          </p>
        </div>

        <div className={style.main}>
          {/* input  */}
          <textarea
            id="input"
            className="scrollable_item_1"
            placeholder="Wpisz tutaj frazę"
            data-scrollsync
          ></textarea>
          {/* magic button */}
          <button
            className={style.button}
            title="Kliknij, aby zamienić na zapis fonetyczny!"
            onClick={confirmButton}
          >
            Zamień
          </button>
          {/* output */}
          <div
            id="output"
            className={`${style.output} scrollable_item_2`}
            data-scrollsync
          >
            <p>Poczekaj na wyniki...</p>
          </div>
        </div>

        {/* history */}
        <div className={style.historyHandler}>
          <h2>Historia wyszukiwań:</h2>

          <div id="historyList" className={style.history}>
            <p id="placeholderText">
              Zacznij wpisywać różne frazy,
              <br />
              aby wyświetlić historię wyszukiwania!
            </p>
          </div>
        </div>

        <button
          id="scrollButton"
          className={style.scrollButton}
          title="Kliknij, aby powrócić na samą górę!"
          onClick={() => {
            document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Image
            alt="strzałka do góry"
            src="/icons/arrow.svg"
            height={50}
            width={50}
          />
        </button>
      </main>

      <footer>
        <p>
          Stworzone z 💙 przez{" "}
          <a href="https://github.com/Quanosek">Jakuba Kłało</a>.
        </p>
        <p>
          Wszelkie prawa zastrzeżone &#169; 2023 │ domena{" "}
          <a href="https://www.klalo.pl">klalo.pl</a>
        </p>
      </footer>
    </>
  );
}

// magic button
function confirmButton() {
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
    outputElement.innerHTML = "<p>Poczekaj na wyniki...</p>";
    alert("Nie wpisano żadnych liter!");
  } else {
    const output = rewrite(input);

    inputElement.scrollTop = 0;
    outputElement.innerHTML = output;

    addToHistory(input, output);
  }
}

function addToHistory(input: string, output: string) {
  // default value
  const placeholderText = document.getElementById(
    "placeholderText"
  ) as HTMLInputElement;
  if (placeholderText) placeholderText.remove();

  // creating HTML elements
  const handler = document.createElement("div");
  handler.setAttribute("id", input);
  handler.setAttribute("class", style.historyPosition);

  const date = new Date().toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const timeDate = document.createElement("p");
  timeDate.setAttribute("class", style.timeDate);
  timeDate.innerHTML = date.toString();
  handler.appendChild(timeDate);

  const firstText = document.createElement("p");
  firstText.setAttribute("class", style.firstText);
  firstText.innerHTML = input;
  handler.appendChild(firstText);

  const resultText = document.createElement("p");
  resultText.setAttribute("class", style.resultText);
  resultText.innerHTML = output;
  handler.appendChild(resultText);

  // create div
  const historyList = document.getElementById(
    "historyList"
  ) as HTMLInputElement;
  if (historyList.firstElementChild?.id !== input)
    historyList.insertBefore(handler, historyList.firstChild);

  // event handler
  handler.addEventListener("click", (e) => {
    if (e.target instanceof Element) {
      const inputElement = document.getElementById("input") as HTMLInputElement;
      inputElement.value = e.target.id;
      confirmButton();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
}
