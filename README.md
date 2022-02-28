## Piattaforma notifiche

### Start

Nella root del progetto

`yarn install`
in caso di errore di autenticazione, utilizzare il comando: 
`yarn config set "strict-ssl" false -g`

Avviare le applicazioni

- `yarn start:pf` per avviare localmente il portale per i cittadini
- `yarn start:pa` per avviare localmente il portale per la PA

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

- packages/pn-commons applicazione con componenti in comune
- packages/pn-pa-webapp portale per la pubblica amministrazione
- packages/pn-personafisica-webapp portale per il cittadino

https://medium.com/geekculture/setting-up-monorepo-with-create-react-app-cb2cfa763b96


### Sonar

E' possibile eseguire un task di analisi con sonar-scanner tramite lo script
- `yarn sonar`
Per essere eseguibile in locale, è necessario creare sull'ambiente locale una variable d'ambiente SONAR_TOKEN con il token del progetto sonar di riferimento.
L'analisi sonar sarà disponibile [qui](https://sonarcloud.io/project/overview?id=pagopa_pn-frontend)