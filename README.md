## Piattaforma notifiche

### Start

Nella root del progetto

`yarn install`
in caso di errore di autenticazione, utilizzare il comando: 
`yarn config set "strict-ssl" false -g`

Avviare le applicazioni

- `yarn start:pf` per avviare localmente il portale per i cittadini
- `yarn start:pa` per avviare localmente il portale per la PA
- `yarn start:login` per avviare localmente il portale di login per il cittadino (va su localhost:3000)
- `yarn start:landing` per avviare localmente il sito landing (va su localhost:3000)

In ogni caso, si può sempre navigare nella cartella del package di riferimento e lanciare

```
cd packages/<cartella di riferimento>
yarn start
```

Per eseguire i test di tutti i packages
`yarn test`

Per eseguire la build di tutto il monorepo
`yarn build`

Altri script disponibili

- `yarn refresh:monorepo` per refreshare e reinstallare le dipendenze su tutto il workspace
- `yarn clean:win` o `yarn clean:nx` per eliminare i node_modules a livello di workspace (win se Os di riferimento è Windows, nx se Os di riferimento e linux-based)


### Lerna

Questo progetto usa [lerna](https://github.com/lerna/lerna) e [craco](https://github.com/gsoft-inc/craco)
Grazie a questi tool è possibile avere un monorepo con webapp separate che condividono alcune componenti.
Il monorepo contiene quindi:

- packages/pn-commons component-library per Piattaforma Notifiche
- packages/pn-pa-webapp portale per la pubblica amministrazione
- packages/pn-personafisica-webapp portale per il cittadino
- packages/pn-personafisica-login portale login per il cittadino
- packages/pn-landing-webapp sito landing di Piattaforma Notifiche

https://medium.com/geekculture/setting-up-monorepo-with-create-react-app-cb2cfa763b96


### Sonar

E' possibile eseguire un task di analisi con sonar-scanner tramite lo script
- `yarn sonar`
Per essere eseguibile in locale, è necessario creare sull'ambiente locale una variable d'ambiente SONAR_TOKEN con il token del progetto sonar di riferimento.
L'analisi sonar sarà disponibile [qui](https://sonarcloud.io/project/overview?id=pagopa_pn-frontend)


### Version

Utilizzare il comando `lerna version` dal branch `main` per rilasciare una nuova versione

Il tool rileva in automatico i package che sono stati modificati a partire dall'ultima versione e si occupa di aggiornare i file delle dipendenze ed eseguire i comandi git commit, tag e push.

E' possibile procedere in uno dei modi seguenti:
- `lerna version 1.0.1` per scegliere esplicitamente un numero di versione
- `lerna version patch` per effettuare l'avanzamento secondo la convenzione SemVer
- `lerna version`       per scegliere dal prompt


Per un elenco e una descrizione più dettagliata delle varie opzioni disponibili fare riferimento alla specifica del comando presente su [github](https://github.com/lerna/lerna/tree/main/commands/version)