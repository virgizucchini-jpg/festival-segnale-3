const URL_METEO =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=45.0703" +
  "&longitude=7.6869" +
  "&current=temperature_2m,wind_speed_10m" +
  "&timezone=Europe%2FRome";

const riquadroMeteo = document.querySelector("#meteo");

function aggiungiRiga(contenitore, testo, classe = "") {
  const riga = document.createElement("p");
  riga.textContent = testo;

  if (classe) {
    riga.className = classe;
  }

  contenitore.append(riga);
}

async function caricaMeteo() {
  try {
    const risposta = await fetch(URL_METEO);
    const dati = await risposta.json();

    if (!risposta.ok || dati.error) {
      throw new Error(dati.reason || `Errore HTTP ${risposta.status}`);
    }

    const attuale = dati.current;
    const unita = dati.current_units;

    if (
      !attuale ||
      !unita ||
      !Number.isFinite(attuale.temperature_2m) ||
      !Number.isFinite(attuale.wind_speed_10m) ||
      typeof attuale.time !== "string"
    ) {
      throw new Error("La risposta meteo non contiene i dati attesi.");
    }

    const contenuto = document.createElement("div");
    contenuto.className = "meteo-valori";

    aggiungiRiga(
      contenuto,
      `Temperatura: ${attuale.temperature_2m} ${unita.temperature_2m}`
    );
    aggiungiRiga(
      contenuto,
      `Vento: ${attuale.wind_speed_10m} ${unita.wind_speed_10m}`
    );
    aggiungiRiga(
      contenuto,
      `Ora del dato: ${attuale.time.replace("T", " ")}
(${dati.timezone || "ora locale"})`,
      "meteo-orario"
    );

    riquadroMeteo.replaceChildren(contenuto);
  } catch (errore) {
    console.error("Errore nel caricamento del meteo:", errore);

    const messaggio = document.createElement("p");
    messaggio.className = "meteo-errore";
    messaggio.textContent =
      "Il meteo non è disponibile al momento. Riprova più tardi.";

    riquadroMeteo.replaceChildren(messaggio);
  }
}

caricaMeteo();