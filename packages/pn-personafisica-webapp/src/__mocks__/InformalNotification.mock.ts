import { BffFullInformalNotificationV1 } from '../generated-client/informal-notifications';

export const informalNotificationMock: BffFullInformalNotificationV1 = {
  senderDenomination: 'Xr94TD?>A]Rz>s,SSP2[2/B',
  senderPaId: 'string',
  campaignId: 'string',
  additionalLanguages: ['string'],
  documentsAvailable: true,
  subject: 'string',
  recipients: [
    {
      recipientType: 'PF',
      taxId: '34601227120',
      internalId: 'string',
      denomination: "Documento di prova dell'ente",
      digitalDomicile: {
        type: 'PEC',
        address: 'account@domain.it',
      },
      physicalAddress: {
        at: 'p|fPYz"5q}G4"yZR6_rE:p%W_H=7&XfQjbdYJJLX8xP$qTg%',
        address: 'G&$Hm%l/upYfTH8F=|v|i{Uq Jm-Eb?I|{Zdel/O_\\gcqs%D5*\\XL]',
        addressDetails: '>tcIT3(oX0M4TI',
        zip: 'SW ',
        municipality: '4tM,d]Y/d<C\\v"Ql(vF,Z0ZMW:( C=q ]?&{rS[y3Y_v"]-2',
        municipalityDetails: "Qd:BF_1bUpX-MP&`)hFm'Qbc72=6_N.,O]LU> h&}LZ0s}L+Uj+z?N)* q",
        province: "hXqx)NG*&$/zPK;3>KMFSu-pa1<kq0is'?*e]AC_i",
        foreignState: 's}Gd_o<uFwyE;H{,ao;F51r8gHO5r4R%A5&KvTl_k99Ckf/tpB>X|3k',
      },
      payments: [
        {
          pagoPa: {
            noticeCode: '302000100000019421',
            creditorTaxId: '77777777777',
            amount: 60.68,
            dueDate: '2026-05-26',
            attachment: {
              digests: {
                sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
              },
              contentType: 'application/pdf',
              ref: {
                key: 'e_MwBg7QM-eKFAn3PwunJvcMKGVWEjGVNGcwQXkf1PNhdGyv1.77DHfsj5tjXsg1l6aYuwAtgZ0oWtIZIpbkw3thD5TlF',
                versionToken:
                  'R%<-okyZYY5Y^HU9#t%d~QB9WX+\\lTRxIB#$,>E=W=\\7(yg3@6y((br9u^UE)n:b. ^u!)pa71=6hm*',
              },
            },
          },
        },
      ],
      messageId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      email: 'account@domain.it',
      //TODO manca contatti mittente // Creazione API NUOVA
      phoneNumber: '3900000000',
      message: {
        primaryMessage: {
          subject: 'Sollecito di pagamento Tari 2023',
          longBody: `Ciao Gervasia Mentini,

**Sorical S.p.A.** ti informa che è stata emessa una fattura per l'utenza **182140** relativa al periodo **23 dicembre 2025 / 31 marzo 2026**.

Di seguito trovi le principali informazioni relative al pagamento:

* **Importo:** 60,68 €
* **Scadenza:** 26 maggio 2026

Per maggiori dettagli consulta gli **allegati** disponibili nella sezione dedicata.

Puoi effettuare il pagamento direttamente tramite **PagoPA**. In alternativa, puoi utilizzare l'**avviso di pagamento** allegato presso tutti i canali abilitati.

Per qualsiasi necessità puoi contattare **Sorical S.p.A.** attraverso i canali ufficiali.

Per ulteriori informazioni visita il sito: [www.sorical.it](https://www.sorical.it)

Grazie per l'attenzione.`,
          shortBody: 'Sollecito Tari: hai una nuova comunicazione da SEND.',
          language: 'string',
        },
        additionalMessage: {
          subject: 'Sollecito di pagamento Tari 2023',
          longBody: 'Gentile cittadino, la informiamo che...',
          shortBody: 'Sollecito Tari: hai una nuova comunicazione da SEND.',
          language: 'string',
        },
      },
    },
  ],
  documents: [
    {
      digests: {
        sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'WcNPoozzeINgVPM6jTCwNnnhQ7NsM1WuMBlKwbRXkHNJWXEjkK18OoTt3KQ44p82Y_n3336jgearZemwzr6GTtJN8cr1Ex7MWdR1f',
        versionToken:
          'obz_WRtNp2j!|4 DEjtuI~vr$wSX`K*D"QzZXEQ.[8=S<W@^H={4D3@s$nU4SRVWi\')<],IjYU~i&',
      },
      title: 'V{v=EYzT:6|(\'xSNnJ37 hj|+UHpwa_"@g',
      docIdx: '141',
    },
  ],
  group: 'fH3WxlE=.7qJeO.epIlIbcZUkjQr5mypG:NU=[3*ZSg1wn\\pjb',
  iun: 'UUDE-FVGR-ERLR-640815-N-7',
  filedAt: '2026-07-01T13:03:22.493Z',
  notificationStatus: 'IN_VALIDATION',
};
