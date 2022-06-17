export const infoBlocks = [
  {
    name: 'infoblock 1',
    payload: {
      overline: 'Rappresenti un ente?',
      title: 'Un modo più semplice di gestire le notifiche',
      content: `Piattaforma Notifiche digitalizza e semplifica la gestione delle notifiche a valore legale. Gli enti mittenti non devono che depositare l’atto da notificare: sarà la piattaforma a occuparsi dell’invio, per via digitale o analogica.
    
      Con Piattaforma Notifiche, diminuisce l’incertezza della reperibilità dei destinatari e si riducono i tempi e i costi di gestione.`,
      // ctaPrimary?: CTA,
      // ctaSecondary?: CTA,
      inverse: false,
      image: 'URL_INFOBLOCK_1',
      altText: '',
      imageShadow: false,
      // imageType?: "circle",
      // aspectRatio?: "4/3" | "9/16"
    }
  }, {
    name: 'infoblock 2',
    payload: {
      title: 'Carica l’atto. Poi, dimenticatene',
      content: `Piattaforma Notifiche si integra con il protocollo degli enti e offre sia API per l'inoltro automatico di notifiche che la possibilità di fare invii manuali. Una volta effettuato il caricamento degli atti e dei moduli di pagamento, la piattaforma genera lo IUN, un codice univoco identificativo della notifica.

      Poi, cerca nei suoi archivi e nei registri pubblici un recapito digitale riconducibile al destinatario e invia la notifica. Se non lo trova, procede con la ricerca di un indirizzo fisico, e quindi con l’invio tramite raccomandata cartacea.`,
      inverse: true,
      image: 'URL_INFOBLOCK_2',
      altText: '',
      imageShadow: false,
      // imageType?: "circle",
      // aspectRatio?: "4/3" | "9/16"
    }
  }, {
    name: 'infoblock 3',
    payload: {
      title: 'E il destinatario?',
      content: `Il destinatario riceve l’avviso di avvenuta ricezione a un recapito digitale tra PEC, App IO, email e SMS. Poi accede alla piattaforma tramite SPID o CIE, dove può visionare e scaricare gli atti notificati. Grazie all’integrazione con pagoPA, può anche pagare contestualmente quanto dovuto.

      Come l’ente, anche il desinatario ha accesso alla cronologia degli stati della notifica e alle relative attestazioni opponibili a terzi. `,
      ctaPrimary: {
        label: "Aderisci a Piattaforma Notifiche",
        title: "Aderisci title",
        href: "#",
      },
      inverse: false,
      image: 'URL_INFOBLOCK_3',
      altText: '',
      imageShadow: false,
      // imageType?: "circle",
      // aspectRatio?: "4/3" | "9/16"
    }
  }
];