import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";

// import { Typography, Grid, Link, Container } from "@mui/material";

// const FAVICON_PATH = `${process.env.NEXT_PUBLIC_ASSETS_URL}/favicon.svg`;

declare const OneTrust: any;

const PrivacyPage: NextPage = () => {

  useEffect(() => {
    OneTrust.NoticeApi.Initialized.then(function () {
      OneTrust.NoticeApi.LoadNotices(
        [
          "https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/b5c8e1dc-89df-4ec2-a02d-1c0f55fac052.json",
        ],
        false
      );
    });
  }, []);

  return (
    <>
      <Head>
        <title>Piattaforma Notifiche</title>
        <meta
          name="description"
          content="Informativa Privacy Piattaforma notifiche"
        />
        <link rel="icon" href="/static/favicon.svg" />
      </Head>

      <div
        id="otnotice-b5c8e1dc-89df-4ec2-a02d-1c0f55fac052"
        className={`otnotice`}
      ></div>
      {/*
      <main>
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
          <Grid container item xs={9} direction="column" sx={{ mx: "auto" }}>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h1">
                Policy Privacy
              </Typography>
              <Typography sx={{ mb: 2, mt: 5 }} variant="h3">
                Informativa sul trattamento dei dati personali
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                La presente informativa, resa ai sensi degli artt. 13-14 del
                Regolamento (UE) 2016/679 (di seguito il
                <strong>“Regolamento”</strong> o <strong>“GDPR”</strong>),
                descrive le modalità del trattamento dei dati personali degli
                utenti (di seguito
                <strong>“Utente/i”</strong>) che consultano il sito{" "}
                <Link href="https://www.pagopa.gov.it/">
                  https://www.pagopa.gov.it/
                </Link>{" "}
                (di seguito, anche <strong>“Sito”</strong>), di PagoPA S.p.A.
                (di seguito anche “Titolare” o ”Società” o “Gestore del Sito”).
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il presente Sito vuole essere una risorsa utile per l’utente
                cittadino circa la gestione dei pagamenti verso la pubblica
                amministrazione, nonché un canale di accesso ai servizi offerti
                dalla Società stessa ai Prestatori di Servizi di pagamento e
                agli Enti Creditori per lo sviluppo, la manutenzione e la
                gestione della Piattaforma pagoPA.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                La validità dell’informativa contenuta nella presente pagina è
                limitata al Sito e non si estende ad altri siti web o altri
                portali eventualmente consultabili mediante collegamento
                ipertestuale.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Questa informativa non include informazioni circa i dati
                personali trattati nell’utilizzo della Piattaforma pagoPA come
                strumento di pagamento verso le pubbliche amministrazioni;
                specifiche informative sono rese nel momento di tale utilizzo.
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Titolare del trattamento dei dati
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il titolare del trattamento è la società PagoPA S.p.A. con sede
                in Piazza Colonna 370 00187 Roma - Italia. Indirizzo PEC:{" "}
                <Link href="mailto:pagopa@pec.governo.it">
                  pagopa@pec.governo.it
                </Link>
                .
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Data protection officer (DPO) o Responsabile Protezione Dati
                (RPD)
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il DPO di PagoPA S.p.A. può essere contattato attraverso il
                presente form di contatto o ai seguenti recapiti:
              </Typography>
              <Typography sx={{ mb: 2 }} component="ul" variant="body2">
                <li>
                  Indirizzo e-mail:{" "}
                  <Link href="mailto:dpo@pagopa.it">dpo@pagopa.it</Link>;
                </li>
                <li>
                  Indirizzo PEC:{" "}
                  <Link href="mailto:dpo@pec.pagopa.it">dpo@pec.pagopa.it</Link>
                  ;
                </li>
                <li>
                  Indirizzo: Via Sardegna n. 38 - 00187, Roma (sede operativa
                  della Società)
                </li>
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Autorità di controllo
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Garante per la protezione dei dati personali
              </Typography>
              <Typography sx={{ mb: 2 }} component="ul" variant="body2">
                <li>
                  Indirizzo e-mail:{" "}
                  <Link href="mailto:garante@gpdp.it">garante@gpdp.it</Link>;
                </li>
                <li>
                  Indirizzo PEC:{" "}
                  <Link href="mailto:protocollo@pec.gpdp.it">
                    protocollo@pec.gpdp.it
                  </Link>
                  ;
                </li>
                <li>
                  Sito web:{" "}
                  <Link href="https://www.garanteprivacy.it">
                    https://www.garanteprivacy.it
                  </Link>
                </li>
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Dati personali trattati, finalità e base giuridica del
                trattamento
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                I dati personali da noi trattati sono:
              </Typography>
              <Typography sx={{ mb: 2 }} component="ul" variant="body2">
                <li>
                  dati, anche eventualmente particolari, inseriti all’atto della
                  richiesta email inviata a{" "}
                  <Link href="mailto:credenziali@assistenza.pagopa.it">
                    credenziali@assistenza.pagopa.it
                  </Link>{" "}
                  per il primo accesso al Portale delle Adesioni (PdA) ai fini
                  della registrazione dell’Ente Creditore sul PdA;
                </li>
                <li>
                  dati, anche eventualmente particolari, inseriti all’atto
                  dell’adesione alla Piattaforma pagoPA in qualità di Prestatore
                  di Servizi di pagamento (PSP), ivi inclusa la firma digitale
                  dell’atto ed inviata via PEC a{" "}
                  <Link href="mailto:accordipsp@pec.pagopa.it">
                    accordipsp@pec.pagopa.it
                  </Link>
                  ;
                </li>
                <li>
                  dati, anche eventualmente particolari, inseriti all’atto
                  dell’invio di una domanda sulla registrazione come PSP o come
                  Ente Creditore (EC) di cui ai punti che precedono
                  all’indirizzo email:
                  <Link href="mailto:account@pagopa.it">account@pagopa.it</Link>
                  ;
                </li>
                <li>
                  dati, anche eventualmente particolari, inseriti con l’invio di
                  una richiesta email a{" "}
                  <Link href="mailto:pagamenti@assistenza.pagopa.it">
                    pagamenti@assistenza.pagopa.it
                  </Link>{" "}
                  o chiamando allo 06.4520.2323 per fornirti assistenza sui
                  pagamenti (Cfr. informativa Assistenza sul sito istituzionale:
                  <Link href="https://www.pagopa.it">www.pagopa.it</Link>);
                </li>
                <li>
                  dati, anche eventualmente particolari, inseriti con l’invio di
                  una richiesta di segnalazione su GitHub all’indirizzo web:{" "}
                  <Link href="https://github.com/pagopa/pagopa-api/issues">
                    github.com/pagopa/pagopa-api/issues
                  </Link>{" "}
                  , qualora tu sia un Referente di un EC o di un PSP ed abbia la
                  necessità di porre domande tecniche sull’implementazione della
                  Piattaforma pagoPA.
                </li>
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Tali dati vengono trattati ai fini dell’erogazione dei servizi
                così come sopra rappresentati.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Trattiamo inoltre i dati di navigazione. I sistemi informatici e
                le procedure software preposte al funzionamento di questo sito
                acquisiscono, nel corso del loro normale esercizio, alcuni dati
                personali la cui trasmissione è implicita nell’uso dei
                protocolli di comunicazione di Internet. In questa categoria di
                dati rientrano gli indirizzi IP o i nomi a dominio dei computer
                e dei terminali utilizzati dagli Utenti, gli indirizzi in
                notazione URI/URL (Uniform Resource Identifier/Locator) delle
                risorse richieste, l’orario della richiesta, il metodo
                utilizzato nel sottoporre la richiesta al server, la dimensione
                del file ottenuto in risposta, il codice numerico indicante lo
                stato della risposta data dal server (buon fine, errore, ecc.)
                ed altri parametri relativi al sistema operativo e all’ambiente
                informatico dell’Utente. Tali dati, necessari per la fruizione
                dei servizi web, vengono anche trattati allo scopo di: i)
                ottenere informazioni aggregate su pagine più visitate e numero
                di visitatori per fascia oraria o giornaliera, e ii) controllare
                il corretto funzionamento dei servizi offerti. Tali dati,
                necessari per la fruizione dei servizi web, vengono trattati
                allo scopo di controllare il corretto funzionamento del Sito ed
                al fine di garantire la sicurezza della navigazione.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Non è prevista alcuna forma di processo decisionale
                automatizzato che comporti effetti giuridici sull’interessato.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                La Società tratta i dati personali in qualità di titolare del
                trattamento sulla base dell’esercizio del compito di interesse
                pubblico di cui all’art. 6, comma 1, lett. e), del GDPR, sulla
                base dell’esecuzione di un contratto di cui all’art. 6, comma 1,
                lett. b), nonché sulla base di un adempimento di un obbligo
                legale al quale è soggetto il Titolare di cui all’art. 6, comma
                1, lett. c).
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Categorie di soggetti ai quali i dati personali possono essere
                comunicati
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il Titolare potrà comunicare, per il perseguimento delle
                finalità sopra indicate, alcuni dati personali anche a:
              </Typography>
              <Typography sx={{ mb: 2 }} component="ul" variant="body2">
                <li>
                  soggetti terzi che forniscono un servizio al Titolare stesso e
                  che tratteranno detti dati personali in qualità di
                  responsabili del trattamento;
                </li>
                <li>
                  altri soggetti pubblici che ne facciano richiesta alla Società
                  per l’esecuzione di un compito di interesse pubblico o
                  connesso all’esercizio di un pubblico potere o per adempiere a
                  un obbligo legale;
                </li>
                <li>
                  autorità giudiziaria e/o forze di polizia nei limiti dei
                  compiti istituzionali loro attribuiti.
                </li>
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Laddove i soggetti di cui sopra ricevano i dati personali per
                l’esecuzione di un servizio commissionato dalla Società
                nell’interesse di quest’ultima, gli stessi destinatari sono
                nominati, se del caso, responsabili del trattamento da parte del
                Titolare ai sensi dell’art. 28 del Regolamento.
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Modalità del trattamento
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                I dati personali degli Utenti sono trattati adottando adeguate
                misure di sicurezza volte ad impedire l’accesso, la
                divulgazione, la modifica o la distruzione non autorizzata dei
                dati personali. Tutti i dipendenti che hanno accesso ai dati
                personali sono debitamente designati quali soggetti autorizzati
                al trattamento e ciascuno di essi è incaricato di trattare
                unicamente i dati strettamente necessari allo svolgimento delle
                proprie mansioni lavorative. Il trattamento è effettuato
                prevalentemente mediante strumenti informatici, con modalità
                organizzative e logiche strettamente correlate alle finalità
                sopra indicate. Oltre al Titolare, in alcuni casi, possono avere
                accesso ai dati, a seguito di comunicazione da parte dello
                stesso, anche ulteriori soggetti coinvolti nella gestione del
                Sito, nominati, ove necessario, quali responsabili del
                trattamento ai sensi dell’art. 28 del Regolamento. Tali soggetti
                trattano i dati esclusivamente per attività funzionali o
                comunque strettamente connesse al Sito.
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Tempi di conservazione dei dati
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                I dati personali acquisiti tramite il presente Sito sono
                conservati per il tempo necessario: i) per il corretto
                svolgimento dei servizi erogati dal Sito, ii) per motivi di
                interesse pubblico, e iii) per l’adempimento degli obblighi
                legali connessi.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Nel rispetto dei principi di proporzionalità e necessità, i dati
                non sono conservati per periodi più lunghi rispetto a quelli
                indispensabili alla realizzazione delle finalità sopra indicate
                e dunque al diligente utilizzo del Sito. Per maggiori
                informazioni è possibile scrivere tramite il presente{" "}
                <Link href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">
                  form di contatto
                </Link>
                .
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Trasferimento transfrontaliero dei dati
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                La Società si avvale di fornitori europei e non per l’erogazione
                dei propri servizi. Abbiamo concluso con tali fornitori accordi
                di servizio ai sensi dell’art. 28 del Regolamento. Tutti i
                fornitori sono conformi al GDPR. In particolare, ancor di più, i
                fornitori che risiedono al di fuori dello Spazio Economico
                Europeo (SEE), compresi gli USA, sono stati adeguatamente
                selezionati e oltre ad esser nominati ai sensi dell’art. 28
                GDPR, e nel rispetto degli articoli 46, 47 e 49 del GDPR, hanno
                stipulato le Clausole Contrattuali Standard della Commissione
                Europea per garantire adeguati livelli di tutela, oltre a
                eventuali misure supplementari ove possibili e necessarie per
                rafforzare i livelli di tutela stessi.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Per maggiori informazioni è possibile scrivere tramite il
                presente{" "}
                <Link href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">
                  form di contatto
                </Link>
                .
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Diritti degli interessati
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                In relazione alle predette finalità, hai il diritto ad accedere
                ai tuoi dati personali, richiedere che gli stessi vengano
                rettificati o cancellati, opporti al trattamento degli stessi,
                richiedere una limitazione del trattamento e ricevere i tuoi
                dati personali in formato strutturato. Desideriamo informarti
                che potrai esercitare in ogni momento i diritti che ti sono
                riconosciuti dalla legge, tra cui quello:
              </Typography>
              <Typography sx={{ mb: 2 }} component="ul" variant="body2">
                <li>
                  di accedere ai tuoi dati personali, ottenendo evidenza delle
                  finalità perseguite, delle categorie di dati coinvolti, dei
                  destinatari a cui gli stessi possono essere comunicati, del
                  periodo di conservazione applicabile, dell’esistenza di
                  processi decisionali automatizzati;
                </li>
                <li>
                  di ottenere senza ritardo la rettifica dei dati personali
                  inesatti che ti riguardano;
                </li>
                <li>
                  di ottenere, nei casi previsti, la cancellazione dei tuoi
                  dati;
                </li>
                <li>
                  di revocare il consenso o i consensi eventualmente prestati;
                </li>
                <li>
                  di ottenere la limitazione del trattamento o di opporsi allo
                  stesso, quando possibile;
                </li>
                <li>
                  di richiedere la portabilità dei dati che hai fornito, vale a
                  dire di riceverli in un formato strutturato, di uso comune e
                  leggibile da dispositivo automatico, anche per trasmettere
                  tali dati ad un altro titolare, senza alcun impedimento da
                  parte della Società stessa;
                </li>
                <li>
                  di proporre reclamo all’Autorità Garante per la Protezione dei
                  Dati Personali.
                </li>
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Potrai esercitare i tuoi diritti inviando specifica richiesta
                tramite il nostro{" "}
                <Link href="https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8">
                  form di contatto
                </Link>
                .
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2 }} variant="h5">
                Modifiche
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il Titolare si riserva il diritto di apportare alla presente
                informativa, a propria esclusiva discrezione ed in qualunque
                momento, tutte le modifiche ritenute opportune o rese
                obbligatorie dalle norme di volta in volta vigenti, dandone
                adeguata pubblicità agli Utenti. Si prega dunque di consultare
                spesso questa pagina, prendendo a riferimento la data di ultima
                modifica indicata in fondo alla stessa. In caso di mancata
                accettazione delle modifiche effettuate, l’Utente è invitato a
                cessare l’utilizzo del Sito e a chiedere al Titolare la
                rimozione dei propri dati personali; salvo quanto diversamente
                specificato, la precedente versione dell’informativa continuerà
                ad applicarsi ai dati personali raccolti sino a quel momento.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                <strong>Data di ultima modifica</strong>: 1 febbraio 2022
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ mb: 2, mt: 5 }} variant="h3">
                Cookie Policy
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il presente Avviso Cookie è parte della nostra Informativa sulla
                privacy. Per ulteriori informazioni su di noi, e su come
                proteggiamo le informazioni degli Utenti, si prega di consultare
                la nostra Informativa sulla privacy.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il Sito utilizza cookie tecnici di navigazione o di sessione che
                garantiscono la normale navigazione e fruizione del Sito (essi
                vengono memorizzati sul terminale dell’Utente sino alla chiusura
                del browser). Detti cookies sono utilizzati nella misura
                strettamente necessaria per utilizzare il Sito. Essi
                garantiscono un’adeguata fruizione del Sito e consentono
                all’Utente di navigare e utilizzare servizi e opzioni. Il loro
                utilizzo esula da scopi ulteriori e tali cookie sono installati
                direttamente dalla Società, ovvero il Gestore del Sito
                (rientrano, dunque, nella categoria di cookie di prima parte o
                proprietari).
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Per l’installazione dei suddetti cookie non è richiesto il
                preventivo consenso degli Utenti, mentre resta fermo l’obbligo
                di dare l’informativa ai sensi dell’art. 13 del Regolamento e
                dell’art. 122 del D. Lgs. 196/2003 e ss.mm.ii. (Codice Privacy).
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                Il Sito presenta cookies di terze parti, creati e gestiti da
                soggetti diversi dal gestore del Sito che si sta visitando e sui
                quali lo stesso non ha e non può avere alcun controllo. Per tali
                categorie di cookies è richiesto all’Utente di prestare il
                consenso.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                I cookies vengono conservati per un periodo non superiore a 6
                mesi dal momento della raccolta, salvo che la loro ulteriore
                conservazione non si renda necessaria per l’accertamento di
                reati. L’Utente può scegliere di disabilitare i cookies
                intervenendo sulle impostazioni del proprio browser di
                navigazione secondo le istruzioni rese disponibili dai relativi
                fornitori ai link di seguito indicati o decidere di disabilitare
                i cookies del Sito mediante il banner cookies.
              </Typography>
              <Typography sx={{ mb: 2 }} component="ul" variant="body2">
                <li>
                  <Link href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=it">
                    Chrome
                  </Link>
                </li>
                <li>
                  <Link href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie">
                    Firefox
                  </Link>
                </li>
                <li>
                  <Link href="https://support.apple.com/kb/ph19214?locale=it_IT">
                    Safari
                  </Link>
                </li>
                <li>
                  <Link href="https://support.microsoft.com/it-it/help/17442/windows-internet-explorer-delete-manage-cookies">
                    Internet Explorer
                  </Link>
                </li>
                <li>
                  <Link href="https://support.microsoft.com/it-it/help/4027947/windows-delete-cookies">
                    Edge
                  </Link>
                </li>
                <li>
                  <Link href="https://help.opera.com/en/latest/web-preferences/#cookies">
                    Opera
                  </Link>
                </li>
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                I tuoi feedback sono importanti per migliorare il Sito, anche
                sulle questioni privacy! Se qualcosa che riguarda la tua privacy
                non ti convince, non ti è chiaro o ritieni che dovremmo agire
                diversamente, scrivici utilizzando il form dedicato alla
                gestione delle richieste degli interessati.
              </Typography>
              <Typography sx={{ mb: 2 }} variant="body2">
                <strong>Data di ultima modifica</strong>: 1 febbraio 2022
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </main>
                */}
    </>
  );
};

export default PrivacyPage;
