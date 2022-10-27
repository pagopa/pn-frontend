## Lanciare l'applicazione localmente per lavorare con autenticazione - ITA

Modifica il file di hosts del tuo OS di riferimento [windows](https://en.wikiversity.org/wiki/Hosts_file/Edit) [mac](https://osxdaily.com/2012/08/07/edit-hosts-file-mac-os-x/)

con la seguente entry:

`127.0.0.1 portale.dev.pn.pagopa.it`

aggiungi un nuovo file di .env nella root di progetto dal nome `.env.development.local`.
All'interno aggiungi tutte le variabili d'ambiente necessarie e in cosa aggiungi:

```
HOST='portale.dev.pn.pagopa.it'
HTTPS=true
PORT=443
```

Ora puoi lanciare `yarn start` e avverrà il redirect dall'url di riferimento all'app servita su localhost.

### Traduzioni
La Piattaforma per il cittadino è dotata di supporto per l'internazionalizzazione. L'unica lingua al momento presente è l'italiano. Il tool usato per fornire l'internazionalizzazion è [react-i18next](https://react.i18next.com/).

E' fortemente consigliato quindi wrappare i testi (anche se non è fornita traduzione o non salvati al momento su file di traduzione) utilizzando l'hook [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook).

## Variabili d'ambiente (sviluppo)

E' necessario aggiungere nel proprio file .env.local le seguenti variabili d'ambiente:

```
REACT_APP_URL_FE_LOGIN
REACT_APP_URL_API
REACT_APP_PAYMENT_DISCLAIMER_URL
REACT_APP_PAGOPA_HELP_EMAIL= email di assistenza, si puo' usare una email fittizia in sviluppo
REACT_APP_DISABLE_INACTIVITY_HANDLER = true se si vuole disabilitare la gestione dell'inattivita' utente, falsa altrimenti
```

## Run app in local with auth - ENG

Edit your hosts file depending on your OS [windows] (https://en.wikiversity.org/wiki/Hosts_file/Edit) [mac](https://osxdaily.com/2012/08/07/edit-hosts-file-mac-os-x/)

with this entry:

`127.0.0.1 portale.dev.pn.pagopa.it`

add a new .env file in this root with name `.env.development.local`. Then edit it with these commands:

```
HOST='portale.dev.pn.pagopa.it'
HTTPS=true
PORT=443
```

Now you can run `yarn start` to make redirect from reference URL to app in localhost.

### Translations
The Platform for Citizen have int'l translation support. The only language present is italian. The tool used for translations is [react-i18next](https://react.i18next.com/).

Is strongly recommended to wrap texts (even if no "official" translations are available not saved to translation files) by using hook [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook).


## Env variables (development)

You need to add following variables to your `.env.development.local` file:

```
REACT_APP_URL_FE_LOGIN
REACT_APP_URL_API
REACT_APP_PAYMENT_DISCLAIMER_URL
REACT_APP_PAGOPA_HELP_EMAIL = support email, you can use a fake one in development.
REACT_APP_DISABLE_INACTIVITY_HANDLER = true if you want to disable user inactivity check.
```
