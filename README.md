# Configuratore ANT 2026

Webapp statica responsive, senza persistenza, dipendenze o compilazione. Aprire `index.html` in un browser moderno oppure caricare HTML, CSS, JavaScript e `assets/` nella stessa cartella su un hosting statico.

## Potenze e dati

Il menu propone esclusivamente i 25 tagli dei PDF, ordinati e raggruppati per linea:

- Lite: 15, 22, 30, 45, 60, 75, 100, 120 kVA.
- Industry e PRO: 150, 200, 300, 400, 500, 600, 700, 800, 1.000, 1.200, 1.500, 1.700, 2.000, 2.500, 3.000, 3.500, 4.000 kVA.

Selezione iniziale e ripristino: 150 kVA, PRO spento, meter spento, IP21, un anno cloud.

`catalogue.js` contiene 42 righe prodotto (8 Lite, 17 Industry, 17 PRO) e 17 tariffe di trasporto. Prezzi espressi in centesimi interi, IVA esclusa. Le quattro fonti sono tutte Rev. 1, pagina 1; nomi e impronte SHA-256 sono registrati in `sources`:

- Ant 2.0 Listino 2026 Lite-Rev.1.pdf
- Ant 2.0 Listino Industry 26-Rev.1.pdf
- Ant PRO Listino 2026- Rev.1.pdf
- Listino trasporti 2026-Rev.1 copia.pdf

Tutti gli importi sono stati confrontati automaticamente con il testo estratto dai PDF e le quattro pagine sono state esaminate visivamente. I PDF originali non sono inclusi nel pacchetto per il deploy.

## Regole

- PRO selezionabile soltanto da 150 kVA, per i 17 tagli presenti nel listino PRO. Il prezzo PRO sostituisce quello Industry.
- Meter MID: non disponibile per Lite 15/22/30/45; disponibile e prezzato per gli altri Lite e tutti gli Industry; compreso in PRO, con opzione aggiuntiva disabilitata e deselezionata.
- IP21 incluso per richiesta dell'utente. IP54/IP65 prezzati per singolo taglio Industry/PRO; non quotati per Lite.
- Cloud 1–5 anni: primo anno incluso e 1.500 euro per ogni anno ulteriore, secondo la regola dell'utente.
- Trasporto assicurato: tariffa del taglio fino a 1.000 kVA; oltre, da quotare. La tabella trasporti distingue Lite/Industry; per PRO viene applicata la tariffa della medesima potenza secondo l'impostazione richiesta del configuratore, senza un sovrapprezzo PRO non documentato.
- Se manca una quotazione, il risultato è esplicitamente un importo parziale, con elenco delle voci da quotare. Nessuna interpolazione e nessun prezzo mancante sostituito con zero.
- Ripristino opzioni e stampa tramite il browser. Nessun dato salvato, nessun account o servizio esterno.

## Particolarità documentali mantenute

- Nel listino trasporti la riga da 1.000 kVA riporta «kW 200»: il menu e il calcolo usano il dato kVA 1.000 e il prezzo 3.500 euro della stessa riga, senza correggere il PDF.
- Il prezzo Industry 700 kVA è 121.427 euro, trascritto esattamente.
- Il marchio nell’intestazione deriva dal logo in alto a sinistra del PDF Lite, con il suffisso «2.0» e la ® rimossi su richiesta. Le icone usano la formica originale dello stesso marchio, senza ridisegni. Il menu e la struttura grafica del prototipo sono mantenuti.

## Verifiche

Con Node.js:

```sh
node --test tests/*.test.cjs
```

25 test superati: 13 sul motore con dati sintetici isolati, 5 sul catalogo reale e 7 sul calcolo Valutazioni. Coprono tagli, vincoli PRO/meter, prezzi, cloud, costi ignoti, precisione, limiti e scala del grafico.

Confronto indipendente con i PDF: corrispondenza di tutte le 42 righe prodotto (prezzo, meter e cabinet) e di tutte le 17 tariffe trasporto.

Browser integrato: verificati menu con 25 opzioni in due gruppi, Lite 15 kVA totale 9.700 euro, PRO disabilitato sotto 150 kVA, passaggio a 150 PRO con meter disabilitato e totale 43.300 euro, trasporto da quotare a 4.000 kVA, ripristino a 150 kVA. Nessun errore applicativo in console. Verifica responsive del selettore a 390 px.

L'apertura diretta file:// è supportata dalla struttura con script classici e nessun fetch, ma il browser integrato ammette soltanto l'anteprima HTTP locale. Non sono stati verificati dispositivo fisico, stampa fisica, Safari e Firefox.

