const PERCORSO_EVENTI = "dati/eventi.json";
const PERCORSO_SEDI = "dati/sedi.json";

const stato = document.querySelector("#stato-programma");
const elenco = document.querySelector("#elenco-eventi");

function creaElemento(tag, testo, classe) {
  const elemento = document.createElement(tag);
  elemento.textContent = testo;

  if (classe) elemento.className = classe;

  return elemento;
}

function formattaData(data) {
  if (!data) return "";

  const parti = data.split("-");
  if (parti.length !== 3) return data;

  const [anno, mese, giorno] = parti;
  return `${giorno}/${mese}/${anno}`;
}

function creaScheda(evento, sede) {
  const scheda = document.createElement("article");
  scheda.className = "event-card";

  if (evento.immagine) {
    const immagine = document.createElement("img");
    immagine.src = evento.immagine;
    immagine.alt = evento.immagine_alt || "";
    immagine.loading = "lazy";
    scheda.append(immagine);
  }

  const corpo = document.createElement("div");
  corpo.className = "event-body";

  corpo.append(
    creaElemento("p", evento.categoria || "Appuntamento", "event-meta"),
    creaElemento("h3", evento.titolo || "Evento senza titolo"),
    creaElemento(
      "p",
      `${formattaData(evento.data)}${evento.orario ? ` ·
${evento.orario}` : ""}`,
      "event-meta"
    ),
    creaElemento("p", evento.descrizione || "")
  );

  const nomeSede = sede?.nome || "Sede da definire";
  const indirizzo = sede?.indirizzo ? ` · ${sede.indirizzo}` : "";
  corpo.append(creaElemento("p", `${nomeSede}${indirizzo}`, "event-place"));

  scheda.append(corpo);
  return scheda;
}

async function caricaProgramma() {
  try {
    const [rispostaEventi, rispostaSedi] = await Promise.all([
      fetch(PERCORSO_EVENTI),
      fetch(PERCORSO_SEDI)
    ]);

    if (!rispostaEventi.ok || !rispostaSedi.ok) {
      throw new Error("Non è stato possibile leggere i file JSON.");
    }

    const [eventi, sedi] = await Promise.all([
      rispostaEventi.json(),
      rispostaSedi.json()
    ]);

    if (!Array.isArray(eventi) || !Array.isArray(sedi)) {
      throw new Error("Il formato dei file JSON non è valido.");
    }

    if (eventi.length === 0) {
      stato.textContent = "Al momento non ci sono eventi in programma.";
      return;
    }

    const sediPerId = new Map(sedi.map((sede) => [String(sede.id), sede]));

    const schede = eventi.map((evento) => {
      const sede = sediPerId.get(String(evento.sede_id));
      return creaScheda(evento, sede);
    });

    elenco.replaceChildren(...schede);
    stato.textContent = "";
  } catch (errore) {
    console.error("Errore nel caricamento del programma:", errore);
    stato.textContent =
      "Non è stato possibile caricare il programma. Controlla i file
JSON e riprova.";
  }
}
