# Schema dei dati

## Entità

### Evento

| Campo | Tipo | Descrizione |
|---|---|---|
| `id` | numero intero | Identificativo univoco e stabile |
| `titolo` | stringa | Titolo dell’evento |
| `data` | data (`YYYY-MM-DD`) | Giorno dell’evento |
| `orario` | stringa (`HH:MM`) | Orario di inizio |
| `categoria` | stringa | Categoria dell’appuntamento |
| `descrizione` | stringa | Descrizione dell’evento |
| `immagine` | stringa | Percorso dell’immagine |
| `immagine_alt` | stringa | Testo alternativo dell’immagine |
| `sede_id` | numero intero | ID della sede in cui si svolge |

### Sede

| Campo | Tipo | Descrizione |
|---|---|---|
| `id` | numero intero | Identificativo univoco e stabile |
| `nome` | stringa | Nome della sede |
| `indirizzo` | stringa | Indirizzo della sede |

## Relazione Evento–Sede

Una sede può ospitare più eventi. Ogni evento si svolge in una sola
sede, collegata tramite `Evento.sede_id`, che corrisponde a `Sede.id`.

```mermaid
erDiagram
    SEDE ||--o{ EVENTO : ospita
    SEDE {
        int id PK
        string nome
        string indirizzo
    }
    EVENTO {
        int id PK
        string titolo
        date data
        string orario
        string categoria
        string descrizione
        string immagine
        string immagine\_alt
        int sede\_id FK
    }