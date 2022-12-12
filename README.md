## Piattaforma notifiche

### Start

In project root run

`yarn install`

If you get an authentication error, please use this command:
`yarn config set "strict-ssl" false -g`

Starting applications

- `yarn start:pf` to start app for citizens in local
- `yarn start:pa` to start app for public administration in local
- `yarn start:login` to start the login section for citizens in local (url: localhost:3000)
- `yarn start:landing` to start landing site in local (url: localhost:3000)

You can also run `yarn start` in the relative package folder:

```
cd packages/<package-folder>
yarn start
```

To run test for all packages
`yarn test`

To build all the monorepo
`yarn build`

Other scripts

- `yarn refresh:monorepo` reinstalls all the dependencies of the whole workspace
- `yarn clean:win` or `yarn clean:nx` deletes node_modules folder in the workspace (use win in you use Windows OS or nx if you use linux-based OS)

### Lerna

This project uses [lerna](https://github.com/lerna/lerna) and [craco](https://github.com/gsoft-inc/craco)
These tools allow to handle a monorepo with multiple webapps which share common components.
The content of monorepo is:

- packages/pn-commons component-library for Piattaforma Notifiche
- packages/pn-validator utility library to perform validation tasks on custom schemas
- packages/pn-pa-webapp app for public administration
- packages/pn-personafisica-webapp app for citizens
- packages/pn-personafisica-login login section for citizen app
- packages/pn-landing-webapp landing site for Piattaforma Notifiche

https://medium.com/geekculture/setting-up-monorepo-with-create-react-app-cb2cfa763b96


### Sonar
You can run a task analysis with sonar-scanner using this script in each package
- `yarn sonar`
To run it locally, you need to add env variable SONAR_TOKEN which contains the token of the project.
The analysis will bel available [here](https://sonarcloud.io/project/overview?id=pagopa_pn-frontend)


### Version

Use `yarn run version` from branch `main` to tag a new version of the project and generate the relative changelog. This script uses [lerna version](https://github.com/lerna/lerna/blob/main/commands/version/README.md). To generate a consistent changelog, we use [conventional-commit](https://www.conventionalcommits.org/en/v1.0.0/)

The tool automatically detects the modified packages starting from the previous version and then executes git commit and tag.

Examples:
- `yarn run version 1.0.1` to directly specify a version number
- `yarn run version patch` to update the project according SemVer mode
- `yarn run version` to make choices from prompt

When you have chosen desired version, you can end the procedure with `git push origin --tags` which will push the new tag.

For more details and options, please visit [github](https://github.com/lerna/lerna/tree/main/commands/version)


### Cypress

To make tests in local with Cypress, make sure the app is running (in local too).

To start the tool with GUI support, execute this command:
- `yarn cy-open:pf` from root project or `yarn cy-open` from package root.

To execute all the tests from command line, just replace `open` with `run` (ie: `yarn cy-run:pf`)

to get a valid session to make tests where auth is required, you can use the custom command `cy.login()` which programmatically makes login and it's more performing than `cy.loginWithUI()` (used only to test login steps via UI).

To use login commands you have to create an env file on the root of package and follow instructions found on configuration section in Confluence.

At this time, command login doesn't allow to specify which user to use. This will be done when a test environment for e2e will be available.
