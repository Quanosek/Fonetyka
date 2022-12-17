import style from "../styles/main.module.scss";
import Head from "next/head";

import rewrite from "../scripts/rewrite.js";

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
          <textarea id="input" placeholder="Wpisz wyraz:"></textarea>
          <button className={style.button} onClick={confirmButton}>
            Zamień
          </button>
          <div id="output" className={style.output}>
            <p>Poczekaj na wyniki...</p>
          </div>
        </div>
      </main>

      <footer>
        <p>
          Strona stworzona przez:{" "}
          <a href="https://github.com/Quanosek">Jakub Kłało</a>
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
  }
}
