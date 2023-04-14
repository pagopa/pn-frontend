import { Box, Typography } from "@mui/material";
import { IFaqData } from "model";

import { PERFEZIONAMENTO_PATH, PN_PF_URL, PN_PG_URL } from "@utils/constants";
import { FaqLink, FaqParagraph, FaqTextSection } from "src/components/FaqComponents";

/**
 * Data for FAQ in Italian.
 * Note that the item description can be specified by either: a string, an array of strings, or a JSX element.
 * Cfr. comments for the FaqDescription type.
 */
export const itFaqData: IFaqData = {
  title: 'Piattaforma Notifiche - FAQ',
  sections: [
    { title: 'Notifiche', items: [
      { id: 'notifiche-cosa-sono', title: 'Cosa sono le notifiche?', 
        description: [
          `Le notifiche sono comunicazioni a valore legale emesse in via ufficiale da
          un'amministrazione come multe, avvisi di accertamento di tributi o rimborsi. Le
          "notifiche" sono quindi diverse dalle "notifiche push", cioè quei brevi messaggi che
          ricevi sullo schermo del tuo dispositivo.`,
          `Fino ad ora, queste comunicazioni venivano inviate quasi sempre tramite
          raccomandata cartacea. Adesso, invece, potrai riceverle in digitale.`
        ]
      },
      { id: 'notifiche-valore-legale', title: 'Cosa significa che una comunicazione è "a valore legale"?', 
        description: 
        `Significa che l'invio e la ricezione di queste comunicazioni producono degli effetti
        giuridici sia nei confronti di chi le invia che di chi le riceve. Per esempio, se ricevi
        una multa per violazione del codice stradale, la data in cui la ricevi incide
        sull'importo che dovrai pagare o sulla tua facoltà di contestarla`
      },
      { id: 'notifiche-composizione', title: 'Da cosa è composta una notifica?', 
        description: [
          `Fino ad ora ogni notifica era composta da uno o più "atti", cioè i documenti
          notificati, e da eventuali altri documenti. Per esempio, una multa poteva essere
          composta da un verbale di contravvenzione (il documento notificato), da una
          fotografia dell'autovelox e da un bollettino per il pagamento (gli altri documenti).`,
          `Con SEND invece, la notifica si concretizza in un avviso che include le istruzioni
          per ottenere i documenti notificati e gli eventuali altri documenti.`
        ]
      },
    ] },
    { title: 'SEND', items: [
      { id: 'send-cosa-e', title: `Cos'è SEND?`, 
        description: 
        `È una piattaforma che digitalizza e semplifica la gestione delle notifiche: ti
        permette infatti di riceverle, scaricare i documenti notificati e pagare eventuali
        spese nell'app IO o su SEND.`
      },
      { id: 'send-a-chi-invia', title: 'A chi invia notifiche?', 
        description: 
        <Box>
          <FaqParagraph>
            {`SEND può inviare notifiche per conto degli enti sia ai cittadini, cioè le "persone
            fisiche", che alle imprese, cioè le "persone giuridiche".`} 
          </FaqParagraph>
          <FaqTextSection>
            Per accedere a SEND e
            leggere le notifiche che ricevi come cittadino o cittadina vai su
          </FaqTextSection>
          <FaqLink href={PN_PF_URL} noSpaceAfter>
            cittadini.notifichedigitali.it
          </FaqLink>
          <FaqTextSection>
            {`. 
            Se sei Legale Rappresentante di un'impresa o hai i
            permessi per leggere le sue notifiche, vai su`} 
          </FaqTextSection>
          <FaqLink href={PN_PG_URL} noSpaceAfter>
            imprese.notifichedigitali.it
          </FaqLink>
          <FaqTextSection noSpaceAfter>
            .
          </FaqTextSection>
        </Box>
      },
      { id: 'send-come-funziona', title: 'Come funziona?', 
        description: [
          `Per inviarti una notifica, SEND dà la priorità ai tuoi recapiti digitali: legali (un
            indirizzo PEC) e di cortesia (app IO, e-mail, numero di telefono).`,
          `Anzitutto, SEND verifica se hai inserito dei recapiti di cortesia all'interno della
          sezione "I tuoi recapiti" o sei hai attivato il servizio "Notifiche digitali" su IO. Se ci
          sono, invia un messaggio a quei canali per avvisarti che c'è una notifica per te.`,
          `Poi, verifica se hai inserito una PEC all'interno della sezione "I tuoi recapiti". Se non
          l'hai inserita, cerca nei registri pubblici una PEC a te intestata. Se l'hai inserita o se
          è nei registri pubblici, invia lì l'avviso di avvenuta ricezione.`,
          `Se non riesce a raggiungerti tramite i recapiti digitali indicati, ti invia l'avviso di
          avvenuta ricezione tramite raccomandata cartacea.`,
        ]
      },
      { id: 'send-gia-operativa', title: 'È già operativa?', 
        description: 
        `Sì, SEND è operativa e usata da alcuni enti per inviare notifiche. L'adesione a SEND
        è una scelta degli enti: potrai quindi continuare a ricevere le raccomandate nella
        maniera tradizionale, come è stato fino ad ora.`
      },
      { id: 'send-come-accedere', title: 'Come posso accedere a SEND?', 
        description: 
        <Box>
          <Typography variant="body2" component="span" sx={{ mr: '4px' }}>
          Per accedere a SEND e leggere le notifiche che ricevi cittadino o cittadina vai su 
          </Typography>
          <Typography variant="body2" component="span">
            <a href="cittadini.notifichedigitali.it">cittadini.notifichedigitali.it</a>
          </Typography>
          <Typography variant="body2" component="span" sx={{ mr: '4px' }}>
            {`. 
            Se sei Legale Rappresentante di un'impresa o hai i
            permessi per leggere le sue notifiche, vai su`} 
          </Typography>
          <Typography variant="body2" component="span">
            <a href="react.dev">imprese.notifichedigitali.it</a>
          </Typography>
          <Typography variant="body2" component="span">
            . In entrambi i casi dovrai inserire le tue credenziali SPID o CIE.
          </Typography>
        </Box>
      },
    ] },
    { title: 'Recapiti', items: [
      { id: 'recapiti-dove-inserire', title: 'Dove posso inserire o modificare i miei recapiti digitali?', 
        description: 
          `Accedi a SEND e seleziona "I tuoi recapiti" dal menu laterale. Lì puoi inserire o
          modificare PEC, e-mail e numero di telefono, ma anche attivare il servizio
          "Notifiche digitali" di IO per ricevere un messaggio in app ogni volta che c'è una
          notifica per te. Se non hai ancora IO scarica l'app dallo store del tuo dispositivo,
          vai alla scheda del servizio "Notifiche digitali" di SEND e assicurati che l'opzione
          "Contattarti in app" sia attiva.`,
      },
      { id: 'recapiti-se-non-inserisco', title: 'Cosa succede se non inserisco nessun recapito digitale o se non posso accedere a SEND?', 
        description: 
          `Se nei registri pubblici c'è una PEC riconducibile a te, riceverai l'avviso di avvenuta
          ricezione a quell'indirizzo. Se non c'è, riceverai l'avviso di avvenuta ricezione
          tramite raccomandata cartacea. In entrambi i casi, dovrai accedere a SEND o
          andare in qualsiasi Ufficio Postale per ottenere i documenti notificati e gli
          eventuali altri documenti.`,
      },
      { id: 'recapiti-differenza-tra-tipi', title: `Che differenza c'è tra PEC, app IO, e-mail, numero di cellulare e raccomandata cartacea?`, 
        description: [
          `Se nella sezione "I tuoi recapiti" di SEND o in uno dei registri pubblici c'è una PEC
          a te riconducibile, riceverai l'avviso di avvenuta ricezione a quell'indirizzo. Per
          visualizzare i documenti notificati e pagare eventuali spese, dovrai accedere a
          SEND con SPID o CIE.`,
          `Se hai attivato il servizio "Notifiche digitali" di IO, quando c'è una notifica per te
          riceverai un messaggio in app. Potrai visualizzare i documenti notificati e pagare
          eventuali spese direttamente in IO, senza dover accedere a SEND con SPID o CIE.`,
          `Se hai inserito un'e-mail o un numero di cellulare, quando c'è una notifica per te
          riceverai un messaggio su questi canali. Per visualizzare i documenti notificati e
          pagare eventuali spese, dovrai accedere a SEND con SPID o CIE.`,
          `Se vuoi inserire o modificare i recapiti, accedi a SEND e vai alla sezione "I tuoi
          recapiti".`,
        ]
      },
      { id: 'recapiti-pec-recapito-principale', title: 'Cosa significa che la PEC verrà usata come "recapito principale"?', 
        description: [
          `Se non hai una PEC nei registri pubblici e ne inserisci una nella sezione "I tuoi
          recapiti", verrà utilizzata come recapito principale per inviarti gli avvisi di avvenuta
          ricezione. Inserendola non riceverai più raccomandate cartacee, a meno che l'invio
          non fallisca.`,
          `Se hai una PEC nei registri pubblici e ne inserisci un'altra nella sezione "I tuoi
          recapiti", quella inserita in SEND verrà utilizzata come recapito principale. Se non
          la inserisci in SEND, la PEC nei registri pubblici sarà comunque utilizzata, a
          prescindere dall'oggetto della notifica.`,
        ]
      },
    ] },
    { title: 'Documenti e comunicazioni', items: [
      { id: 'documenti-aar', title: `Cos'è un avviso di avvenuta ricezione?`, 
        description: 
        <Box>
          <FaqParagraph flat>
            {`È il documento che ricevi quando la notifica ti viene inviata tramite PEC o
              raccomandata cartacea. L'invio di questo documento ha di per sé valore legale
              perché contiene le informazioni essenziali della notifica, ossia:`} 
          </FaqParagraph>
          <ul style={{marginTop: 0}}>
            <li>
              <FaqTextSection noSpaceAfter>
                {`l'ente che te l'ha inviata;`} 
              </FaqTextSection>
            </li>
            <li>
              <FaqTextSection noSpaceAfter>
                {`il codice identificativo (IUN);`} 
              </FaqTextSection>
            </li>
            <li>
              <FaqTextSection noSpaceAfter>
                {`l'oggetto;`} 
              </FaqTextSection>
            </li>
            <li>
              <FaqTextSection noSpaceAfter>
                {`le indicazioni per ottenere i documenti notificati e gli eventuali allegati.`} 
              </FaqTextSection>
            </li>
          </ul>
        </Box>
      },
      { id: 'documenti-iun', title: `Cos'è il codice IUN?`, 
        description: 
          `Lo IUN è un codice composto da lettere e numeri. Serve a identificare ogni notifica
          in modo univoco.`,
      },
      { id: 'documenti-avviso-di-cortesia', title: `Cos'è l'avviso di cortesia?`, 
        description: [
          `Se hai attivato il servizio "Notifiche digitali" di SEND nell'app IO o se hai inserito un
          indirizzo e-mail o un numero di telefono nella sezione "I tuoi recapiti" di SEND,
          quando c'è una notifica per te riceverai un avviso di cortesia, cioè un messaggio
          per fartelo sapere.`,
          `Se ricevi il messaggio su IO, puoi visualizzare i documenti notificati e pagare
          eventuali spese direttamente in app. Se ricevi un'e-mail o SMS, accedi a SEND per
          visualizzare i documenti notificati e pagare eventuali spese.`,
        ]
      },
      { id: 'documenti-amr', title: `Cos'è l'avviso di mancato recapito?`, 
        description: 
          `È un documento che attesta che SEND ha cercato di inviarti la notifica via PEC per
          due volte, ma non è riuscita a raggiungerti. Anche in questo caso, gli effetti giuridici
          della notifica si producono comunque.`,
      },
      { id: 'documenti-attestazione', title: `Cos'è l'attestazione opponibile a terzi?`, 
        description: 
          `È un documento che attesta un cambio di stato della notifica, per esempio
          "perfezionata per visione" o "invio in corso", e in quanto tale può essere fatto
          valere nei confronti di terzi.`,
      },
      { id: 'documenti-stato-della-notifica', title: `Cos'è la sezione "Stato della notifica"?`, 
        description: [
          `È una sezione che si trova in SEND nel dettaglio della notifica, a destra. Qui puoi
          vedere i vari passaggi del ciclo di vita della notifica, per esempio quando l'ente l'ha
          depositata in SEND, quando e come SEND l'ha inviata, quando l'hai ricevuta, e così
          via.`,
          `Sotto agli stati che lo prevedono, troverai la relativa attestazione opponibile a terzi
          o ricevuta. Puoi visualizzare e scaricare questi documenti in ogni momento.`,
        ]
      },
    ] },
    { title: 'Ricezione di una notifica', items: [
      { id: 'ricezione-ricevuto-aar', 
        title: `Ho ricevuto un avviso di avvenuta ricezione tramite raccomandata cartacea. Cosa devo fare?`, 
        description: [
          `Devi ottenere e leggere i documenti notificati e gli eventuali altri documenti. Hai
          due modi per farlo: gratis, inquadrando il codice QR o digitando nella barra di
          ricerca del tuo browser l'URL che trovi nell'avviso di avvenuta ricezione, o a
          pagamento in qualsiasi Ufficio Postale`,
          `Se lo ritiri in Ufficio Postale, porta con te l'avviso di avvenuta ricezione, un tuo
          documento di riconoscimento e il tuo Codice Fiscale o Partita IVA. Se hai ricevuto
          la notifica in qualità di persona giuridica, dovrai mostrare anche un documento che
          attesti il tuo ruolo di legale rappresentante. Una volta ottenuti i documenti, leggili
          e paga eventuali spese.`,
          `Ricorda che l'invio dell'avviso di avvenuta ricezione ha di per sé valore legale
          perché contiene le informazioni essenziali della notifica.`,
        ]
      },
      { id: 'ricezione-ricevuto-messaggio-appio', 
        title: `Ho ricevuto un messaggio sull'app IO dal servizio "Notifiche digitali" di SEND. Cosa devo fare?`, 
        description: 
          `Apri il messaggio, leggi i documenti notificati e paga eventuali spese. Se non hai
          una PEC nei registri pubblici o non l'hai fornita su SEND e apri un messaggio su IO
          entro 5 giorni (120 ore) dal suo invio, non riceverai la notifica tramite raccomandata
          cartacea.`,
      },
      { id: 'ricezione-ricevuto-sms', 
        title: `Ho ricevuto un SMS da SEND che dice che c'è una notifica per me. Cosa devo fare?`, 
        description: 
          `Accedi a SEND con SPID o CIE, leggi i documenti notificati e paga eventuali spese.
          Se non hai una PEC nei registri pubblici o non l'hai fornita su SEND e accedi a
          SEND entro 5 giorni (120 ore) dall'invio dell'SMS, non riceverai la notifica tramite
          raccomandata cartacea.`,
      },
      { id: 'ricezione-ricevuto-email', 
        title: `Ho ricevuto un'e-mail da SEND che dice che c'è una notifica per me. Cosa devo fare?`, 
        description: 
          `Accedi a SEND con SPID o CIE, leggi i documenti notificati e paga eventuali spese.
          Se non hai una PEC nei registri pubblici o non l'hai fornita su SEND e accedi a
          SEND entro 5 giorni (120 ore) dall'invio dell'e-mail, non riceverai la notifica tramite
          raccomandata cartacea.`,
      },
      { id: 'ricezione-delegare-ritiro-ufficio-postale', 
        title: 
          `Ho ricevuto un avviso di avvenuta ricezione tramite raccomandata cartacea 
           e vorrei delegare una persona a ritirarli al posto mio in Ufficio Postale. Posso farlo?`, 
        description: [
          `Sì: per farlo, compila e firma il modulo per la delega che trovi nell'avviso di
          avvenuta ricezione che hai ricevuto. La persona delegata dovrà portare con sé
          l'avviso di avvenuta ricezione, un suo documento di riconoscimento, il suo Codice
          Fiscale o Partita IVA, una copia o l'originale del tuo Codice Fiscale e di un tuo
          documento di riconoscimento. Se hai ricevuto la notifica in qualità di persona
          giuridica, dovrà mostrare anche un documento che attesti il tuo ruolo di legale
          rappresentante.`,
          `Ricorda che l'invio dell'avviso di avvenuta ricezione ha di per sé valore legale
          perché contiene le informazioni essenziali della notifica.`,
        ]
      },
      { id: 'ricezione-delegare', 
        title: `Voglio delegare una persona a ricevere le mie notifiche. Posso farlo?`, 
        description: [
          `Sì: per farlo, accedi a SEND con SPID o CIE e vai alla sezione "Deleghe". Poi, premi
          "Aggiungi una delega", inserisci i dati e invia la richiesta. Vedrai un codice di
          verifica: condividilo con la persona delegata. Questa dovrà accedere a SEND con il
          suo SPID o CIE, andare alla sezione "Deleghe" e accettare la delega inserendo il
          codice. Da quel momento, la persona delegata riceverà le eventuali tue notifiche.`,
          `Se vuoi revocare una delega, puoi farlo in ogni momento sempre alla sezione
          "Deleghe".`,
        ]
      },
      { id: 'ricezione-essere-delegato', 
        title: `Voglio essere delegato/a da una persona a ricevere le sue notifiche. Posso farlo?`, 
        description: 
          `Sì: per farlo, chiedi alla persona di accedere a SEND con SPID o CIE e di andare
          alla sezione "Deleghe". Dille di premere "Aggiungi una delega", inserire i dati e
          inviare la richiesta. Dovrà poi condividere con te un codice di verifica. A questo
          punto, accedi a SEND con il tuo SPID o CIE, vai alla sezione "Deleghe" e accetta la
          delega inserendo il codice. Da quel momento, riceverai le eventuali notifiche di
          quella persona.`,
      },
      { id: 'ricezione-durata-disponibilita', 
        title: `Per quanto tempo restano disponibili i documenti della notifica?`, 
        description: 
        <Box>
          <Typography variant="body2" component="span" sx={{ mr: '4px' }}>
            Per 120 giorni a partire dalla
          </Typography>
          <Typography variant="body2" component="span">
            <a href={PERFEZIONAMENTO_PATH}>data di perfezionamento</a>
          </Typography>
          <Typography variant="body2" component="span" sx={{ mr: '4px' }}>
            {`. 
            Oltre quel termine, non
            potrai più né visualizzarli dall'app IO o da SEND, né richiederne la stampa presso
            un Ufficio Postale. Dovrai contattare l'ente che te li ha inviati.`} 
          </Typography>
        </Box>
      },
      { id: 'ricezione-se-ignoro', 
        title: `Cosa succede se ignoro la notifica?`, 
        description: [
          `Che tu abbia ricevuto l'avviso di avvenuta ricezione in digitale o cartaceo, o che tu
          l'abbia visualizzata su IO o direttamente in piattaforma, gli effetti giuridici della
          notifica si produrranno anche se decidi di ignorarla.`,
          `La notifica produce effetti giuridici anche se è stato depositato in piattaforma il
          relativo avviso di mancato recapito.`,
        ]
      },
    ] },
    { title: 'Perfezionamento', items: [
      { id: 'perfezionamento-cosa-significa', 
        title: `Cosa significa "perfezionamento"?`, 
        description: 
          `Quando una notifica si perfeziona, significa che assume valore di legge per tutte le
          diverse finalità. Per esempio, dalla data di perfezionamento di una notifica
          decorrono i termini per esercitare i relativi diritti, impugnare atti, pagare sanzioni.`,
      },
      { id: 'perfezionamento-quando', 
        title: `Quando si perfeziona una notifica?`, 
        description: 
        <Box>
          <FaqTextSection>
            {`Una notifica si perfeziona in momenti diversi per l'ente che la invia e per il
            destinatario che la riceve. Per chi la invia, si perfeziona nella data in cui il
            documento da notificare è reso disponibile in piattaforma. Per chi la riceve, il
            perfezionamento dipende da come riceve o legge la notifica.`}
          </FaqTextSection>
          <FaqLink href={PERFEZIONAMENTO_PATH}>
            Vai qui
          </FaqLink>
          <FaqTextSection noSpaceAfter>
            {`per conoscere i tempi di perfezionamento di una notifica a seconda del canale 
            con cui la si è ricevuta o visualizzata.`} 
          </FaqTextSection>
        </Box>
      },
      { id: 'perfezionamento-come-posso-sapere', 
        title: `Come posso sapere quando una notifica si è perfezionata?`, 
        description: 
          `Accedi a SEND con SPID o CIE e premi sulla notifica. Troverai questa informazione
          sulla destra, nella sezione "Stato della notifica".`,
      },
    ] },
  ]
};
