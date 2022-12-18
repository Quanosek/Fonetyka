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
        <div className={style.title}>
          <h1>Generator zapisu fonetycznego</h1>
          <p>
            Stworzone, aby ułatwić życie pewnej studentce na filologii
            polskiej...
          </p>
        </div>

        <div className={style.main}>
          <textarea id="input" placeholder="Wpisz tutaj frazę"></textarea>
          <button className={style.button} onClick={confirmButton}>
            Zamień
          </button>
          <div id="output" className={style.output}>
            <p>Poczekaj na wyniki...</p>
          </div>
        </div>
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

function confirmButton() {
  const inputElement = document.getElementById(
    "input"
  ) as HTMLInputElement | null;
  const input = inputElement?.value;

  if (!input) alert("Nie wpisano żadnych znaków!");
  else {
    const output = rewrite(input);

    const outputElement = document.getElementById("output") as HTMLInputElement;
    outputElement.innerHTML = output;

    addToHistory(input, output);
  }
}

function addToHistory(input: string, output: string) {
  const placeholderText = document.getElementById(
    "placeholderText"
  ) as HTMLInputElement;
  if (placeholderText) placeholderText.remove();

  const div = document.createElement("div");
  div.setAttribute("id", input);
  div.setAttribute("class", style.historyPosition);
  div.innerHTML = `${input} &#8594; ${output}`;

  const historyList = document.getElementById(
    "historyList"
  ) as HTMLInputElement;
  if (historyList.firstElementChild?.id !== input)
    historyList.insertBefore(div, historyList.firstChild);

  div.addEventListener("click", (e) => {
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
