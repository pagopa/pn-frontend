import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box, Container,
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
        <Typography variant="h4">Portale back office “Area Riservata”</Typography>
        <Box mt={3}>
          <Accordion expanded={tosExpanded} onChange={handleTos}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              aria-controls="tos-content"
              id="tos-accordion-summary"
            >
              <Typography variant="h6">DOCUMENTO INFORMATIVO SUL TRATTAMENTO DEI DATI PERSONALI</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Il presente documento, reso anche ai sensi del Regolamento (UE) 2016/679 (di seguito il <b>“Regolamento”</b>
                o <b>“GDPR”</b>), descrive le modalità di trattamento dei dati personali degli utenti (di seguito
                <b>“Interessato/i”</b> o genericamente <b>“Utente/i”</b>) in Piattaforma Notifiche Digitali (di seguito
                <b>“Piattaforma”</b>) sia dalle pubbliche amministrazioni, ovvero le amministrazioni individuate
                dall’articolo 26, comma 2, lettera c), del decreto-legge n. 76 del 17 luglio 2020 come convertito,
                con modificazioni, dalla legge 11 settembre 2020, n. 120 e come altresì modificato dal decreto-legge. n.
                77 del 31 maggio 2021, così come convertito dalla legge 29 luglio 2021 n. 108 (di seguito anche <b>“PA
                Mittenti/e”</b>) che aderiscono alla Piattaforma prevista dall’art. 26 del medesimo decreto-legge e sia
                da PagoPA S.p.A. (di seguito anche <b>“Gestore della piattaforma”</b> o <b>“Società”</b>).<br/>
                Se stai leggendo questo documento, sei un Referente della PA Mittente ed accedi alla Piattaforma
                all’indirizzo web <Link href="https://pn.selfcare.pagopa.it">pn.selfcare.pagopa.it</Link> (di seguito il
                <b>“Sito”</b>) attraverso il portale di back office
                <b>“Area Riservata”</b> (di seguito anche il <b>“Portale”</b>) della Società, raggiungibile all’indirizzo
                web <Link href="https://selfcare.pagopa.it">https://selfcare.pagopa.it</Link>.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Gestore della piattaforma
              </Typography>
              <Typography variant="body1">
                Il Gestore della piattaforma è PagoPA S.p.A., con sede in Roma, Piazza Colonna 370, CAP - 00187, n. di
                iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009.
                <br/>
                E-mail: <Link href="mailto:info@pagopa.it">mailto:info@pagopa.it</Link>
                <br/>
                PagoPA S.p.A. ha nominato un proprio Responsabile della Protezione dei dati, ai sensi dell’art. 37 del
                Regolamento, che può essere contattato tramite il presente form di contatto. Il form è altresì
                disponibile sul sito web della Società ovvero www.pagopa.it nella sezione <i>“Diritto alla protezione
                dei dati personali”</i>.
                <br/>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">PA Mittente</Typography>
              <Typography variant="body1">
                Per qualsiasi informazione relativa alla PA Mittente si rinvia all’informativa privacy reperibile sul
                sito web della PA stessa.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Categorie di soggetti ai quali i dati personali possono essere comunicati e finalità della comunicazione
              </Typography>
              <Typography variant="body1" component="span">
                Nell’ambito delle attività di trattamento, potranno essere comunicati alcuni dati personali a soggetti
                terzi dei quali ci si avvale per lo svolgimento di attività connesse ad esempio alla gestione del Sito e
                del Portale.<br/>
                In particolare, i dati personali potranno essere comunicati a società esterne che offrono taluni servizi,
                nonché ai soggetti cui la comunicazione sia dovuta in forza di obblighi di legge.
                I suddetti soggetti potranno trattare i dati in qualità di responsabili o di titolari autonomi nel
                rispetto delle disposizioni di legge.<br/>
                L’elenco completo dei responsabili del trattamento può essere richiesto:
                <ul>
                  <li>alla Società, con riferimento ai responsabili della medesima, scrivendo sul
                    <Link href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">
                    form</Link> di contatto presente nella sezione “Diritto alla protezione dei dati personali” del
                    <Link href="https://www.pagopa.it/it/">sito web</Link> della Società;
                  </li>
                  <li>
                    alla PA Mittente, con riferimento ai responsabili della medesima, mediante l’utilizzo dei contatti
                    riportati nell’informativa reperibile sul sito web della PA stessa.
                  </li>
                </ul>
                In ogni caso non è prevista alcuna forma di diffusione dei dati personali a soggetti indeterminati.<br/>
                Alcuni dei responsabili del trattamento di cui la Società si avvale vengono elencati, a titolo
                esemplificativo, di seguito:
                <ul>
                  <li>
                    <u>Microsoft Ireland Operations, Ltd.</u> per l’infrastruttura tecnologica con sede in One Microsoft
                    Place South County Business Park Leopardstown Dublin 18, D18 P521, Ireland.<br/>
                    Gli interessati possono contattare il responsabile della protezione dei dati compilando il modulo web
                    in <Link href="https://aka.ms/privacyresponse">https://aka.ms/privacyresponse</Link>. È possibile
                    inoltre contattare il responsabile della protezione dei dati anche tramite posta: <i>Responsabile della
                    protezione dei dati di Microsoft EU - One Microsoft Place, South County Business Park, Leopardstown,
                    Dublino 18, D18 P521, Irlanda - Telefono: +353 (1) 706-3117</i>.
                  </li>
                  <li>
                    <u>OneTrust Technology Limited</u> per la gestione delle richieste degli interessati, con sede in 82
                    St John Street, London, England, EC1M 4JN, n. di iscrizione al Registro Imprese Great England and Wales
                    n. 04156317. Gli interessati possono contattare il responsabile della protezione dei dati scrivendo
                    all’indirizzo e-mail: <Link href="mailto:dpo@onetrust.com">dpo@onetrust.com</Link>.
                  </li>
                  <li><u>Amazon Web Services EMEA SARL</u> - indirizzo: 38 Avenue John F. Kennedy, L-1855 Lussemburgo.</li>
                  <li>
                    <u>Google Ireland Limited</u> - form di contatto per le richieste privacy:
                    <Link href="https://support.google.com/policies/answer/9581826?p=privpol_privts&hl=it&visit_id=637757635127050100-3270689575&rd=1">
                      https://support.google.com/policies/answer/9581826?p=privpol_privts&hl=it&visit_id=637757635127050100-3270689575&rd=1
                    </Link>
                  </li>
                </ul>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Dati personali trattati e finalità del trattamento
              </Typography>
              <Typography variant="body1">
                In aggiunta a quanto già riportato nell’informativa privacy e nei termini e condizioni relativi
                all’utilizzo del Portale, di seguito gli ulteriori dati personali trattati sul Sito, a titolo
                esemplificativo e non esaustivo:
                <ul>
                  <li>
                    notifica (ogni notifica riporta): PA Mittente; data e ora di messa a disposizione dell’atto in
                    Piattaforma; nome, cognome e codice fiscale dei destinatari; oggetto della notifica, ovvero
                    causale/titolo dell’avviso/atto/provvedimento/comunicazione. Inoltre, nella schermata di dettaglio
                    della notifica, oltre ai dati di cui sopra, sono presenti: atto notificato e relativi documenti
                    informatici (ad es. allegati all’atto notificato, F24 e avviso di pagamento pagoPA); codice IUN;
                    stato della notifica; evoluzione della notifica/storico del processo di notifica (che include atti
                    opponibili ai terzi e avvisi di mancato recapito); strumenti per visualizzare/scaricare l’atto
                    notificato (ad es. collegamento a pdf reader); informazioni di contatto della PA Mittente; IUV,
                    ovvero importo da pagare, disponibile anche mediante link per il pagamento diretto in piattaforma
                    pagoPA, ai fini della visione dello storico e dei dettagli delle notifiche per PA Mittente da parte
                    degli Utenti;
                  </li>
                  <li>
                    dati acquisiti a mezzo SPID/SPID Professionale o CIE per l’accesso alla Piattaforma quali nome,
                    cognome, codice fiscale e ruolo del Referente della PA Mittente; indicazione di nome, cognome e
                    codice fiscale del firmatario (rappresentante legale); firma nella lettera di de-registrazione del
                    rappresentante legale della PA Mittente; e-mail aziendale/istituzionale del firmatario della PA
                    Mittente; e-mail aziendale/istituzionale dell’Utente; nome, cognome ed e-mail degli incaricati
                    dell’ufficio legale della Società, ai fini della de-registrazione della PA Mittente dalla Piattaforma;
                  </li>
                  <li>
                    atto notificato e relativi documenti informatici (ad es. allegati all’atto notificato, F24 e avviso
                    di pagamento pagoPA) ai fini della conservazione a 120 giorni degli atti notificati dalla PA
                    Mittente, a prescindere dalla sua de-registrazione dalla Piattaforma;
                  </li>
                  <li>
                    dati acquisiti a mezzo SPID/SPID Professionale o CIE per l’accesso alla Piattaforma quali nome,
                    cognome, codice fiscale e ruolo; ruolo di Referente della PA Mittente, della persona giuridica se
                    libero professionista oppure degli operatori della persona giuridica, dei delegati, del personale
                    della Società (dipendenti/collaboratori) e del personale di terze parti coinvolte nel progetto;
                    e-mail aziendale/istituzionale, nome, cognome, codice fiscale e indicazione del ruolo del Referente
                    della PA Mittente come indicato nell’Accordo di Adesione; recapiti digitali; codice di accettazione
                    del recapito digitale; firma nell’Accordo di Adesione del rappresentante legale della PA Mittente;
                    codice OTP; firma nella lettera di de-registrazione del rappresentante legale della PA Mittente;
                    domicili digitali; e-mail aziendale/istituzionale del firmatario della PA Mittente; atto di delega
                    scansionato/copia conforme per la richiesta di attivazione dell’OTP; documento non incluso in una
                    notifica (erroneamente hashato); le informazioni acquisite dall’addetto al recapito postale in caso
                    di notificazione analogica, ovvero tutto ciò che il recapitista acquisisce, ad esempio: nuovo
                    indirizzo di residenza del destinatario, domicilio del destinatario, cartolina di ritorno della
                    notifica (ivi inclusa la firma del destinatario e dell’addetto al recapito postale); firma
                    dell’addetto al recapito postale sui plichi inesitati; documenti informatici non prodotti dalla PA
                    Mittente (ivi inclusi, quindi, i documenti oggetto degli atti opponibili ai terzi, i dati della
                    notifica contenuti nel dettaglio della notifica stessa e i log di funzionamento della Piattaforma,
                    ovvero ad esempio creazione notifiche, operazioni fatte dagli operatori/funzionari e dai destinatari
                    nell’iter di gestione della notifica, informazioni necessarie alla creazione del QR code e link HTML)
                    ai fini della conservazione dei dati;
                  </li>
                  <li>
                    dati acquisiti a mezzo SPID/SPID Professionale o CIE quali nome, cognome, codice fiscale e ruolo
                    dell’Utente; notifica depositata, contenente i seguenti dati: PA Mittente; nome, cognome e codice
                    fiscale dei destinatari; oggetto della notifica, ovvero causale/titolo
                    dell’avviso/atto/provvedimento/comunicazione; atto notificato e relativi documenti informatici
                    (ad es. allegati all’atto notificato, F24 e avviso di pagamento pagoPA); codice IUN; IUV, ovvero
                    importo da pagare, disponibile anche mediante link per il pagamento diretto in piattaforma pagoPA;
                    nome, cognome, codice fiscale e domicilio digitale speciale se esistente, nonché indirizzo fisico
                    del destinatario (quest’ultimo solo se dal medesimo comunicato alla PA Mittente); hash dei documenti
                    da notificare; relativo atto opponibile ai terzi generato dal deposito della notifica; numero di
                    protocollo ai fini del deposito delle notifiche dalla PA Mittente sulla Piattaforma;
                  </li>
                  <li>
                    codice fiscale del destinatario e domicilio digitale generale ai fini dell’interrogazione sui
                    registri nazionali delle PEC per l’acquisizione del domicilio digitale generale stesso;
                  </li>
                  <li>
                    domicilio digitale di piattaforma, speciale, generale; atti oggetto di notifica e documenti relativi
                    al pagamento; avviso di avvenuta ricezione contenente i seguenti dati: PA Mittente; data e ora di
                    messa a disposizione dell’atto in Piattaforma; nome, cognome e codice fiscale dei destinatari;
                    oggetto della notifica, ovvero causale/titolo dell’avviso/atto/provvedimento/comunicazione; codice
                    IUN; relativo atto opponibile ai terzi generato dall’invio della notifica, ai fini dell’invio
                    digitale della notifica;
                  </li>
                  <li>
                    recapito digitale e avviso di avvenuta ricezione ai fini dell’invio dell’avviso di cortesia;
                  </li>
                  <li>
                    dati acquisiti a mezzo SPID/SPID Professionale o CIE quali nome, cognome e codice fiscale del
                    destinatario e del suo eventuale delegato; IUN della notifica; IUV di pagamento indicato dalla PA
                    Mittente; F24 precompilato e avviso di pagamento pagoPA, ai fini della gestione dei pagamenti da
                    parte del destinatario (o suo delegato/operatore della persona giuridica);
                  </li>
                  <li>
                    codice fiscale dei destinatari; IUN della notifica; indirizzo PEC della PA Mittente, ai fini della
                    gestione delle spese di notificazione/rendiconto delle notificazioni;
                  </li>
                  <li>
                    dati di navigazione (browser, device type, ip address), ai fini della raccolta di dati di
                    navigazione per ottimizzazione della Piattaforma, nonché log di sistema/funzionamento e accesso;
                    codici fiscali pseudoanonimizzati all’interno dei record di log; token solo per gli Utenti della PA
                    Mittente, ai fini dell’auditing, ovvero del tracciamento dei log di sistema/funzionamento e di accesso;
                  </li>
                  <li>
                    dati di navigazione (browser, device type, ip address); atto opponibile ai terzi contenente
                    l’attestazione relativa al periodo di malfunzionamento; tracciato dei malfunzionamenti: data ed ora
                    inizio/fine dello stesso e tipologia, ai fini della gestione dei malfunzionamenti;
                  </li>
                </ul>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Modalità del trattamento
              </Typography>
              <Typography variant="body1">
                I dati personali degli Utenti sono trattati adottando adeguate misure di sicurezza volte ad impedire
                l’accesso, la divulgazione, la modifica o la distruzione non autorizzata dei dati personali. Tutti coloro
                che hanno accesso ai dati personali sono debitamente designati quali soggetti autorizzati al trattamento
                e ciascuno di essi è incaricato di trattare unicamente i dati strettamente necessari allo svolgimento
                delle proprie mansioni lavorative. Il trattamento è effettuato prevalentemente mediante strumenti
                informatici, con modalità organizzative e logiche strettamente correlate alle finalità sopra indicate.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                Categorie di destinatari dei dati
              </Typography>
              <Typography variant="body1" component="span">
                Nello svolgimento delle attività di trattamento e al fine di erogare i servizi, i dati personali
                potrebbero essere trasmessi alle seguenti categorie di destinatari:
                <ul>
                  <li>responsabili del trattamento quali fornitori di servizi;</li>
                  <li>
                    altri soggetti pubblici o privati che ne facciano richiesta per l’esecuzione di un compito di
                    interesse pubblico o connesso all’esercizio di un pubblico potere o per adempiere a un obbligo
                    legale o contrattuale.
                  </li>
                </ul>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">Tempi di conservazione dei dati</Typography>
              <Typography variant="body1" component="span">
                I dati personali relativi agli Utenti sono trattati per il tempo strettamente necessario al perseguimento
                delle finalità per le quali sono stati raccolti. Nel rispetto dei principi di proporzionalità e necessità,
                i dati non sono conservati per periodi più lunghi rispetto a quelli indispensabili alla realizzazione delle
                finalità sopra indicate e dunque al diligente svolgimento delle attività.<br/>
                Nello specifico si indicano di seguito i tempi di conservazione che il Gestore della piattaforma ha
                individuato a titolo esemplificativo e non esaustivo:
                <ul>
                  <li>
                    con riferimento alla conservazione dei documenti informatici non prodotti dalla PA Mittente (ivi
                    inclusi quindi i documenti oggetto degli atti opponibili ai terzi, i dati relativi alla notifica,
                    gli audit log specifici sugli atti opponibili ai terzi, le informazioni necessarie alla creazione
                    dei QR code e link HTML) e resi disponibili in Piattaforma, la Società a partire dalla data del
                    perfezionamento della notifica conserva copia sino a dieci anni ai sensi dell’art. 2946 c.c.
                    (prescrizione ordinaria) e nel pieno rispetto del Regolamento e del Decreto Legislativo 7 marzo 2005,
                    n. 82 (“CAD”) sulle modalità di conservazione dei documenti informatici, anche a fini probatori.
                  </li>
                </ul>
                Nel corso del periodo di conservazione sopra menzionato la Società garantisce l’accesso ai documenti alle
                PA Mittenti e ai destinatari, ivi inclusi i loro delegati, previa identificazione a mezzo SPID/SPID
                Professionale o CIE. Inoltre, la Società conserva:
                <ul>
                  <li>i log di accesso a mezzo SPID/SPID Professionale e CIE per 24 mesi;</li>
                  <li>i log di funzionamento di Piattaforma ovvero i log di sistema per 36 mesi;</li>
                  <li>gli audit log diversi da quelli specifici sugli atti opponibili ai terzi per 5 anni;</li>
                  <li>
                    i dati di navigazione, ovvero i record contenenti informazioni relativi a browser, IP e device
                    utilizzati durante le interazioni dell’Utente sulla Piattaforma per 90 giorni (nello specifico anche
                    IP di navigazione estratto dal log);
                  </li>
                  <li>i token sessione utente: 10 minuti;</li>
                  <li>
                    il documento erroneamente hashato (errato calcolo hash nel corso della trasmissione dalla PA Mittente
                    alla Piattaforma) per massimo 24 ore e poi successivamente eliminato definitivamente;
                  </li>
                  <li>codice di accettazione del recapito digitale (a 5 cifre) per 10 minuti;</li>
                  <li>il codice OTP (a 5 cifre) per 1 ora;</li>
                  <li>
                    i dati relativi alla configurazione delle utenze (Utenti abilitati, ruoli, gruppi di appartenenza,
                    domicili e recapiti digitali, deleghe, ecc.) per 2 anni dall’ultimo accesso.
                  </li>
                </ul>
                Inoltre, sono soggetti alla prescrizione ordinaria, pari a 10 anni (2946 c.c.):
                <ul>
                  <li>
                    i dati acquisiti a mezzo SPID/SPID Professionale e CIE ovvero nello specifico nome, cognome, codice
                    fiscale, ruolo del soggetto registratosi quale Referente della PA Mittente (per dieci anni dall’ultima
                    acquisizione);
                  </li>
                  <li>
                    i dati acquisiti a mezzo SPID/SPID Professionale e CIE ovvero nello specifico nome, cognome, codice
                    fiscale del soggetto destinatario (per 10 anni dall’ultima acquisizione);
                  </li>
                  <li>
                    l’atto di delega scansionato/copia conforme per attivazione OTP (per 10 anni dalla richiesta);
                  </li>
                  <li>
                    le informazioni acquisite dall’addetto al recapito postale in caso di notificazione analogica,
                    ovvero tutto ciò che il recapitista acquisisce, ad esempio nuovo indirizzo di residenza, domicilio
                    del destinatario, cartolina di ritorno della notifica (ivi inclusa la firma del destinatario e
                    dell’addetto al recapito postale);
                  </li>
                  <li>la firma dell’addetto al recapito postale sui plichi inesitati;</li>
                  <li>le ricevute cartacee ed i plichi inesitati, relativa copia digitale ai sensi dell’art. 22 del CAD.</li>
                </ul>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">Trasferimento transfrontaliero dei dati</Typography>
              <Typography variant="body1">
                I dati personali potranno essere trasferiti fuori dall’Unione Europea da parte di fornitori di servizi
                di cui ci si avvale ad esempio per attività connesse alla gestione del Sito. Tale trasferimento, ove
                ricorra il caso, verrà disciplinato con i fornitori di servizi mediante il ricorso a clausole contrattuali
                standard adottate dalla Commissione europea con la decisione 2021/914/UE ed eventuali successive
                modifiche o, in alternativa, sulla base di una decisione di adeguatezza della Commissione europea e/o di o
                gni altro strumento consentito dalla normativa di riferimento.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">Diritti degli interessati</Typography>
              <Typography variant="body1">
                Agli Utenti, ai quali i dati personali si riferiscono, è riconosciuta, in ogni momento, la possibilità
                di esercitare i diritti di cui agli artt. da 15 a 22 del Regolamento.<br/>
                Gli Interessati che ritengano che il trattamento dei dati personali a loro riferiti avvenga in violazione
                di quanto previsto dal Regolamento hanno il diritto di proporre reclamo al Garante, come previsto dall’art.
                77 del Regolamento stesso, o di adire le opportune sedi giudiziarie (art. 79 del Regolamento).<br/>
                Di seguito si trasmettono i dati di contatto ed i riferimenti dell’Autorità di controllo - Garante per la
                protezione dei dati personali:<br/>
                Indirizzo e-mail: garante@gpdp.it<br/>
                Indirizzo PEC: protocollo@pec.gpdp.it<br/>
                Sito web: https://www.garanteprivacy.it
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">Modifiche</Typography>
              <Typography variant="body1">
                E’ sempre possibile apportare al presente documento informativo, in qualunque momento, tutte le modifiche
                ritenute opportune o rese obbligatorie dalle norme di volta in volta vigenti, dandone adeguata pubblicità.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold" textAlign="center">Cookie policy</Typography>
              <Typography variant="body1" component="span">
                Il presente Avviso Cookie è parte della nostra Informativa sulla privacy. Per ulteriori informazioni su
                di noi, e su come proteggiamo informazioni degli Utenti, si prega di consultare la nostra Informativa
                sulla privacy.
                <br/>
                Il Sito utilizza cookie tecnici di navigazione o di sessione che garantiscono la normale navigazione e
                fruizione del Sito. Detti cookie sono utilizzati nella misura strettamente necessaria per rendere il
                servizio. Essi garantiscono un’adeguata fruizione del Sito e consentono la navigazione e utilizzare
                servizi e opzioni. Il loro utilizzo esula da scopi ulteriori e tali cookie sono installati direttamente
                dal Gestore della piattaforma (rientrano, dunque, nella categoria di cookie di prima parte o proprietari).
                <br/><br/>
                Per l’installazione dei suddetti cookie non è richiesto il preventivo consenso degli Utenti, mentre
                resta fermo l’obbligo di dare l’informativa ai sensi dell’art. 13 del Regolamento e dell’art. 122 del D.
                Lgs. 196/2003 e ss.mm.ii. (“Codice Privacy”).
                <br/><br/>
                Il Sito presenta cookie di terze parti, creati e gestiti da soggetti diversi dal Gestore della
                piattaforma, e sui quali lo stesso non ha e non può avere alcun controllo.<br/>
                Nello specifico e con esclusivo riferimento al Gestore della piattaforma, l’unico cookie settato di terze
                parti è MixPanel utile per il tracciamento degli eventi di failure nelle operazioni, di cui viene richiesto
                preventivo consenso. I cookie vengono conservati per un periodo non superiore a 6 mesi dal momento della
                raccolta, salvo che la loro ulteriore conservazione non si renda necessaria per l’accertamento di reati.
                <br/><br/>
                &Egrave; possibile gestire le preferenze relative ai cookie attraverso le opzioni fornite dal proprio
                browser e dal cookie banner nella sezione Scopri di più dove potrai accettare o meno tutti o alcuni dei
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
                <Typography variant="body1">Data di ultimo aggiornamento: 24.08.2022</Typography>
                <br/>
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
              <Typography variant="h6">Termini e condizioni d’uso</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                <strong>
                  I presenti termini e condizioni d’uso (di seguito anche “ToS”) regolano il rapporto tra gli utenti del
                  sito <Link href="https://pn.selfcare.pagopa.it">pn.selfcare.pagopa.it</Link> (di seguito “Sito”) dove
                  poggia parte della Piattaforma Notifiche Digitali (di seguito “Piattaforma”) prevista dall’art. 26,
                  comma 2, lettera c), del decreto-legge n. 76 del 17 luglio 2020 come convertito, con modificazioni, dalla
                  legge 11 settembre 2020, n. 120 e come altresì modificato dal decreto-legge. n. 77 del 31 maggio 2021,
                  così come convertito dalla legge 29 luglio 2021 n. 108 e gestita da PagoPA S.p.A. (di seguito “Società”)
                  stabilendo diritti ed obblighi nell’utilizzo dello stesso.<br/><br/>
                  Leggili attentamente: utilizzando il Sito, li accetti integralmente e ti impegni a rispettarli.
                </strong>
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                1. Descrizione del servizio
              </Typography>
              <Typography variant="body1">
                1.1 PagoPA S.p.A. con sede legale in Roma, Piazza Colonna 370, CAP 00187, n. di iscrizione a Registro
                Imprese di Roma, CF e P.IVA 15376371009, in base a quanto previsto dall’art. 8, commi 2 e 3, del D.L. n.
                135/2018, ha sviluppato il Sito a cui si accede a mezzo del portale di back office <b>“Area Riservata”</b> (di
                seguito anche il <b>“Portale”</b>) della Società, raggiungibile all’indirizzo web
                <Link href="https://selfcare.pagopa.it">https://selfcare.pagopa.it</Link>.<br/>
                1.2 Mediante il Sito, le pubbliche amministrazioni, ovvero le amministrazioni individuate dall’articolo
                26, comma 2, lettera c), del decreto-legge n. 76 del 17 luglio 2020 come convertito, con modificazioni,
                dalla legge 11 settembre 2020, n. 120 e come altresì modificato dal decreto-legge. n. 77 del 31 maggio
                2021, così come convertito dalla legge 29 luglio 2021 n. 108 (di seguito anche <b>“PA Mittenti”</b>) aderiscono
                alla Piattaforma per il tramite dei propri referenti (di seguito <b>“Utenti”</b>).
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                2. Costi
              </Typography>
              <Typography variant="body1">
                2.1 L’utilizzo del Sito non prevede il pagamento di alcun corrispettivo da parte dell’Utente.<br/>
                2.2 Per utilizzare il Sito è necessaria una connessione dati i cui costi non sono a carico della Società.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                3. Siti di terze parti
              </Typography>
              <Typography variant="body1">
                3.1 Tutti i siti web che non appartengono alla Società e a cui l’Utente può accedere, anche a seguito di accesso a collegamento ipertestuale (link) presente sul Sito, sono indipendenti dal Sito stesso. La Società non ha alcun potere di controllo, né diretto né indiretto, sugli stessi e sul loro contenuto o utilizzo.
                <br/>
                3.2 L’Utente riconosce e accetta che nessun tipo di responsabilità, neanche indiretta, potrà essere imputata alla Società per contenuti, prodotti o altri beni/servizi, nonché per l’utilizzazione dei collegamenti ipertestuali di cui sopra, e che la presenza sul Sito di un collegamento ipertestuale (link) verso un altro indirizzo web non comporta alcun tipo di assunzione o accettazione di responsabilità da parte della Società medesima circa il contenuto o l’utilizzazione del sito collegato. L’Utente accetta espressamente, quindi, di manlevare e tenere indenne la Società da ogni danno, perdita e conseguenza pregiudizievole patita dall’Utente.
                <br/>
                3.3 La disciplina in materia di protezione dei dati personali stabilita nel presente Sito non trova applicazione con riguardo a siti di terze parti su cui la Società non esercita alcun controllo. La Società non potrà essere, quindi, ritenuta responsabile per l’eventuale violazione della normativa in materia di protezione dei dati personali posta in essere da tali siti di terze parti.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                4. Assistenza all’Utente e debug
              </Typography>
              <Typography variant="body1">
                4.1 La Società fa del suo meglio per assicurare un’esperienza adatta alle esigenze dell’Utente.
                <br/>
                4.2 Se l’Utente ha bisogno di assistenza sul Sito, è possibile accedere alla sezione “?Assistenza” cliccando sull’apposita sezione in alto a destra della pagina ed aprire un ticket. Per maggiori informazioni su come trattiamo i dati personali in caso di assistenza, si prega di prendere visione dell’Informativa Privacy Assistenza presente sul sito <Link href="https://www.pagopa.it">www.pagopa.it</Link> al seguente link: <Link href="https://www.pagopa.it/it/privacy-policy-assistenza/">https://www.pagopa.it/it/privacy-policy-assistenza/</Link>.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                5. Responsabilità e obblighi dell’Utente
              </Typography>
              <Typography variant="body1" component="span">
                <ul style={{listStyleType: "lower-alpha"}}>
                  <li>
                    <i>Uso conforme e obblighi dell’Utente</i>
                    <br/>
                    Utilizzando il Sito, l’Utente accetta i presenti ToS e si impegna a rispettarli in ogni momento.
                    L’Utente può utilizzare il Sito esclusivamente per gli scopi autorizzati dai presenti ToS e in
                    conformità alla legge applicabile.<br/>
                    L’Utente si impegna a non utilizzare, direttamente o indirettamente, il Sito:
                    <ul style={{listStyleType: "lower-roman"}}>
                      <li>in violazione dei diritti della Società o di terzi;</li>
                      <li>per finalità di marketing, promozionali e/o pubblicitarie;</li>
                      <li>in modo illecito, diffamatorio, osceno, volgare, intimidatorio, offensivo nei confronti della Società o di terzi;</li>
                      <li>per trasmettere comunicazioni illecite o non autorizzate, quali messaggi massivi, spam o messaggi automatici;</li>
                      <li>per comunicare dati o informazioni false, ingannevoli o illecite;</li>
                      <li>per trasmettere virus, malware o altri codici dannosi per qualsivoglia dispositivo o sistema e/o effettuare interventi di hacking;</li>
                      <li>aggirare o manomettere l’accesso e l’autenticazione;</li>
                      <li>accedere attraverso programmi o metodi diversi da quelli ufficialmente rilasciati e gestiti dalla Società;</li>
                      <li>farne un uso in violazione o sovraccarico della capacità di rete.</li>
                    </ul>
                    <li>
                      <i>Responsabilità Utente, indennizzo e manleva</i>
                      <br/>
                      L’Utente è tenuto ad avvisare tempestivamente la Società nel caso venga a conoscenza di uso o accesso non autorizzato al Sito o di qualsiasi violazione, malfunzionamento o incidente di sicurezza. Qualora tali eventi comportino violazioni e intrusioni nei dati personali, l’Utente ne informerà tempestivamente la Società entro 24 ore dal verificarsi dell’evento. La Società non potrà essere considerata responsabile per eventuali danni o disservizi derivanti da usi ed accessi non autorizzati effettuati tramite l’utilizzo delle credenziali in possesso dell’Utente.
                      <br/>
                      Fermi restando gli altri rimedi a disposizione della Società ai sensi della normativa applicabile, nel caso di violazioni ripetute, gravi o sostanziali dei ToS la Società si riserva il diritto di sospendere o disattivare permanentemente l’utenza del responsabile della violazione.
                      <br/>
                      Inoltre, l’Utente riconosce che le credenziali di autenticazione sono strettamente personali, devono essere mantenute riservate e non sono condivisibili con terzi, se non negli eventuali casi espressamente previsti dalla legge.
                      <br/>
                      L’Utente si obbliga a manlevare e tenere indenne la Società e i suoi dipendenti, dirigenti e amministratori da qualsiasi domanda, richiesta, reclamo, pretesa o azione legale da parte di terzi, nonché da qualsiasi danno, perdita o spesa (incluse le ragionevoli spese legali necessarie per resistere le predette azioni) da chiunque subiti, direttamente o indirettamente, in relazione, in conseguenza o in connessione:
                      <ul style={{listStyleType: "lower-roman"}}>
                        <li>alle attività e alla condotta dell’Utente nell’utilizzo del Sito e delle sue funzionalità;</li>
                        <li>alle dichiarazioni, ai dati e alle informazioni comunque fornite dall’Utente;</li>
                        <li>alle violazioni dei ToS o della legge applicabile da parte dell’Utente.</li>
                      </ul>
                    </li>
                  </li>
                </ul>
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                6. Misure a disposizione della Società
              </Typography>
              <Typography variant="body1" component="span">
                6.1 Ogni attività effettuata sul Sito da un Utente è eseguita in nome proprio con ogni conseguenza ai fini di legge anche in merito ad eventuali responsabilità per eventuali perdite o danni subiti dalla Società o da terzi in caso di violazioni dei presenti ToS, nonché dell’utilizzo improprio o illecito del Sito. La Società può adottare autonomamente tutte le misure necessarie, inclusa la sospensione o l’interruzione del Sito o dell’utilizzo dello stesso da parte di un Utente, qualora l’Utente ne faccia un utilizzo illecito o altrimenti vietato, oppure commetta una violazione sostanziale o reiterata dei presenti ToS.
                <br/>
                6.2 La Società può - in conformità alla normativa primaria e secondaria applicabile - rilevare gli accessi al Sito e laddove riscontrasse una violazione delle procedure di sicurezza e protezione dei dati, sospendere temporaneamente l’utenza e disattivarla, fatto salvo ogni altro rimedio, anche giurisdizionale, consentito dalla legge.
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                7. Esclusioni e limitazione di responsabilità
              </Typography>
              <Typography variant="body1">
                7.1 Gli utenti sono i soli responsabili dei dati inseriti sul Sito. Prima di fornire dati di terzi, si invita l’Utente a verificare che abbia ricevuto ogni necessaria autorizzazione all’uso di tali dati con specifico riferimento alla loro diffusione sul Sito.
                <br/>
                7.2 La Società è responsabile unicamente delle funzionalità del Sito e, di conseguenza, non potranno esserle imputati danni o perdite che non siano diretta conseguenza della violazione dei presenti ToS da parte della stessa.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                8. Modifiche ai ToS
              </Typography>
              <Typography variant="body1">
                8.1 La Società cerca di offrire all’Utente nuove funzionalità e di migliorare il Sito. Per questa ragione, i presenti ToS potrebbero cambiare nel tempo e, a tal fine, la Società chiede all’Utente di monitorarne l’eventuale aggiornamento ogni volta in cui accede al Sito. Si ricorda che se l’Utente continuerà ad utilizzare le funzionalità del Sito, accetterà le eventuali modifiche apportate dalla Società ai presenti ToS.
                <br/>
                8.2 Se l’Utente non intende accettare le modifiche apportate ai presenti ToS, come unico rimedio, potrà, in qualsiasi momento, per qualsiasi motivo, senza alcun preavviso e senza alcun costo o onere, cessare l’utilizzo del Sito.
              </Typography>
              <br/>
              <Typography variant="body1" fontWeight="bold">
                9. Proprietà intellettuale
              </Typography>
              <Typography variant="body1">
                9.1 La Società, nel rispetto dei termini dell’accordo di adesione alla Piattaforma, fornisce all’Utente una licenza limitata e non esclusiva per l’utilizzo del Sito.
                <br/>
                9.2 PagoPA S.p.A. è il titolare esclusivo dei contenuti del Sito, ivi compresi, a titolo esemplificativo e non esaustivo, immagini e layout delle pagine, design e il know-how. Alcuni dei predetti contenuti possono essere coperti da copyright, marchi, brevetti, modelli e/o altri diritti di proprietà industriale ed intellettuale riconosciuti dall’ordinamento italiano ed internazionale.
                <br/>
                9.3 Nessun contenuto del Sito può essere considerato o interpretato come concesso in licenza e/o come oggetto di qualsivoglia altro diritto di utilizzo da parte degli utenti e/o di soggetti terzi.
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                10. Legge applicabile e foro competente
              </Typography>
              <Typography variant="body1">
                10.1 I presenti ToS sono regolati dalla legge italiana.
                <br/>
                10.2 Ogni controversia che dovesse insorgere tra l’Utente e la Società in relazione ai presenti ToS e/o al Sito sarà di competenza esclusiva del foro di Roma oppure del giudice del luogo di residenza o domicilio dell’Utente, ove qualificato come consumatore ai sensi del D.Lgs. 206/2005.
              </Typography>
              <br/>
              <Typography variant="body1">
                Proseguendo l’Utente dichiara espressamente di aver letto, compreso e accettato i ToS e in particolare i seguenti articoli: <b>(5)</b> Responsabilità e obblighi dell’Utente; <b>(7)</b> Esclusioni e limitazione di responsabilità; <b>(8)</b> Modifiche ai ToS e <b>(10)</b> Legge applicabile e foro competente.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </>);
};

export default PrivacyTOSPage;