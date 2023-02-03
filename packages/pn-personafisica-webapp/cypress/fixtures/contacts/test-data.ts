export default {
  copy: {
    pec: {
      title: 'PEC',
      subtitle:
        'Quando c’è una notifica per te, ti inviamo qui l’avviso di avvenuta di ricezione. Accedi a Piattaforma Notifiche per leggerla e pagare eventuali spese.',
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
        'Quando c’è una notifica per te, ti inviamo un messaggio su IO. Puoi leggerla e pagare eventuali spese direttamente in app. Qui ricevi anche eventuali comunicazioni importanti.',
      disclaimer:
        'Scarica l’app IO, accedi e assicurati che il servizio "Notifiche digitali" di Piattaforma Notifiche sia attivo',
    },
    courtesy: {
      title: 'Email o SMS',
      subtitle:
        'Quando c’è una notifica per te, ti inviamo un’email o un SMS. Accedi a Piattaforma Notifiche per leggerla e pagare eventuali spese. Qui ricevi anche eventuali comunicazioni importanti.',
      disclaimer:
        'Se non hai la PEC, leggi la notifica entro 5 giorni dalla ricezione del messaggio: non riceverai la raccomandata cartacea e risparmierai tempo e denaro.',
    },
    mail: {
      inputPlaceholder: 'Il tuo indirizzo email',
      inputInvalidMessage: 'Indirizzo email non valido',
      confirmButton: 'Avvisami via email',
      successMessage: 'Indirizzo email aggiunto correttamente',
      modalDescriptionValue: 'l’indirizzo e-mail',
      modalHelpValue: 'l’indirizzo e-mail',
    },
    phone: {
      inputPlaceholder: 'Il tuo cellulare',
      inputInvalidMessage: 'Numero di cellulare non valido',
      confirmButton: 'Avvisami via SMS',
      successMessage: 'Numero di cellulare aggiunto correttamente',
      modalDescriptionValue: 'il numero di cellulare',
      modalHelpValue: 'il numero di cellulare',
    },
    additional: {
      title: 'Altri recapiti',
      subtitle:
        'Se vuoi che le notifiche di alcuni enti siano indirizzate a dei recapiti diversi puoi indicarli qui, in sostituzione di quelli principali.',
      senderPlaceholder: 'Ente*',
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
      errorTitle: 'Il codice inserito non è corretto',
      errorMessage: 'Prova a reinserirlo, oppure genera un nuovo codice.',
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
      sender2: '4db741cf-17e1-4751-9b7b-7675ccca472b',
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
