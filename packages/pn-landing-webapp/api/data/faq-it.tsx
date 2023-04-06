import { Box, Typography } from "@mui/material";
import { IFaqData } from "model";

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
          “notifiche” sono quindi diverse dalle “notifiche push”, cioè quei brevi messaggi che
          ricevi sullo schermo del tuo dispositivo.`,
          `Fino ad ora, queste comunicazioni venivano inviate quasi sempre tramite
          raccomandata cartacea. Adesso, invece, potrai riceverle in digitale.`
        ]
      },
      { id: 'notifiche-valore-legale', title: 'Cosa significa che una comunicazione è “a valore legale”?', 
        description: 
        `Significa che l'invio e la ricezione di queste comunicazioni producono degli effetti
        giuridici sia nei confronti di chi le invia che di chi le riceve. Per esempio, se ricevi
        una multa per violazione del codice stradale, la data in cui la ricevi incide
        sull'importo che dovrai pagare o sulla tua facoltà di contestarla`
      },
      { id: 'notifiche-composizione', title: 'Da cosa è composta una notifica?', 
        description: [
          `Fino ad ora ogni notifica era composta da uno o più “atti”, cioè i documenti
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
          <Typography variant="body2" component="div" sx={{ mb: '12px' }}>
            SEND può inviare notifiche per conto degli enti sia ai cittadini, cioè le “persone
            fisiche”, che alle imprese, cioè le ”persone giuridiche”. 
          </Typography>
          <Typography variant="body2" component="span" sx={{ mr: '4px' }}>
            Per accedere a SEND e
            leggere le notifiche che ricevi come cittadino o cittadina vai su
          </Typography>
          <Typography variant="body2" component="span">
            <a href="cittadini.notifichedigitali.it">cittadini.notifichedigitali.it</a>
          </Typography>
          <Typography variant="body2" component="span" sx={{ mr: '4px' }}>
            . 
            Se sei Legale Rappresentante di un’impresa o hai i
            permessi per leggere le sue notifiche, vai su 
          </Typography>
          <Typography variant="body2" component="span">
            <a href="react.dev">imprese.notifichedigitali.it</a>
          </Typography>
          <Typography variant="body2" component="span">
            . 
          </Typography>
        </Box>
      },
    ] },
  ]
};
