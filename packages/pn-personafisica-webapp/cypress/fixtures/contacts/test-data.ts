export default {
  copy: {
    pec: {
      title: 'PEC',
      subtitle:
        'Quando c’è una notifica per te, ti inviamo qui l’avviso di avvenuta di ricezione. Accedi a SEND per leggerla e pagare eventuali spese.',
      inputPlaceholder: 'Il tuo indirizzo PEC',
      inputInvalidMessage: 'Indirizzo PEC non valido',
      confirmButton: 'Conferma',
      disclaimer:
        'Questo è l’indirizzo principale che verrà utilizzato per inviarti gli avvisi di avvenuta ricezione in via digitale. Inserendolo, non riceverai più raccomandate cartacee.',
      successMessage: 'PEC associata correttamente',
      modalDescriptionValue: 'l’indirizzo PEC',
      modalHelpValue: 'l’indirizzo PEC',
    },
    io: {
      title: 'App IO',
      subtitle:
        'Attiva il servizio “Notifiche digitali”: quando c’è una notifica per te, ti inviamo un messaggio in app, dove puoi leggerla e pagare eventuali spese. Qui ricevi anche eventuali comunicazioni importanti.',
      disclaimer:
        'Scarica l’app IO, accedi e assicurati che il servizio "Notifiche digitali" di SEND sia attivo',
      enabled: 'Attivo',
      disabled: 'Non attivo',
      enable: 'Attiva',
      disable: 'Disattiva',
      modal: {
        enable: {
          title: 'Vuoi attivare il servizio "Notifiche digitali" su IO?',
          content:
            "Se non hai una PEC e accedi alla notifica entro 5 giorni (120 ore) dall’invio del messaggio, non riceverai l'avviso di avvenuta ricezione tramite raccomandata.",
          checkboxText: 'Ho capito',
          confirmButton: 'Attiva servizio',
        },
        disable: {
          title: 'Vuoi disattivare il servizio "Notifiche digitali" su IO?',
          content: 'Quando ti arriva una notifica, non riceverai più un messaggio in app.',
        },
      },
    },
    courtesy: {
      title: 'Email o SMS',
      subtitle:
        'Quando c’è una notifica per te, ti inviamo un’email o un SMS. Accedi a SEND per leggerla e pagare eventuali spese. Qui ricevi anche eventuali comunicazioni importanti.',
      disclaimer:
        'Se non hai la PEC, leggi subito la notifica: non riceverai la raccomandata cartacea e risparmierai tempo e denaro.',
    },
    mail: {
      inputPlaceholder: 'Il tuo indirizzo email',
      inputInvalidMessage: 'Indirizzo email non valido',
      confirmButton: 'Avvisami via email',
      successMessage: 'Indirizzo email aggiunto correttamente',
      modalDescriptionValue: 'l’indirizzo e-mail',
      modalHelpValue: 'l’indirizzo e-mail',
      modal: {
        content:
          "Se non hai una PEC e accedi alla notifica su SEND entro 5 giorni (120 ore) dall’invio dell'e-mail, non riceverai l'avviso di avvenuta ricezione tramite raccomandata.",
        checkboxText: 'Ho capito',
        confirmButton: 'Conferma',
      },
    },
    phone: {
      inputPlaceholder: 'Il tuo cellulare',
      inputInvalidMessage: 'Numero di cellulare non valido',
      confirmButton: 'Avvisami via SMS',
      successMessage: 'Numero di cellulare aggiunto correttamente',
      modalDescriptionValue: 'il numero di cellulare',
      modalHelpValue: 'il numero di cellulare',
      modal: {
        content:
          "Se non hai una PEC e accedi alla notifica su SEND entro 5 giorni (120 ore) dall’invio dell'SMS, non riceverai l'avviso di avvenuta ricezione tramite raccomandata.",
        checkboxText: 'Ho capito',
        confirmButton: 'Conferma',
      },
    },
    additional: {
      title: 'Altri recapiti',
      subtitle:
        'Se vuoi che le notifiche di alcuni enti siano indirizzate a dei recapiti diversi puoi indicarli qui, in sostituzione di quelli principali.',
      senderPlaceholder: 'Ente',
      addrTypePlaceholder: 'Indirizzo PEC',
      pecPlaceholder: 'Indirizzo PEC*',
      mailPlaceholder: 'Indirizzo mail*',
      invalidPecMessage: 'Indirizzo PEC non valido',
      invalidPhoneMessage: 'Numero di cellulare non valido',
      confirmButton: 'Conferma',
      successPecMessage: 'PEC associata correttamente',
      successPhoneMessage: 'Numero di cellulare aggiunto correttamente',
    },
    modal: {
      title: 'Abbiamo inviato un codice a {{value}}',
      description:
        'Inseriscilo qui sotto per confermare {{value}}. Il codice è valido per 10 minuti.',
      insertCode: 'Inserisci codice',
      help: 'Non l’hai ricevuto? Controlla che {{value}} sia corretto o generane uno nuovo.',
      errorTitle: 'Il codice è sbagliato',
      errorMessage: 'Controllalo e inseriscilo di nuovo, oppure generane un altro.',
    },
  },
  data: {
    pec: {
      invalid: 'pec.cypress.pagopa.it',
      valid: 'pec@cypress.pagopa.it',
    },
    io: {
      value: 'APPIO',
      code: '00000',
    },
    mail: {
      invalid: 'email.cypress.pagopa.it',
      valid: 'email@cypress.pagopa.it',
    },
    phone: {
      invalid: '1112121212',
      valid: '3210123456',
      validWithIntPrefix: '+393210123456',
    },
    additional: {
      sender: '026e8c72-7944-4dcd-8668-f596447fec6d',
      invalidPec: 'pec.cypress.pagopa.it',
      validPec: 'pec@cypress.pagopa.it',
      invalidPhone: '1234567890',
      validPhone: '3331234567',
      validPhoneWithIntPrefix: '+393331234567',
    },
    codes: {
      invalid: '12345',
      valid: '54321',
    },
  },
};
