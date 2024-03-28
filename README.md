## SEND - Servizio Notifiche Digitali

### Start

In project root run

`yarn install`

If you get an authentication error, please use this command:
`yarn config set "strict-ssl" false -g`

Starting applications

- `yarn start:pf` to start app for citizens in local
- `yarn start:pa` to start app for public administration in local
- `yarn start:pg` to start app for legal entities in local
- `yarn start:login` to start the login section for citizens in local (url: localhost:3000)

You can also run `yarn start` in the relative package folder:

```
cd packages/<package-folder>
yarn start
```

To run test for all packages
`yarn test`

To run test for one file
`cd <package name>`
`yarn test <filename>`

To build all the monorepo
`yarn build`

Other scripts

- `yarn refresh:monorepo` reinstalls all the dependencies of the whole workspace
- `yarn clean` deletes node_modules folder recursively in the workspace

### Development mode

When running the application in development mode, uncheck the "Disable cache" flag in chrome console. Vite uses the dependency pre-building (https://vitejs.dev/guide/dep-pre-bundling) and if the flag is checked, the code is runned twice at start-up.

### How to contribute

Our branching model is based on [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). Usually you can conclude your changes opening a PR.
To generate a consistent changelog, we use [conventional-commit](https://www.conventionalcommits.org/en/v1.0.0/).
Keep that in mind when you commit your changes or merge PRs.
As rule of thumb, merge with squash is preferred over merge. Rebase is not advised as merge procedure.

### Lerna

This project uses [lerna](https://github.com/lerna/lerna) and [vitejs](https://vitejs.dev/config/)
These tools allow to handle a monorepo with multiple webapps which share common components.
The content of monorepo is:

- packages/pn-commons component-library for SEND
- packages/pn-validator utility library to perform validation tasks on custom schemas
- packages/pn-pa-webapp app for public administration
- packages/pn-personafisica-webapp app for citizens
- packages/pn-personafisica-login login section for citizen app
- packages/pn-data-viz component-library for statistical data visualization for SEND

### Sonar

You can run a task analysis with sonar-scanner using this script in each package

- `yarn sonar`
  To run it locally, you need to add env variable SONAR_TOKEN which contains the token of the project.
  The analysis will bel available [here](https://sonarcloud.io/project/overview?id=pagopa_pn-frontend)

### Versioning

These scripts use [lerna version](https://github.com/lerna/lerna/tree/main/libs/commands/version#readme).

Release a prepatch:

`npx lerna version prepatch --conventional-commits --no-push --preid RC`

Increment a prerelease RC:
`npx lerna version prerelease --conventional-prerelease --no-push --preid RC`

Promote a new version after prereleases:

`npx lerna version --conventional-commits --conventional-graduate --no-push`

After you obtain desired versioning, check the generated changelog and version e push commit and tag on desired branch:

`git push --atomic origin <branch name> <tag>`
