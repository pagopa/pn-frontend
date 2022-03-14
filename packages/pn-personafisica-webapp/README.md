## Lanciare l'applicazione localmente per lavorare con autenticazione

Modifica il file di hosts del tuo OS di riferimento [windows](https://en.wikiversity.org/wiki/Hosts_file/Edit) [mac](https://osxdaily.com/2012/08/07/edit-hosts-file-mac-os-x/)

con la seguente entry:

`127.0.0.1 portale-pf-develop.fe.dev.pn.pagopa.it`

aggiungi un nuovo file di .env nella root di progetto dal nome `.env.development.local`.
All'interno aggiungi tutte le variabili d'ambiente necessarie e in cosa aggiungi:

```
HOST='portale-pf-develop.fe.dev.pn.pagopa.it'
HTTPS=true
PORT=443
```

Ora puoi lanciare `yarn start` e avverrà il redirect dall'url di riferimento all'app servita su localhost.

### Traduzioni
La Piattaforma per il cittadino è dotata di supporto per l'internazionalizzazione. L'unica lingua al momento presente è l'italiano. Il tool usato per fornire l'internazionalizzazion è [react-i18next](https://react.i18next.com/).

E' fortemente consigliato quindi wrappare i testi (anche se non è fornita traduzione o non salvati al momento su file di traduzione) utilizzando l'hook [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook).