Le descrizioni generali IP seguono la [guida tecnica KEYENCE](https://www.keyence.com.sg/ss/products/measure/measurement_library/basic/protection/).

## Icone smartphone e pubblicazione

Il logo `assets/ant-logo-clean.png` deriva dal PDF Lite originale; il suffisso «2.0» e la ® sono stati rimossi con Image Gen integrato (brief: mantenere formica, scritta ant, payoff e fondo bianco; rimuovere i due elementi e lo spazio vuoto superfluo). Il logo è visualizzato più grande nell’intestazione. Le icone sono renderizzazioni del simbolo originale del PDF. L’intestazione mostra «Listino 09/2026». Favicon PNG 32 px, Apple touch icon 180 px, icone Android 192/512 px e variante maskable 512 px. Il manifest usa percorsi relativi, adatti anche al sottopercorso GitHub Pages.

Su iPhone/iPad: aprire il sito in Safari, Condividi → Aggiungi alla schermata Home. Su Android: aprire in Chrome, menu → Aggiungi a schermata Home (la dicitura può variare). Nome: ANT 2026. Le icone sono predisposte e verificate come risorse; l’aggiunta alla Home non è stata provata su un dispositivo fisico. Non è stato aggiunto un service worker: nessuna disponibilità offline garantita dopo l'installazione. Nessuna persistenza dei preventivi.

Repository: `Siriusmac/Listino-ANT`, sito `https://siriusmac.github.io/Listino-ANT/`. Pubblicazione GitHub Pages dal ramo `main`, cartella radice, con `.nojekyll`. I PDF originali e gli ZIP locali non sono pubblicati.

## Foto nel riepilogo

`assets/ant-standard.png` e `assets/ant-pro.png` sono le immagini originali incorporate rispettivamente nei PDF Lite e PRO, estratte tramite pypdf con la trasparenza presente nei file. Le immagini Lite e Industry sono state confrontate e risultano identiche pixel per pixel. Il riepilogo aggiorna foto e testo alternativo quando cambia la linea: Lite/Industry condividono la foto standard, PRO usa quella del cabinet nero. Sono immagini indicative di linea, non fotografie specifiche di ciascun taglio di potenza.

## Valutazioni

Pagina `valutazioni.html`, raggiungibile dal pulsante Valutazioni accanto al titolo del listino, con ritorno tramite Torna al listino. Percorso semplificato: un solo campo **cosphi** 0–1, al massimo due decimali, virgola o punto; nessun selettore FP/cos φ, nessun campo THDi e una sola curva blu con pallino del valore calcolato. Nessuna persistenza.

Metodo scelto dall'utente: **aumento delle perdite resistive rispetto al riferimento a fattore unitario**. Formula derivata: `(1 / f² - 1) × 100`, a potenza attiva, tensione, resistenza e durata costanti. Esempi: 0,80 → +56,25%; 0,50 → +300%; 1 → 0%. A zero il confronto non ha un risultato finito e il punto è nascosto. Non viene considerato il THD: cosphi e FP coincidono nel modello sinusoidale adottato. Il risultato non è una percentuale dei consumi totali né un risparmio garantito con ANT; questo limite è dichiarato nel paragrafo principale.

Asse Y: cosphi da 1 in alto a 0 in basso. Asse X: inizialmente 0–100%, con espansione automatica per i risultati oltre il 100%. La spiegazione FP/cos φ è condensata in un solo paragrafo e precisa che entrambe le grandezze sono adimensionali.

Due schemi SVG originali, didattici e fissi, completano la spiegazione:

- Tensione blu e corrente arancione sfasate di circa 36,9°, con ampiezze normalizzate; esempio cosphi 0,80. Non rappresentano misure del cliente.
- Triangolo P/Q/S con 80 kW attivi, 60 kvar reattivi, 100 kVA apparenti, `cosphi = P/S` e `S² = P² + Q²`, valido nel confronto senza THD. La reattiva non viene presentata come energia interamente dissipata.

La sezione sulle unità distingue kW (potenza attiva), kVA (potenza apparente), kvar (potenza reattiva) e kWh (energia nel tempo). Esempio illustrativo coerente con i due schemi: 100 kVA a cosphi 0,80 danno 80 kW; mantenuti costanti per 5 ore corrispondono a 400 kWh.

Fonti: Schneider Electric, [perdite nei cavi proporzionali al quadrato della corrente](https://www.electrical-installation.org/enwiki/Why_improve_the_power_factor%3F), [definizione di fattore di potenza](https://www.electrical-installation.org/enwiki/Definition_of_Power_Factor) e [FP rispetto a cos φ](https://www.electrical-installation.org/enwiki/Harmonic_distortion_indicators_-_Power_factor); EIA, [potenza ed energia](https://www.eia.gov/energyexplained/electricity/measuring-electricity.php).

QA: 25 test automatici superati. Browser integrato a 1440 × 1000, 390 × 844 e 320 × 740: una sola curva, nessun selettore di grandezza, calcolo 0,80 e 0,50, gestione zero e tre decimali, disegni e tabella leggibili; nessuna eccedenza orizzontale o errore applicativo in console. Schemi fissi indipendenti dal valore inserito, sempre etichettati come esempi. Risorse CSS/JS versionate per evitare versioni miste in cache. Smartphone verificato in emulazione, non su dispositivo fisico.
