import style from "@styles/main.module.scss";
import Head from "next/head";

import rewrite from "@scripts/rewrite";

export default function Home() {
  return (
    <>
      <Head>
        <title>Polski zapis fonetyczny</title>
        <meta
          name="description"
          content="Zmienia podany wyraz na poprawny polski zapis fonetyczny."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
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
          <textarea id="input" placeholder="Wpisz tutaj frazę"></textarea>
          {/* magic button */}
          <button className={style.button} onClick={confirmButton}>
            Zamień
          </button>
          {/* output */}
          <div id="output" className={style.output}>
            <p>Poczekaj na wyniki...</p>
          </div>
        </div>

        {/* history */}
        <div className={style.historyHandler}>
          <h2>Historia wyszukiwań:</h2>
          <div id="historyList" className={style.history}>
            <p id="placeholderText">
              Zacznij wpisywać różne frazy, aby móc wyświetlić historię
              wyszukiwania!
            </p>
          </div>
        </div>
      </main>

      <footer>
        <p>
          Strona stworzona przez{" "}
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

// MAIN (magic) button
function confirmButton() {
  const inputElement = document.getElementById("input") as HTMLInputElement;
  let input = inputElement?.value;

  if (!input) alert("Nie wpisano żadnych znaków!");
  else {
    const output = rewrite(input);

    const outputElement = document.getElementById("output") as HTMLInputElement;
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
