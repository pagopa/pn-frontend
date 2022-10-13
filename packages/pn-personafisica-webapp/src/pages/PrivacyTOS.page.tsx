import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Link,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const PrivacyTOSPage = () => {
  const { hash } = useLocation();
  const [tosExpanded, setTosExpanded] = useState<boolean>(hash === "#tos");
  const [privacyExpanded, setPrivacyExpanded] = useState<boolean>(hash === "#privacy");

  const handleTos = () => {
    setTosExpanded((prev) => !prev);
  };
  const handlePrivacy = () => {
    setPrivacyExpanded((prev) => !prev);
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
        py: {
          xs: 4,
          sm: 4,
          md: 8,
        },
      }}
        >
        <Typography variant="h3">Piattaforma Notifiche Digitali</Typography>
        <Typography variant="h4">Destinatari persone fisiche</Typography>
        <Box mt={3}>
          <Accordion expanded={tosExpanded} onChange={handleTos}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              aria-controls="tos-content"
              id="tos-accordion-summary"
            >
              <Typography variant="h6">Termini e condizioni d’uso</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" fontWeight="bold">Data ultimo aggiornamento: 08/08/2022</Typography>
              <br/>
              <Typography variant="body1">
                I presenti termini e condizioni d’uso (<b>“Termini & Condizioni d’uso” o “ToS”</b>) regolano il rapporto
                tra l’<b>utente persona fisica</b> (di seguito <b>“Utente” o “Tu”</b>) e PagoPA S.p.A. (di
                seguito <b>“Società”</b>), quale società per legge avente la gestione della Piattaforma (come nel
                seguito definita), stabilendo diritti e obblighi connessi al suo utilizzo.<br/>
                <b>I presenti ToS regolano quindi il rapporto tra gli Utenti del sito <Link
                  href="https://cittadini.notifichedigitali.it">https://cittadini.notifichedigitali.it</Link></b> (di
                seguito <b>“Sito”</b>) che accedono alla Piattaforma Notifiche Digitali (di seguito <b>“Piattaforma”</b>)
                di cui ai seguenti riferimenti normativi:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1" sx={{display: "list-item"}}>art. 1, comma 402, della legge 27 dicembre
                    2019, n. 160;</Typography>
                </li>
                <li>
                  <Typography variant="body1">art. 26 del decreto-legge del 17 luglio 2020, n. 76 come convertito, con
                    modificazioni, dalla legge 11 settembre 2020, n. 120 e come altresì modificato dal decreto-legge del
                    31 maggio 2021, n. 77 così come convertito dalla legge 29 luglio 2021 n. 108 (di seguito
                    “Decreto”);</Typography>
                </li>
                <li>
                  <Typography variant="body1">decreto del Ministro per la Trasformazione Digitale dell’8 febbraio 2022,
                    n. 58 dal titolo “Regolamento recante piattaforma per la notificazione degli atti della pubblica
                    amministrazione” (di seguito “Decreto Funzionamento”);</Typography>
                </li>
                <li>
                  <Typography variant="body1">decreto del Ministro per la Trasformazione Digitale del 30 maggio 2022 dal
                    titolo “Individuazione dei costi e dei criteri e modalità di ripartizione e ripetizione delle spese
                    di notifica degli atti tramite la piattaforma di cui all’art. 26, comma 14 del decreto-legge 16
                    luglio 2020, n. 76” (di seguito “Decreto Costi”).</Typography>
                </li>
              </ul>
              <Typography variant="body1">
                <strong>
                  Leggili attentamente: utilizzando il Sito, li accetti integralmente e ti impegni a rispettarli.
                </strong>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">1. Descrizione del servizio </Typography>
              <Typography variant="body1" component="span">
                1.1 Tramite la Piattaforma, le pubbliche amministrazioni mittenti (di seguito <b>“Pubbliche
                Amministrazioni”</b>) notificano atti, provvedimenti, avvisi e comunicazioni (di seguito
                genericamente <b>“documenti informatici”</b>) agli Utenti, ossia ai loro destinatari, i quali possono
                servirsi anche di delegati o altre persone di fiducia per accedere agli stessi documenti.<br/>
                1.2 Per le notifiche effettuate tramite Piattaforma, Tu potresti non ricevere materialmente il documento
                informatico oggetto di notifica ma certamente riceverai un avviso (avviso di avvenuta ricezione o avviso
                di mancato recapito) che ti informerà della notifica eseguita nei Tuoi confronti e che ti permetterà,
                altresì, di reperire i documenti informatici di riferimento della notifica, come disponibili sulla
                Piattaforma.<br/>
                1.3 In coerenza con i principi generali del diritto, la notifica dei documenti informatici per il
                mittente e per i destinatario si perfeziona in due momenti diversi e distinti, e precisamente:<br/>
                <ul>
                  <li>per le Pubbliche Amministrazioni (mittenti) la notifica si perfeziona con la messa a disposizione
                    dei medesimi sulla Piattaforma;
                  </li>
                  <li>per gli Utenti (destinatari) invece la notifica si perfeziona:<br/>
                    <b>1a)</b> il <b>settimo giorno</b> successivo alla data di consegna dell’<b>avviso di avvenuta
                      ricezione</b> se in formato <b>elettronico</b>;<br/>
                    <b>1b)</b> il <b>quindicesimo giorno</b> successivo alla data del deposito dell’<b>avviso di mancato
                      recapito</b>;<br/>
                    <b>2)</b> il <b>decimo</b> giorno successivo al perfezionamento della notificazione dell’avviso di
                    avvenuta ricezione se in formato cartaceo;<br/>
                    <b>3)</b> in ogni caso, se anteriore, <b>nella data</b> in cui Tu o un Tuo delegato, <b>hai/ha
                      accesso alla Tua area riservata</b> della Piattaforma, contenente il dettaglio della notifica.
                  </li>
                </ul>
              </Typography>
              <Typography variant="body1">
                1.4 Potrai per il tramite della Piattaforma, per ogni documento informatico oggetto di notifica
                visualizzarne la Pubblica Amministrazione mittente, la data e l’ora di messa a disposizione dello stesso
                in Piattaforma, lo storico del processo di notificazione, ivi inclusi i relativi atti opponibili ai
                terzi, gli avvisi di mancato recapito e il codice identificativo univoco della notifica (IUN).<br/>
                1.5 Ai sensi dell’articolo 12 del Decreto Funzionamento, infatti, la Piattaforma genera degli atti
                opponibili ai terzi (anche chiamate <b>“Attestazioni”</b>), ossia degli atti giuridici idonei ad
                esprimere la loro efficacia anche nei confronti dei terzi.<br/>
                1.6 La messa a disposizione dei documenti informatici oggetto di notifica in Piattaforma impedisce
                qualsiasi decadenza e interrompe il termine di prescrizione correlato alla notificazione dei documenti
                informatici oggetto di notifica.<br/>
                1.7 Accettando i presenti ToS, Tu dichiari espressamente di volerti avvalere della Piattaforma e dei
                servizi di notifica offerti per il tramite di questa (i <b>“Servizi”</b>), alle condizioni e nei termini
                di seguito descritti.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">2. Identificazione e accesso alla Piattaforma</Typography>
              <Typography variant="body1">
                2.1 Affinché Tu possa accedere alla Piattaforma e usufruire digitalmente dei Servizi, dovrai
                identificarti tramite sistema pubblico per la gestione dell’identità digitale di cittadini e imprese
                (SPID) ovvero tramite la Carta d’identità elettronica (CIE).<br/>
                2.2 Dopo aver preso visione dei presenti ToS, avrai diritto ad accedere alla Tua area riservata della
                Piattaforma, per il reperimento, la consultazione e l’acquisizione dei documenti informatici oggetto di
                notifica (vedi anche 9.1 viii).<br/>
                2.3 Nei casi in cui Tu non possa utilizzare o non sia in possesso di SPID o CIE, hai comunque a
                disposizione una modalità alternativa di accesso, presso Poste Italiane S.p.A., quale Fornitore del
                Servizio Universale (di seguito <b>“FSU”</b>) che ti consente di acquisire l’estrazione della copia
                analogica dei documenti informatici oggetto di notifica, degli atti opponibili ai terzi rilasciati dalla
                Società ai sensi del successivo art. 9 e dei documenti di pagamento, nonché di accedere agli avvisi di
                avvenuta ricezione non consegnati.<br/>
                Tale modalità tramite Poste Italiane S.p.A. necessita, oltre che di avere l’avviso di avvenuta
                ricezione, anche di identificare di persona il destinatario a mezzo di un documento di riconoscimento e
                del codice fiscale oppure, in caso di delega, verrà identificato di persona il delegato per cui si
                aggiungono ai documenti richiesti per il destinatario anche gli stessi per il delegato.<br/>
                2.4 E’ possibile acquisire la copia analogica dei documenti di cui al punto 2.3 sia per il destinatario,
                sia per il delegato, dotati di SPID o CIE, direttamente allo sportello di FSU.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">3. Delega per l’accesso - autodichiarazione della persona di
                fiducia</Typography>
              <Typography variant="body1">
                3.1 I destinatari, possono conferire, tramite delega, a soggetti terzi il potere di accedere alla
                Piattaforma per reperire, consultare e acquisire, per loro conto, i documenti informatici oggetto di
                notifica.<br/>
                3.2 La delega conferita contiene nome, cognome e codice fiscale del delegato, e può essere conferita per
                tutte o anche soltanto per alcune specifiche Pubbliche Amministrazioni. A tal fine, la Piattaforma
                elabora un codice di accettazione della delega da comunicare al delegato, che viene da quest’ultimo
                utilizzato per accettare la stessa.<br/>
                3.3 Tu puoi revocare la delega già conferita in qualunque momento tramite la Piattaforma, così come il
                delegato sempre tramite Piattaforma ha la facoltà di rinunciare in ogni tempo alla delega ricevuta.<br/>
                3.4 La Piattaforma mette ogni mese a disposizione un promemoria delle sole deleghe attive e consente al
                delegante di monitorare ogni accesso effettuato dal delegato.<br/>
                3.5 E’ inoltre per Te possibile far accedere presso l’FSU una persona di fiducia ai Tuoi documenti
                informatici oggetto di notifica. A tal fine la persona di fiducia dovrà presentare un’autodichiarazione
                ex art. 46 del DPR 28.12.2000, n. 445, attestante l’incarico da Te ricevuto.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">4. Elezione domicilio digitale e invio digitale</Typography>
              <Typography variant="body1">
                4.1 Accedendo alla Piattaforma i documenti informatici oggetto di notifica potranno essere inoltrati al
                Tuo domicilio digitale, quale quello di piattaforma (se eletto direttamente presso la Piattaforma),
                quello speciale (se eletto direttamente presso la Pubblica Amministrazione) o quello generale (se
                presente in un elenco pubblico previsto dalla legge).<br/>
                4.2 Qualora Tu non abbia mai eletto un domicilio digitale e Tu non sia neppure un soggetto iscritto ad
                un albo professionale (es. avvocato, commercialista, ecc.) o comunque iscritto ad un registro nazionale
                in cui la Tua PEC è resa pubblica, puoi eleggere un domicilio digitale di Piattaforma; in tal caso,
                accedi alla Piattaforma e indica il corrispondente indirizzo, che verrà utilizzato dalla Società quale
                gestore della Piattaforma per il recapito dei tuoi documenti informatici oggetto di notifica da parte di
                ogni Pubblica Amministrazione tempo per tempo utilizzatrice della Piattaforma, senza eccezione alcuna in
                coerenza con quanto indicato al successivo punto 4.6 e salvo quanto previsto al successivo punto
                4.5.<br/>
                4.3 Qualora Tu non abbia eletto presso la Pubblica Amministrazione un domicilio digitale speciale, ma Tu
                sia invece un soggetto iscritto ad un albo professionale (es. avvocato, commercialista, ecc.) o comunque
                iscritto ad un registro nazionale in cui la PEC è resa pubblica, la Piattaforma - attraverso il Tuo
                codice fiscale - verifica l’esistenza di tale indirizzo PEC e lo utilizza in autonomia per inviarti i
                documenti informatici oggetto di notifica.<br/>
                4.4 Se avendo Tu un domicilio digitale speciale e/o un domicilio generale preferisci che le Pubbliche
                Amministrazioni utilizzatrici della Piattaforma usino un Tuo diverso domicilio digitale puoi eleggere un
                domicilio digitale di Piattaforma; in tal caso, accedi alla Piattaforma e indica il corrispondente
                indirizzo, che verrà utilizzato dalla Piattaforma in via prioritaria per il recapito dei Tuoi documenti
                informatici oggetto di notifica.<br/>
                4.5 Ricorda che Tu hai anche la facoltà di indicare dei domicili digitali di Piattaforma diversificati
                in relazione alle varie Pubbliche Amministrazioni (mittenti), ma senza distinzione o limitazione alcuna
                in base a specifici atti e/o affari.<br/>
                4.6 Nel caso in cui Tu abbia indicato un solo domicilio digitale di Piattaforma, tale indirizzo verrà
                utilizzato per l’invio dei Tuoi documenti informatici oggetto di notifica da parte di tutte le Pubbliche
                Amministrazioni, sempre senza distinzione o limitazione alcuna in base a specifici atti e/o affari.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">5. Elezione domicilio digitale e invio digitale</Typography>
              <Typography variant="body1">
                5.1 Se hai eletto un domicilio digitale di Piattaforma, a prescindere che tale domicilio sia stato da Te
                eletto per un numero ristretto di Pubbliche Amministrazioni o per tutte le Pubbliche Amministrazione
                utilizzatrici della Piattaforma, per le notificazioni digitali nei Tuoi confronti gli eventuali diversi
                domicili (quello generale presente in un elenco pubblico, ad esempio quello iscritto nel Tuo albo
                professionale di appartenenza ovvero quello eletto presso la singola Pubblica Amministrazione mittente)
                verranno utilizzati laddove l’invio al Tuo domicilio digitale di Piattaforma risulti saturo, invalido,
                inattivo, la Piattaforma è chiamata a tentare - decorsi 7 giorni dal primo invio - un secondo invio
                digitale, utilizzando tutti i Tuoi domicili digitali disponibili, in aggiunta a quello di
                Piattaforma.<br/>
                5.2 Pertanto, fai attenzione: controlla che il Tuo indirizzo pec che hai inserito come Tuo domicilio
                eletto o comunque che risulta presente in un elenco pubblico previsto dalla legge non sia sia saturo o
                comunque verificane la sua operatività poiché potrebbe essere pregiudicata la ricezione in via digitale
                delle notifiche nei Tuoi confronti con ogni possibile aggravio di costi per la notifica.<br/>
                5.3 Infatti, se il domicilio digitale risulti essere, saturo, invalido e/o inattivo, riceverai il
                documento oggetto di notifica in modalità analogica e la Piattaforma Ti darà evidenza di ciò con un
                avviso di mancato recapito disponibile nella Tua area riservata, proprio per informarti del fatto che la
                notifica procederà in via analogica.<br/>
                5.4 Riceverai, infatti, a mezzo raccomandata semplice la notizia della notifica processata nei Tuoi
                confronti.<br/>
                5.5 Si procede secondo quanto descritto ai punti precedenti, ogni qualvolta la Piattaforma debba
                processare una notifica nei confronti di un Utente che abbia una pluralità di domicili digitali e
                risulti saturo, invalido e/o inattivo il domicilio digitale eletto dall’Utente.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">6. Recapito digitale e avviso di cortesia</Typography>
              <Typography variant="body1">
                6.1 Tramite la Piattaforma gli Utenti possono censire dei canali di comunicazione diversi dal domicilio
                digitale, ad esempio, un numero di telefono cellulare o una e-mail ovvero usufruire del servizio di
                messaggistica dell’app IO (di seguito <b>“Recapiti digitali”</b>), presso i quali ricevere gli avvisi di
                cortesia.<br/>
                6.2. Gli avvisi di cortesia vengono inviati su tutti i Recapiti digitali disponibili.<br/>
                6.3 Ai fini del censimento dei Recapiti digitali riceverai sugli stessi un messaggio per validare
                l’inserimento dei Recapiti Digitali diversi dall’app IO.<br/>
                6.4 Se sei già un utente dell’app IO e hai già attivo il servizio di messaggistica la Piattaforma
                utilizzerà tale canale per inviarti gli avvisi di cortesia, salvo la Tua facoltà di indicare altri
                Recapito Digitali come indicato al punto 5.1.<br/>
                6.5 Tali avvisi di cortesia, pur non avendo di per sé valore legale, Ti permettono di accedere tramite
                link ai documenti informatici oggetto di notifica, anche prima di aver ricevuto la notifica e Ti
                consentono di perfezionare la notifica attraverso l’accesso alla Tua area riservata con ogni possibile
                risparmio in termini di tempo e di spese di notificazione.<br/>
                6.6 Fai però attenzione, poiché se decorsi 7 giorni solari dalla data in cui il documento informatico
                oggetto di notificazione è reso disponibile sulla Piattaforma, Tu non hai avuto accesso alla Tua area
                riservata della Piattaforma, - per ottenere il perfezionamento della notifica nei Tuoi confronti - il
                gestore della Piattaforma richiede all’addetto al recapito di provvedere alla notifica dell’avviso di
                avvenuta ricezione in formato cartaceo, a mezzo posta, tramite raccomandata con ricevuta di ritorno
                ovvero con le modalità previste dalla legge 20 novembre 1982, n. 890, con ogni possibile aggravio di
                costi di notifica a Tuo carico (cfr. paragrafo 7).<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">7. Notificazione in modalità analogica</Typography>
              <Typography variant="body1">
                7.1 Se non hai nessun domicilio digitale (cfr. paragrafo 4) e/o non hai perfezionato la notifica
                accedendo alla Tua area riservata della Piattaforma, anche a seguito della ricezione di un un avviso di
                cortesia (cfr. paragrafo 5), la notifica nei Tuoi confronti deve essere processata in modalità analogica
                attraverso l’invio cartaceo dell’avviso di avvenuta ricezione, con ogni possibile aggravio di costi di
                notifica a Tuo carico.<br/>
                7.2 Tale avviso, Ti verrà inviato tramite raccomandata con ricevuta di ritorno ovvero con le modalità
                previste dalla legge 20 novembre 1982, n. 890,<br/>
                7.3 Qualora l’Utente risultasse irreperibile nel corso dei tentativi di spedizione, l’Utente potrà
                comunque acquisire il documento informatico oggetto di notificazione (cfr. par. 2.3).<br/>
                7.4 Qualora Tu volessi maggiori dettagli sulla spedizione analogica rispetto a quelli resi disponibili
                nella Tua area riservata della Piattaforma, devi rivolgerti all’addetto al recapito di riferimento della
                spedizione.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">8. Costi e Spese di notificazione</Typography>
              <Typography variant="body1">
                8.1 L’utilizzo della Piattaforma non prevede alcun corrispettivo da parte degli Utenti nei confronti
                della Società.<br/>
                8.2 Tuttavia la Pubblica Amministrazione che esegue la notifica ha diritto di richiederTi il rimborso
                delle spese di notifica da essa sostenute.<br/>
                8.3 I costi del servizio sono quelli indicati nel Decreto Costi agli articoli 3 e 4.<br/>
                8.4 Resta inteso che, oltre alle spese di notifica, potrà altresì esserTi richiesto l’importo
                eventualmente previsto nell’atto notificato.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">9. Assistenza all’Utente e malfunzionamenti della
                Piattaforma</Typography>
              <Typography variant="body1">
                9.1 In Piattaforma è reso altresì disponibile un servizio di assistenza per la risoluzione di ogni
                eventuale anomalia ovvero per ogni richiesta di informazione, chiarimento e/o approfondimento
                sull’operatività e sulle funzionalità della Piattaforma stessa o per segnalazioni relative
                all’accessibilità.<br/>
                9.2 Fai attenzione: ricorda di utilizzare il servizio di assistenza disponibile sulla Piattaforma anche
                per segnalare problemi o anomalie nella visualizzazione dei documenti digitali oggetto di notificazione
                e/o dei relativi allegati. Ti ricordiamo, infatti, che la notifica si perfeziona nei Tuoi confronti
                anche laddove esistessero dei problemi o anomalie nella visualizzazione dei documenti che non siano
                collegati ad un malfunzionamento della piattaforma.<br/>
                9.3 I malfunzionamenti, ovvero i possibili disservizi della Piattaforma, sono segnalati sul Sito e con
                le stesse modalità la Società comunica il ripristino della funzionalità della stessa.<br/>
                9.4 Tramite la Piattaforma sono resi disponibili gli atti opponibili ai terzi, ovvero le attestazioni
                relative al periodo di malfunzionamento della Piattaforma e quelle relative alla data di ripristino
                delle funzionalità della stessa (cfr. par. 1.5).<br/>
                9.5 Puoi segnalare un malfunzionamento al servizio di assistenza il quale provvede, nel caso lo stesso
                non sia già stato individuato attraverso i sistemi di monitoraggio automatico, a gestire lo stesso.<br/>
                9.6 La Società, durante il periodo di malfunzionamento, non è tenuta a fornire alcun tipo di assistenza
                diverso o ulteriore rispetto a quanto indicato nel presente articolo.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">10. Responsabilità e obblighi dell’Utente</Typography>
              <Typography variant="body1" component="span">
                10.1 Utilizzando la Piattaforma, accetti i termini e le condizioni dei presenti ToS e ti impegni a
                rispettarli in ogni momento. Puoi utilizzare la Piattaforma esclusivamente per gli scopi autorizzati dai
                presenti ToS e in conformità alla legge applicabile.<br/>
                10. 2 Ti impegni, in particolare, a non utilizzare, direttamente o indirettamente, la Piattaforma:<br/>
                <ul style={{listStyle: "lower-roman"}}>
                  <li>sfruttando l’identità di un’altra persona o ricorrendo all’utilizzo non personale delle
                    funzionalità della Piattaforma, salvo quando eventualmente ed espressamente previsto dai presenti
                    ToS;
                  </li>
                  <li>per comunicare dati o informazioni false, ingannevoli o illecite;</li>
                  <li>per trasmettere virus, malware o altri codici dannosi per qualsivoglia dispositivo o sistema;</li>
                  <li>in violazione dei diritti della Società o di terzi;</li>
                  <li>per finalità o scopi commerciali;</li>
                  <li>in modo illecito, diffamatorio, osceno, volgare, intimidatorio, offensivo nei confronti della
                    Società o di terzi o contrario a norme imperative, all’ordine pubblico e al buon costume;
                  </li>
                </ul>
                per trasmettere comunicazioni illecite o non autorizzate, quali messaggi massivi, spam o messaggi
                automatici.
                10.3 Ogni attività effettuata sulla Piattaforma dagli Utenti è eseguita in nome proprio e con ogni
                conseguenza ai fini di legge, anche in merito ad eventuali responsabilità per eventuali perdite o danni
                subiti dalla Società o da terzi in caso di violazioni dei presenti ToS, nonché dell’utilizzo improprio o
                illecito della Piattaforma.<br/>
                10.4 La Società può adottare autonomamente tutte le misure necessarie, inclusa la sospensione o
                l’interruzione dei servizi erogati dalla Piattaforma e/o inibendo l’utilizzo della stessa da parte
                dell’Utente, qualora ne faccia un utilizzo illecito o altrimenti vietato, oppure commetta una violazione
                sostanziale o reiterata dei presenti ToS.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">11. Esclusioni e limitazione di responsabilità della
                Società</Typography>
              <Typography variant="body1">
                11.1 Sei il solo responsabile dei dati inseriti per accedere alla Piattaforma.<br/>
                11.2 In considerazione di quanto precisato, la Società è responsabile unicamente del corretto
                funzionamento dei Servizi erogati tramite la Piattaforma, fatte salve le responsabilità in capo a
                soggetti terzi, quali ad esempio l’addetto al recapito o FSU, per le attività di rispettiva
                competenza.<br/>
                11.3 La Società non potrà quindi essere considerata responsabile per nessun danno, perdita, pregiudizio,
                che dovesse derivare dall’utilizzo della Piattaforma per attività non di sua competenza ai sensi del
                Decreto e del Decreto Funzionamento.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">12. Privacy</Typography>
              <Typography variant="body1">
                12.1 Per utilizzare la Piattaforma è necessario, prima di accedere alla stessa, prendere visione
                dell’Informativa sul trattamento dei dati personali.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">13. Modifiche ai ToS </Typography>
              <Typography variant="body1">
                13.1 La Società si riserva il diritto di modificare, anche in forza di nuove previsioni di legge, in
                qualsiasi momento e anche senza preavviso, in tutto o in parte, i presenti ToS, dandone adeguata
                pubblicità all’Utente.<br/>
                13.2 Nuovi Termini e Condizioni saranno efficaci a far data dalla pubblicazione sul Sito, e non saranno
                mai applicati retroattivamente.<br/>
                13.3 Resta inteso che l’utilizzo della Piattaforma o dei Servizi in seguito all’entrata in vigore delle
                modifiche ai ToS comporta l’accettazione dei medesimi da parte dell’Utente.<br/>
                13.4 L’eventuale nullità, annullabilità o inefficacia di una o più clausole dei ToS non si estende alle
                altre clausole, che ove possibile conservano validità.<br/>
                13.5 Se non intendi accettare le modifiche apportate ai presenti ToS, come unico rimedio, potrai, in
                qualsiasi momento, senza alcun preavviso, cessare l’utilizzo della Piattaforma stessa.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">14. Legge applicabile e foro competente</Typography>
              <Typography variant="body1">
                14.1 I presenti ToS sono regolati dalla legge italiana.<br/>
                14.2 Ogni controversia che dovesse insorgere tra l’Utente e la Società in relazione ai presenti ToS e/o
                alla Piattaforma sarà di competenza esclusiva del foro di Roma oppure del giudice del luogo di residenza
                o domicilio dell’Utente, ove qualificato come consumatore ai sensi del D.lgs. 206/2005.<br/>
              </Typography>
              <br/>
              <Typography variant="body1">
                Ai sensi degli articoli 1341 e 1342 del codice civile, proseguendo l’Utente dichiara espressamente di
                aver letto, compreso e accettato i seguenti articoli dei presenti termini e condizioni
                d’uso: <b>(8)</b> Costi e Spese; <b>(9)</b> Assistenza all’Utente e malfunzionamenti della
                Piattaforma; <b>10)z</b> Responsabilità e obblighi dell’Utente; <b>(11)</b> Esclusioni e limitazione di
                responsabilità della Società; <b>(13)</b> Modifiche ai ToS e <b>(14)</b> Legge applicabile e foro
                competente.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box mt={2}>
          <Accordion expanded={privacyExpanded} onChange={handlePrivacy}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              aria-controls="privacy-content"
              id="privacy-accordion-summary"
            >
              <Typography variant="h6">Informativa sul trattamento dei dati personali</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                La presente informativa, resa ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679 (di seguito
                il <b>“Regolamento”</b> o <b>“GDPR”</b>), descrive le modalità del trattamento dei dati personali degli
                utenti destinatari delle notifiche, dei soggetti da essi delegati e delle persone di loro fiducia (di
                seguito <b>“Interessato/i”</b> o genericamente <b>“Utente/i”</b>) che aderiscono alla piattaforma
                tramite la quale le pubbliche amministrazioni aderenti (<b>“Pubbliche Amministrazioni”</b>) notificano
                atti, avvisi e comunicazioni (di seguito <b>“Piattaforma”</b>) gestita da PagoPA S.p.A. (di seguito
                anche <b>“Titolare”</b> o <b>“Società”</b>) ai sensi dell’art. 26 del decreto-legge n. 76 del 17 luglio
                2020 come convertito, con modificazioni, dalla legge 11 settembre 2020, n. 120 e come altresì modificato
                dal decreto-legge. n. 77 del 31 maggio 2021, così come convertito dalla legge 29 luglio 2021 n. 108, e
                raggiungibile all’indirizzo web: <Link href="https://pn.pagopa.it">https://pn.pagopa.it</Link>. (di
                seguito il <b>“Sito”</b>).
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                La validità dell’informativa contenuta nella presente pagina è limitata alla sola Piattaforma e non si
                estende ad altri siti web eventualmente consultabili mediante collegamento ipertestuale.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                <u>Le informative sul trattamento dei dati personali effettuati dalle Pubbliche Amministrazioni mittenti
                  possono essere rinvenute ai seguenti link:</u><br/>
                <Link href="https://selfcare.notifichedigitali.it/privacy-tos">Comune di Milano</Link>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Titolare del trattamento dei dati e base giuridica
              </Typography>
              <Typography variant="body1">
                Il Titolare del trattamento è PagoPA S.p.A., con sede in Roma, Piazza Colonna 370, CAP - 00187, n. di
                iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009.<br/>
                E-mail: <Link href="mailto:info@pagopa.it">info@pagopa.it.</Link><br/>
                La Società tratta i dati personali in qualità di Titolare del trattamento sulla base dell’esercizio del
                compito di interesse pubblico di cui all’art. 6, comma 1, lett. e), del GDPR riguardante, in
                particolare, la progettazione, la gestione e lo sviluppo della Piattaforma.<br/>
                Per ogni domanda inerente il trattamento di dati personali si prega di scrivere utilizzando il <Link
                href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">form</Link> dedicato
                alla gestione delle richieste degli interessati.<br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Data protection officer (DPO) o Responsabile Protezione Dati (RPD)
              </Typography>
              <Typography variant="body1">
                PagoPA S.p.A. ha nominato un proprio Responsabile della Protezione dei dati, ai sensi dell’art. 37 del
                Regolamento, che può essere contattato tramite il presente <Link
                href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">form</Link> di
                contatto. Il form è altresì disponibile sul sito web della Società nella sezione “Diritto alla
                protezione dei dati personali”.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Categorie di soggetti ai quali i dati personali possono essere comunicati e finalità della comunicazione
              </Typography>
              <Typography variant="body1" component="span">
                La Società potrà comunicare alcuni dati personali a soggetti terzi dei quali si avvale per lo
                svolgimento di attività connesse alla gestione della Piattaforma.<br/>
                In particolare, i dati personali potranno essere comunicati a società esterne che offrono alla Società
                taluni servizi e ai soggetti cui la comunicazione sia dovuta in forza di obblighi di legge. I suddetti
                soggetti potranno trattare i dati in qualità di responsabili per conto della Società o di titolari
                autonomi nel rispetto delle disposizioni di legge.<br/>
                L’elenco completo dei responsabili del trattamento può essere richiesto alla Società scrivendo sul <Link
                href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">form</Link> di
                contatto presente nella sezione “Diritto alla protezione dei dati personali” del <Link
                href="https://www.pagopa.it/it/">sito web</Link> della Società.<br/>
                Non è prevista alcuna forma di diffusione dei dati personali a soggetti indeterminati.<br/>
                Alcuni dei responsabili del trattamento di cui la Società si avvale vengono elencati, a titolo
                esemplificativo, di seguito:<br/>
                <ul>
                  <li><u>Fornitore del servizio universale (di seguito “FSU”) ovvero Poste Italiane S.p.A.</u>, con sede
                    legale in Roma, Viale Europa n. 190, Codice Fiscale e numero di iscrizione al Registro delle Imprese
                    di Roma 97103880585/1996, P.IVA 01114601006. Il DPO è reperibile presso l’ufficio del Responsabile
                    della Protezione dei Dati di Poste Italiane, in viale Europa, 175 - 00144 Roma,
                    ufficiorpd@posteitaliane.it;
                  </li>
                  <li><u>Amazon Web Services EMEA SARL</u> - indirizzo: 38 Avenue John F. Kennedy, L-1855 Lussemburgo.
                    Il responsabile per la protezione dei dati può essere contattato al seguente indirizzo:
                    aws-EU-privacy@amazon.com;
                  </li>
                  <li><u>OneTrust Technology Limited</u> - per la gestione delle richieste degli interessati, con sede
                    in 82 St John Street, London, England, EC1M 4JN, n. di iscrizione al Registro Imprese Great England
                    and Wales n. 04156317. Gli interessati possono contattare il responsabile della protezione dei dati
                    scrivendo all’indirizzo e-mail: <Link href="mailto:dpo@onetrust.com">dpo@onetrust.com.</Link></li>
                </ul>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Dati personali trattati e finalità del trattamento
              </Typography>
              <Typography variant="body1" component="span">
                <u>1. Ai fini dell’accesso e gestione delle preferenze di Piattaforma da parte delle persone
                  fisiche.</u><br/>
                <u>1.1 La Società, al fine di identificare univocamente ogni Utente che accede alla Piattaforma, tratta
                  i seguenti dati:</u>
                <ul>
                  <li>dati acquisiti a mezzo SPID/SPID Professionale o CIE quali nome, cognome e codice fiscale;</li>
                  <li>token identificativo e ID utente generato all’accesso alla Piattaforma con SPID/SPID
                    Professionale/CIE;
                  </li>
                </ul>
                <u>1.2 Con riferimento invece alla gestione delle preferenze, e dunque anche al conferimento delle
                  deleghe, la Società tratta i seguenti dati: </u>
                <ul>
                  <li>Dati acquisiti a mezzo SPID/SPID Professionale o CIE quali nome, cognome e codice fiscale del
                    destinatario e dell’eventuale delegato;
                  </li>
                  <li>rimozione o modifica dei delegati e relativi dati di quest’ultimo quali: nome, cognome, codice
                    fiscale, recapito digitale;
                  </li>
                  <li>data di scadenza della delega;</li>
                  <li>recapiti digitali e codici di conferma a 5 cifre per la validazione del recapito digitale;</li>
                  <li>codice di accettazione della delega trasmesso al delegato al destinatario con mezzi e modalità che
                    desidera;
                  </li>
                  <li>domicilio generale di piattaforma.</li>
                </ul>
              </Typography>
              <Typography variant="body1" component="span">
                <u>2. Per l’invio della notifica digitale la Società tratta i seguenti dati del destinatario:</u>
                <ul>
                  <li>codice fiscale per l’interrogazione sui registri nazionali delle PEC ai fini dell’acquisizione del
                    domicilio digitale generale;
                  </li>
                  <li>domicilio di piattaforma se il destinatario ha eletto tale domicilio all’atto della autenticazione
                    in Piattaforma come primo domicilio di invio;
                  </li>
                  <li>domicilio speciale se la Pubblica Amministrazione lo ha comunicato alla Società all’atto della
                    trasmissione degli atti oggetto di notifica;
                  </li>
                  <li>atti oggetto di notifica e documenti relativi al pagamento e avviso di avvenuta ricezione
                    (contenente a titolo esemplificativo i seguenti dati: pubblica amministrazione mittente, data e ora
                    di messa a disposizione dell’atto in Piattaforma; nome, cognome e codice fiscale; oggetto della
                    notifica, ovvero causale/titolo dell’avviso/atto/provvedimento/comunicazione; codice IUN; relativo
                    atto opponibile ai terzi generato dall’invio della notifica.
                  </li>
                </ul>
              </Typography>
              <Typography variant="body1" component="span">
                <u>3. Nel caso in cui un destinatario non possa accedere alla Piattaforma per propria scelta o perché
                  non in possesso di identità digitale, la Società mette a disposizione dello stesso una modalità
                  diversificata di accesso alla Piattaforma che prevede che l’Utente possa recarsi presso il FSU e
                  procedere alla configurazione di tale accesso semplificato (richiesta OTP). A tal fine la Società
                  tratta i seguenti dati:</u>
                <ul>
                  <li>recapito digitale, ovvero e-mail, cellulare e app IO, associato al codice fiscale del
                    destinatario;
                  </li>
                  <li>estremi del documento di riconoscimento degli Utenti;</li>
                  <li>delega e relativa firma in esso contenuta, nonché relativa copia conforme;</li>
                  <li>indirizzo fisico degli Utenti;</li>
                  <li>nome, cognome e codice fiscale del destinatario;</li>
                  <li>OTP, ovvero una password di identificazione temporanea trasmessa su uno dei recapiti digitali
                    censiti per l’abilitazione all’accesso semplificato.
                  </li>
                </ul>
                3.1 Tale accesso semplificato, protetto e temporaneo è altresì disponibile all’Utente che si identifica
                attraverso <u>SPID/SPID Professionale o CIE (e dunque senza necessità di OTP)</u>. A tal fine la Società
                tratta, oltre a quanto sopra e ad esclusione dell’OTP, anche i seguenti dati:
                <ul>
                  <li>dati acquisiti a mezzo SPID/SPID Professionale o CIE quali nome, cognome, codice fiscale degli
                    Utenti.
                  </li>
                </ul>
                <strong>Nel caso in cui Tu stia inserendo dati personali di terzi, ti invitiamo ad ottenere specifica
                  autorizzazione a procedere da parte di tale soggetto, al fine di non commettere un trattamento
                  illecito.</strong>
                <br/>
              </Typography>
              <br/>
              <Typography variant="body1">
                <u>4. Con riferimento alla raccolta dei dati relativi alla gestione delle preferenze di navigazione per
                  l’ottimizzazione della Piattaforma, e al tracciamento dei log di sistema/funzionamento e di accesso
                  per garantire la sicurezza della Piattaforma</u>, la Società sui i sistemi informatici preposti al
                funzionamento della Piattaforma acquisisce, nel corso del loro normale esercizio, alcuni dati personali
                la cui trasmissione è implicita nell’uso dei protocolli di comunicazione di Internet. In questa
                categoria di dati rientrano gli indirizzi IP o i nomi a dominio dispositivi utilizzati dagli Utenti, gli
                indirizzi in notazione URI/URL (Uniform Resource Identifier/Locator) delle risorse richieste, l’orario
                della richiesta, il tipo di richiesta effettuata (risorsa richiesta e nome dell’operazione), il metodo
                utilizzato nel sottoporre la richiesta al server, la dimensione del file ottenuto in risposta, il codice
                numerico indicante lo stato della risposta data dal server (buon fine, errore, ecc.) ed altri parametri
                relativi al sistema operativo e all’ambiente informatico dell’Utente. A ciascun Utente, i sistemi della
                Piattaforma attribuiscono un codice identificativo univoco associato all’account e conservato nei log,
                nonché un token di sessione. Tali dati, necessari per la fruizione delle funzionalità della Piattaforma,
                vengono anche trattati allo scopo di controllare il corretto funzionamento dei sistemi e dei servizi
                offerti dalla Piattaforma (diagnostica), nonché per motivi di sicurezza.
              </Typography>
              <br/>
              <Typography variant="body1">
                <strong>
                  Inoltre, la totalità dei dati personali trattati possono essere utilizzati dal Titolare del
                  trattamento in giudizio o nelle fasi propedeutiche alla sua eventuale instaurazione per la difesa da
                  abusi perpetrati dall’Utente.
                </strong>
              </Typography>
              <Typography variant="body1">
                I dati personali degli Utenti sono trattati adottando adeguate misure di sicurezza volte ad impedire
                l’accesso, la divulgazione, la modifica o la distruzione non autorizzata dei dati personali. Tutti i
                dipendenti della Società che hanno accesso ai dati personali sono debitamente designati quali soggetti
                autorizzati al trattamento e ciascuno di essi è incaricato di trattare unicamente i dati strettamente
                necessari allo svolgimento delle proprie mansioni lavorative. Il trattamento è effettuato
                prevalentemente mediante strumenti informatici, con modalità organizzative e logiche strettamente
                correlate alle finalità sopra indicate. Oltre al Titolare, in alcuni casi, possono avere accesso ai
                dati, a seguito di comunicazione da parte dello stesso, anche ulteriori soggetti coinvolti nella
                gestione e l’erogazione dei servizi offerti tramite la Piattaforma, nominati, ove necessario, quali
                responsabili del trattamento ai sensi dell’art. 28 del Regolamento. Tali soggetti trattano i dati
                esclusivamente per attività funzionali o comunque strettamente connesse allo svolgimento del Servizio.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Categorie di destinatari dei dati
              </Typography>
              <Typography variant="body1" component="span">
                Il Titolare, nello svolgimento delle proprie attività, ha la facoltà di trasmettere, eventualmente e su
                richiesta, i dati alle seguenti categorie di destinatari:
                <ul>
                  <li>responsabili del trattamento quali fornitori di servizi;</li>
                  <li>altri soggetti pubblici o privati che ne facciano richiesta per l’esecuzione di un compito di
                    interesse pubblico o connesso all’esercizio di un pubblico potere o per adempiere a un obbligo
                    legale o contrattuale.
                  </li>
                </ul>
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Tempi di conservazione dei dati
              </Typography>
              <Typography variant="body1">
                I dati personali relativi agli Utenti sono trattati per il tempo strettamente necessario al
                perseguimento delle finalità per le quali sono stati raccolti. Nel rispetto dei principi di
                proporzionalità e necessità, i dati non sono conservati per periodi più lunghi rispetto a quelli
                indispensabili alla realizzazione delle finalità sopra indicate e dunque al diligente svolgimento delle
                attività.
              </Typography>
              <br/>
              <Typography variant="body1" component="span">
                Di seguito alcuni dei tempi di conservazione stabiliti:
                <ul>
                  <li>i log di accesso a mezzo SPID/SPID Professionale e CIE: 2 anni;</li>
                  <li>i log di funzionamento ovvero log di sistema: 3 anni;</li>
                  <li>gli audit log diversi da quelli specifici sugli atti opponibili ai terzi: 5 anni;</li>
                  <li>i dati di navigazione ovvero i record contenenti informazioni relativi a browser, IP e device
                    utilizzati durante le interazioni dell’Utente sulla Piattaforma: 90 giorni (nello specifico anche IP
                    di navigazione estratto dal log);
                  </li>
                  <li>il codice OTP (a 5 cifre): 1 ora;</li>
                  <li>codice di accettazione del recapito digitale (a 5 cifre): 1 ora.</li>
                </ul>
              </Typography>
              <Typography variant="body1" component="span">
                <ul>
                  <li>gli audit log specifici sugli atti opponibili ai terzi, le informazioni necessarie alla creazione
                    dei QR code e link HTML, a partire dalla data di perfezionamento della notifica;
                  </li>
                  <li>atto di delega scansionato/copia conforme per attivazione OTP (per 10 anni dalla richiesta).</li>
                </ul>
                Per maggiori informazioni è sempre disponibile il <Link
                href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">form</Link> dedicato
                alla gestione delle richieste degli interessati disponibile nella sezione “Diritto alla protezione dei
                dati personali” del sito internet della Società <Link
                href="https://www.pagopa.it/it/">https://www.pagopa.it/it/</Link>.
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Trasferimento transfrontaliero dei dati
              </Typography>
              <Typography variant="body1">
                I dati personali potranno essere trasferiti fuori dall’Unione Europea da parte di fornitori di servizi
                di cui la Società si avvale per attività connesse alla gestione della Piattaforma. Tale trasferimento,
                ove ricorra il caso, verrà disciplinato con i fornitori di servizi mediante il ricorso a clausole
                contrattuali standard adottate dalla Commissione europea con la decisione 2021/914/UE ed eventuali
                successive modifiche o, in alternativa, sulla base di una decisione di adeguatezza della Commissione e/o
                di ogni altro strumento consentito dalla normativa di riferimento. La lista dei fornitori coinvolti,
                comprensivi delle garanzie poste in essere, può essere richiesta in qualsiasi momento, utilizzando
                il <Link
                href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">form</Link> dedicato
                alla gestione delle richieste degli interessati disponibile nella sezione “Diritto alla protezione dei
                dati personali” del sito internet della Società <Link
                href="https://www.pagopa.it/it/">https://www.pagopa.it/it/</Link>.
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Diritti degli interessati
              </Typography>
              <Typography variant="body1">
                Gli Utenti, ai quali i dati personali si riferiscono, hanno il diritto di ottenere dalla Società, in
                qualità di Titolare del trattamento, l’accesso ai propri dati personali, l’aggiornamento,
                l’integrazione, la rettifica o, laddove previsto dalla legge e nei limiti previsti, la cancellazione
                degli stessi, la limitazione del trattamento e il diritto di opporsi allo stesso. Gli Utenti potranno,
                altresì, chiedere l’anonimizzazione dei dati o il blocco dei dati trattati in violazione di legge,
                compresi quelli di cui non è necessaria la conservazione in relazione agli scopi del trattamento.
                <br/>
                Le richieste dovranno essere inoltrate alla Società. Gli Interessati possono, altresì, contattare il
                Responsabile della protezione dei dati per tutte le questioni inerenti il trattamento dei propri dati
                personali e l’esercizio dei propri diritti, utilizzando il presente <Link
                href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">form</Link> dedicato
                alla gestione delle richieste degli interessati disponibile nella sezione “Diritto alla protezione dei
                dati personali” del sito internet della Società <Link
                href="https://www.pagopa.it/it/">https://www.pagopa.it/it/</Link>.
              </Typography>
              <br/>
              <Typography variant="body1">
                Gli Interessati che ritengano che il trattamento dei dati personali a loro riferiti, effettuato dal
                Titolare del trattamento, avvenga in violazione di quanto previsto dal Regolamento, hanno il diritto di
                proporre reclamo al Garante, come previsto dall’art. 77 del Regolamento stesso, o di adire le opportune
                sedi giudiziarie (art. 79 del Regolamento).
                <br/>
                Di seguito si trasmettono i dati di contatto ed i riferimenti dell’<b>Autorità di controllo - Garante
                per la protezione dei dati personali</b>
                <br/>
                Indirizzo e-mail: garante@gpdp.it
                <br/>
                Indirizzo PEC: protocollo@pec.gpdp.it
                <br/>
                Sito web: https://www.garanteprivacy.it
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Modifiche
              </Typography>
              <Typography variant="body1">
                Il Titolare si riserva il diritto di apportare alla presente Informativa, a propria esclusiva
                discrezione ed in qualunque momento, tutte le modifiche ritenute opportune o rese obbligatorie dalle
                norme di volta in volta vigenti, dandone adeguata pubblicità agli Utenti. In caso di mancata
                accettazione delle modifiche effettuate, si invitano gli Utenti a cessare l’utilizzo della Piattaforma e
                a chiedere alla Società la rimozione dei propri dati personali; salvo quanto diversamente specificato,
                la precedente versione dell’informativa continuerà ad applicarsi ai dati personali raccolti sino a quel
                momento.
              </Typography>
              <Typography variant="body1" fontWeight="bold" textAlign="center">
                Cookie policy
              </Typography>
              <Typography variant="body1" component="span">
                Il presente Avviso Cookie è parte della nostra Informativa sulla privacy. Per ulteriori informazioni su
                di noi, e su come proteggiamo informazioni degli Utenti, si prega di consultare la nostra Informativa
                sulla privacy.
                <br/><br/>
                Il Sito utilizza cookie tecnici di navigazione o di sessione che garantiscono la normale navigazione e
                fruizione del Sito (essi vengono memorizzati sul terminale dell’Utente sino alla chiusura del browser).
                Detti cookie sono utilizzati nella misura strettamente necessaria per rendere il servizio relativo alla
                Piattaforma. Essi garantiscono un’adeguata fruizione del Sito e consentono all’Utente di navigare e
                utilizzare servizi e opzioni. Il loro utilizzo esula da scopi ulteriori e tali cookie sono installati
                direttamente dal Titolare (rientrano, dunque, nella categoria di cookie di prima parte o proprietari)
                <br/><br/>
                Per l’installazione dei suddetti cookie non è richiesto il preventivo consenso degli Utenti, mentre
                resta fermo l’obbligo di dare l’informativa ai sensi dell’art. 13 del Regolamento e dell’art. 122 del D.
                Lgs. 196/2003 e ss.mm.ii. (“Codice Privacy”).
                <br/><br/>
                Il Sito presenta cookie di terze parti, creati e gestiti da soggetti diversi dal Titolare, e sui quali
                lo stesso non ha e non può avere alcun controllo. Nello specifico, l’unico cookie settato di terze parti
                è MixPanel utile per il tracciamento degli eventi di failure nelle operazioni, di cui viene richiesto
                preventivo consenso.
                <br/><br/>
                I cookie vengono conservati per un periodo non superiore a 6 mesi dal momento della raccolta, salvo che
                la loro ulteriore conservazione non si renda necessaria per l’accertamento di reati.
                <br/><br/>
                &Egrave; possibile gestire le preferenze relative ai cookie attraverso le opzioni fornite dal proprio
                browser e dal cookie banner nella sezione scopri di più dove potrai accettare o meno tutti o alcuni dei
                cookie presenti.
                <br/><br/>
                Di seguito invece le istruzioni rese disponibili dai relativi fornitori ai link di seguito indicati:
                <ul>
                  <li><Link
                    href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform=Desktop&hl=it">Chrome</Link>
                  </li>
                  <li><Link
                    href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie">Firefox</Link></li>
                  <li><Link href="https://support.apple.com/kb/ph19214?locale=it_IT">Safari</Link></li>
                  <li><Link
                    href="https://support.microsoft.com/it-it/help/17442/windows-internet-explorer-delete-manage-cookies">Internet
                    Explorer</Link></li>
                  <li><Link href="https://support.microsoft.com/it-it/help/4027947/windows-delete-cookies">Edge</Link>
                  </li>
                  <li><Link href="https://help.opera.com/en/latest/web-preferences/#cookies">Opera</Link></li>
                </ul>
                <Typography variant="body1">Data di ultimo aggiornamento: 20.07.2022</Typography>
                <br/>
                <Typography variant="body1">
                  I Tuoi feedback sono importanti per migliorare il Sito, anche sulle questioni privacy! Se qualcosa che
                  riguarda la Tua privacy non ti convince, non Ti è chiaro o ritieni che dovremmo agire diversamente,
                  scrivici utilizzando il <Link
                  href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">form</Link> dedicato
                  alla gestione delle richieste degli interessati.
                </Typography>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </>);
};

export default PrivacyTOSPage;