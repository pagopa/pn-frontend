# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.5.4](https://github.com/pagopa/pn-frontend/compare/v1.5.3...v1.5.4) (2022-12-23)


### Bug Fixes

* **PN-2921:** generated and added test script for cookie management in pa-webapp ([b6cb71c](https://github.com/pagopa/pn-frontend/commit/b6cb71c8bde21eb53ae5d4f5be089c8141433a95))
* **pn-3046:** error message for denomination in manual send page ([#527](https://github.com/pagopa/pn-frontend/issues/527)) ([374c221](https://github.com/pagopa/pn-frontend/commit/374c2215a51be4c3e7b0e66b6a4613b11730deb6))


### Features

* **PN-1789:** exclusion for test files for coverage analysis ([80b3f60](https://github.com/pagopa/pn-frontend/commit/80b3f60ba3d7c28dc25f57a554b986278967025b))
* **pn-1789:** sonar setup for coverage analysis ([#507](https://github.com/pagopa/pn-frontend/issues/507)) ([fdb6c82](https://github.com/pagopa/pn-frontend/commit/fdb6c82f6dc21cbf815041ab0bea470401ecef3d))
* **pn-2981:** delete pageSize greater than 50 ([#525](https://github.com/pagopa/pn-frontend/issues/525)) ([415ad73](https://github.com/pagopa/pn-frontend/commit/415ad73af1ed17fcd366f20196d13f0ad1078ec4))





## [1.5.3](https://github.com/pagopa/pn-frontend/compare/v1.5.2...v1.5.3) (2022-12-14)


### Bug Fixes

* **pn-2826:** New notification - lost payment document infos after back action ([#489](https://github.com/pagopa/pn-frontend/issues/489)) ([6c92929](https://github.com/pagopa/pn-frontend/commit/6c929297e30b4c66b091623ab9acd28d55857e3a))
* **pn-2838:** special chars sanitized during translation ([#490](https://github.com/pagopa/pn-frontend/issues/490)) ([13ca14a](https://github.com/pagopa/pn-frontend/commit/13ca14aad46ef556699e2a049995e2e8eb70ddd6))
* **pn-2852:** allign recipients denomination regexps to BE ([#506](https://github.com/pagopa/pn-frontend/issues/506)) ([935134f](https://github.com/pagopa/pn-frontend/commit/935134f714c31b0e63f3782af5cea54c7ba270d2))
* **PN-2855:** reset document ref when upload changes ([#503](https://github.com/pagopa/pn-frontend/issues/503)) ([75c027f](https://github.com/pagopa/pn-frontend/commit/75c027ff5b5f88050eb23a123371b0a6216159de))


### Features

* **pn-2198:** new notification - group required ([50a6ec9](https://github.com/pagopa/pn-frontend/commit/50a6ec961528ba7c1f8ed3785a4066e3c2955419))





## [1.5.2](https://github.com/pagopa/pn-frontend/compare/v1.5.1...v1.5.2) (2022-11-29)


### Bug Fixes

* **pn-2672:** format payment amount from eurocents to euros ([9ec5e8d](https://github.com/pagopa/pn-frontend/commit/9ec5e8d6ad97e610985da0c6b0321fe548a003b0))


### Features

* **pn-785:** added sonar scripts to all packages ([#480](https://github.com/pagopa/pn-frontend/issues/480)) ([56e7456](https://github.com/pagopa/pn-frontend/commit/56e7456929317759916bf88cd03d4a29cc8d513a))





## [1.5.1](https://github.com/pagopa/pn-frontend/compare/v1.5.0...v1.5.1) (2022-11-14)


### Bug Fixes

* **pn-2483:** Added denomination data to recipients list in notification detail ([9e63125](https://github.com/pagopa/pn-frontend/commit/9e63125ce188268d62fac5acf06de6a702cb35ac))
* **pn-2487:** adds multiple recipient with same notice code warning ([#457](https://github.com/pagopa/pn-frontend/issues/457)) ([8b39491](https://github.com/pagopa/pn-frontend/commit/8b3949100737f9ff664b6ec2c134a969e590dccd))
* **pn-2576:** add municipality to yup validation schema and set it to required for recipients on a new notification ([1c40245](https://github.com/pagopa/pn-frontend/commit/1c40245cbe90e948cbe8b07ae6a19bafcf877e4d))
* **pn-2577:** fix wrong data reset deleting an attachment or a payment file creating a new notification ([ac95e1c](https://github.com/pagopa/pn-frontend/commit/ac95e1cc8806a7ae9efe63a6af17f7462b2c2d90))
* **PN-2613:** Hide payment related fields after choosing "no payment" on a new notification ([#464](https://github.com/pagopa/pn-frontend/issues/464)) ([7263eee](https://github.com/pagopa/pn-frontend/commit/7263eeef70ccab9105db0718561d9969745c2b2f))


### Features

* **pn-2428:** added cypress for pa ([a968b24](https://github.com/pagopa/pn-frontend/commit/a968b2408de16fcd0a2d42fcbe55253bf535bb04))
* **pn-2488:** taxonomy code field in new notification page ([765c342](https://github.com/pagopa/pn-frontend/commit/765c34249955cfffd72c3e87b375f42cc6e1b2a8))





# [1.5.0](https://github.com/pagopa/pn-frontend/compare/v1.4.1...v1.5.0) (2022-11-07)


### Bug Fixes

* **pn-2198:** added right validation rule for groups in manual sending ([a9d2240](https://github.com/pagopa/pn-frontend/commit/a9d2240c21131b038bff24b1735262150b8c301b))
* **pn-2390:** enable filter button when only one date constraint is set ([250b6ec](https://github.com/pagopa/pn-frontend/commit/250b6ec6a7b8078ac66b25a8c68e3c2424857eec))
* **pn-2392:** differenziate tos acceptance page using mui-italia components ([ec8a3ab](https://github.com/pagopa/pn-frontend/commit/ec8a3ab643f31b79667f28161ef6b1610454dcfe))
* **pn-2433:** fixed multiple api calls ([#439](https://github.com/pagopa/pn-frontend/issues/439)) ([0153651](https://github.com/pagopa/pn-frontend/commit/015365145bbd87ce7128acf3210c1d85622b3cb6))
* **pn-2478:** change route NOTIFICA from notifica to dettaglio ([#451](https://github.com/pagopa/pn-frontend/issues/451)) ([7b93055](https://github.com/pagopa/pn-frontend/commit/7b930553660548e3c01332ff068a5c11cc65f6ef))


### Features

* **1285:** added onetrust scripts for production ([05cc91a](https://github.com/pagopa/pn-frontend/commit/05cc91aeab923457f593d56f0934e6a129648e0a))
* **2391:** refactoring footer links ([9fc71f5](https://github.com/pagopa/pn-frontend/commit/9fc71f5336848f8cd08ce22b373b2d25874f8300))
* **2394:** different pages for term of service and privacy ([a011dd7](https://github.com/pagopa/pn-frontend/commit/a011dd75d25f4615c9b304684c096d30c6518d82))
* **Pn 2501:** changed copy for Tos and privacy policy acceptance ([#452](https://github.com/pagopa/pn-frontend/issues/452)) ([5fc0608](https://github.com/pagopa/pn-frontend/commit/5fc06084de074e00246d18c14ff373f2e8ec9350))
* **pn-2261:** Handling failure in API calls to retrieve information, for pa-webapp ([339453a](https://github.com/pagopa/pn-frontend/commit/339453a13afb0666f2439344e42454670680a5cd))
* **pn-2298:** add tos guard ([c4b5a68](https://github.com/pagopa/pn-frontend/commit/c4b5a685bf5b366630e12e8038d74ecab5b619cc))
* **pn-2383:** notifications without payment ([#449](https://github.com/pagopa/pn-frontend/issues/449)) ([4658ca2](https://github.com/pagopa/pn-frontend/commit/4658ca2e4f7c22312691614fda557c293c887426))
* **pn-2398:** added build list item for hotfix environment ([46e36f1](https://github.com/pagopa/pn-frontend/commit/46e36f135da279e6709d82cec701674f2e8e73de))
* **pn-2410:** Translated README.md(s) and other documents in english ([a59de44](https://github.com/pagopa/pn-frontend/commit/a59de44d62b82cd60c8eaa75f2a4536aa8a6a0ae))
* **PN-2455:** added subtitle to login courtesy page ([c00759a](https://github.com/pagopa/pn-frontend/commit/c00759afb0218ab6b07c186edd25719ff815ae18))





## [1.4.2](https://github.com/pagopa/pn-frontend/compare/v1.4.1...v1.4.2) (2022-10-25)


### Bug Fixes

* **pn-2198:** added right validation rule for groups in manual sending ([a9d2240](https://github.com/pagopa/pn-frontend/commit/a9d2240c21131b038bff24b1735262150b8c301b))
* **pn-2390:** enable filter button when only one date constraint is set ([250b6ec](https://github.com/pagopa/pn-frontend/commit/250b6ec6a7b8078ac66b25a8c68e3c2424857eec))
* **pn-2433:** fixed multiple api calls ([#439](https://github.com/pagopa/pn-frontend/issues/439)) ([0153651](https://github.com/pagopa/pn-frontend/commit/015365145bbd87ce7128acf3210c1d85622b3cb6))


### Features

* **2391:** refactoring footer links ([9fc71f5](https://github.com/pagopa/pn-frontend/commit/9fc71f5336848f8cd08ce22b373b2d25874f8300))
* **2394:** different pages for term of service and privacy ([a011dd7](https://github.com/pagopa/pn-frontend/commit/a011dd75d25f4615c9b304684c096d30c6518d82))





## [1.4.1](https://github.com/pagopa/pn-frontend/compare/v1.3.1...v1.4.1) (2022-10-18)


### Bug Fixes

* **pn-2210:** spread token exchange response in User fields ([#415](https://github.com/pagopa/pn-frontend/issues/415)) ([2a014fc](https://github.com/pagopa/pn-frontend/commit/2a014fcb97e17c882d3fa05e4093d6ad4a79a078))
* **pn-2272:** enables attachments elimination in NewNotification page attachments section ([#419](https://github.com/pagopa/pn-frontend/issues/419)) ([e5b44ff](https://github.com/pagopa/pn-frontend/commit/e5b44ff3ec57bc8ad82991d28dbea11f2700c145))
* **pn-2347:** substitute uploaded file ([#422](https://github.com/pagopa/pn-frontend/issues/422)) ([0d9be09](https://github.com/pagopa/pn-frontend/commit/0d9be0918175fd65a57ecf70f02742737d96f58d))
* removed cancelledIun as empty string ([cc58767](https://github.com/pagopa/pn-frontend/commit/cc58767141173d2e76f17e7e8b0f5dfa9b696c1b))


### Code Refactoring

* **PN-1994:** refactor VerifyUser e RequireAuth ([#400](https://github.com/pagopa/pn-frontend/issues/400)) ([50316d1](https://github.com/pagopa/pn-frontend/commit/50316d1ee17a6ebc732fa6774473bdf4db48d79a))


### Features

* **PN-1843:** rework notification sender page in order to make it navigable ([#350](https://github.com/pagopa/pn-frontend/issues/350)) ([67a96c8](https://github.com/pagopa/pn-frontend/commit/67a96c8129d1f0eb60feb5f392bd1ff7c52bdbfe))
* pn-1852 ottimizzare script mixpanel ([d1d7945](https://github.com/pagopa/pn-frontend/commit/d1d79455205a43c13dabaab9e4670339beed7967))
* pn-1942 gestione disservizio e informazioni corrette all'utente ([bc3918a](https://github.com/pagopa/pn-frontend/commit/bc3918a4c34a88fd8fdad9776e40313a85cd4dfe))
* **pn-2007:** update dependencies and move to devDependencies react-scripts p… ([#393](https://github.com/pagopa/pn-frontend/issues/393)) ([a28f16d](https://github.com/pagopa/pn-frontend/commit/a28f16d95ec08aac577204e666773aba0733a765))
* **Pn-2091:** enhanced dropdown usability ([#382](https://github.com/pagopa/pn-frontend/issues/382)) ([f639b02](https://github.com/pagopa/pn-frontend/commit/f639b0297d6128d87c6d6013e5f6d6c5db52ca25))
* **Pn-2125:** managing not functioning API for TOs in pa and pf ([#427](https://github.com/pagopa/pn-frontend/issues/427)) ([67897c4](https://github.com/pagopa/pn-frontend/commit/67897c44872d3495ff00a59d0b386ff3d2c9658b))
* **pn-2247:** add PA privacy policy ([#413](https://github.com/pagopa/pn-frontend/issues/413)) ([30decda](https://github.com/pagopa/pn-frontend/commit/30decda962104aefc09ff08d58612950c4405ca1))
* **pn-2269:** validazione campi di input in invio manuale di una notifica ([7347e4a](https://github.com/pagopa/pn-frontend/commit/7347e4adccaaccf5f96fdf0f4c62a33d667975f2))


### BREAKING CHANGES

* **PN-1994:** this refactoring improves authentication and navigation management, but changes VerifyUser and RequireAuth names and API

* PN-1994 - SessionGuard + RouteGuard working in pf-webapp

* PN-1994 - hook per processo di inizializzazione in steps, aggiunto a pn-commons

* PN-1994 - SessionGuard e RouteGuard operativi in pa-webapp

* PN-1994 - aggiusto messaggio per pa-webapp (manca farlo in pf-webapp)

* PN-1994 - messaggi OK in SessionGuard in pf-webapp

* PN-1994 - pulsanti a AccessDenied

* PN-1994 - pa-webapp, va a AccessDenied in tutti gli accessi senza utente loggato, e non si vedono sidemenu e HeaderProduct

* PN-1994 - gestione utente non loggato in pf-webapp

* PN-1994 - tests degli nuovi componenti RouteGuard e SessionGuard, sia in pf-webapp che in pa-webapp

* PN-1994 - tests (adesso si ci sono)

* PN-1994 - pulizia mocks, componenti deprecati e console.log

* PN-1994 - ultimi aggiustamenti, versione pronta per review

* PN-1994 - ultimi-ultimi aggiustamenti, mo' la smetto davvero

* PN-1994 - modifiche per ridurre cognitive complexity - a meta

* PN-1994 - refactor in SessionGuard di pf-webapp in base a commenti di Carlotta ... eh si, manca farlo in pa-webapp, mi rendo conto solo adesso

* PN-1994 - replico in pa-webapp il refactor su SessionGuard fatto precedentemente in pf-webapp

* PN-1994 - piccolissimo miglioramento a useProcess

* chore: some copy, minimal refactoring and linting

* chore: some linting and some comments removed

* chore: some linting

Co-authored-by: Carlotta Dimatteo <carlotta.dimatteo@pagopa.it>





## [1.3.1](https://github.com/pagopa/pn-frontend/compare/v1.3.0...v1.3.1) (2022-09-27)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





# [1.3.0](https://github.com/pagopa/pn-frontend/compare/v1.2.2...v1.3.0) (2022-09-23)


### Bug Fixes

* **pn-1368:** change mixpanel imports and target cookies ([#403](https://github.com/pagopa/pn-frontend/issues/403)) ([daf07e9](https://github.com/pagopa/pn-frontend/commit/daf07e98c8aef983b10813d56e6f1f671664aafc))
* pn-2216 change tokenExchange from get to post ([4b75578](https://github.com/pagopa/pn-frontend/commit/4b7557818eece06eddb8b08bf76401c2bd575c4d))


### Features

* **Pn-1851:** cookie script  ([#408](https://github.com/pagopa/pn-frontend/issues/408)) ([7c8021d](https://github.com/pagopa/pn-frontend/commit/7c8021d5fcc326bfb1d0a1a7ce8088e9538e5f8d))





## [1.2.2](https://github.com/pagopa/pn-frontend/compare/v0.2.2...v1.2.2) (2022-09-14)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [0.2.2](https://github.com/pagopa/pn-frontend/compare/v0.2.1...v0.2.2) (2022-09-13)


### Bug Fixes

* strange redirect to home page when reloading any page ([#397](https://github.com/pagopa/pn-frontend/issues/397)) ([be8cc59](https://github.com/pagopa/pn-frontend/commit/be8cc595adba3bfbb04e1a5338e54b2bea4efcee))





## [0.2.1](https://github.com/pagopa/pn-frontend/compare/v0.2.0...v0.2.1) (2022-09-12)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





# [0.2.0](https://github.com/pagopa/pn-frontend/compare/v0.1.11...v0.2.0) (2022-09-06)


### Bug Fixes

* **PN-2107:** modified copy about timeline and sending manual notification ([#383](https://github.com/pagopa/pn-frontend/issues/383)) ([a4a5445](https://github.com/pagopa/pn-frontend/commit/a4a544501f8d43b037a94889b15d2fd9f598b3b0))


### Features

* **PN-2047:** particular handle of status 403 in the response of the exchangeToken BE call ([#372](https://github.com/pagopa/pn-frontend/issues/372)) ([a5fa5f2](https://github.com/pagopa/pn-frontend/commit/a5fa5f22519cbffdc2134e2b74af62779db43045))





## [0.1.11](https://github.com/pagopa/pn-frontend/compare/v0.1.10...v0.1.11) (2022-08-31)


### Bug Fixes

* changed PartyRole to PnRole to manage access for PA users ([9e43e5e](https://github.com/pagopa/pn-frontend/commit/9e43e5eb70aa74e8bdbc6f2e6443a9a9a64be292))
* fixed test on requireAuth component ([74aed26](https://github.com/pagopa/pn-frontend/commit/74aed26c9864e16cf9b5793b6c2a11d5abee4151))





## [0.1.10](https://github.com/pagopa/pn-frontend/compare/v0.1.9...v0.1.10) (2022-08-26)


### Features

* pn-1374 lista gruppi per creazione nuova notifica ([b99ea09](https://github.com/pagopa/pn-frontend/commit/b99ea09059fbcc1d4d3f5ff6f445cce5c26b1071))






## [0.1.9](https://github.com/pagopa/pn-frontend/compare/v0.1.8...v0.1.9) (2022-08-12)


### Bug Fixes

* **Pn-2013:** avoid identical taxId input in manual notification form ([#361](https://github.com/pagopa/pn-frontend/issues/361)) ([c0be535](https://github.com/pagopa/pn-frontend/commit/c0be535d7db6244980107bc64ea820f69b24492f))


### Features

* **PN-1948:** reducers refactoring ([#352](https://github.com/pagopa/pn-frontend/issues/352)) ([0194539](https://github.com/pagopa/pn-frontend/commit/019453949a6bbbc6270f615dac9c004fe2f92ce2))





## [0.1.8](https://github.com/pagopa/pn-frontend/compare/v0.1.7...v0.1.8) (2022-08-10)


### Bug Fixes

* fixed wrong mapping in localization files ([6f790d5](https://github.com/pagopa/pn-frontend/commit/6f790d5ea9690f1ae6d7ebe519b74ae67d77d635))
* **PN-1835:** added FLAT_RATE as notificationFeePolicy ([1c3de05](https://github.com/pagopa/pn-frontend/commit/1c3de058fdb876a28bbdd7e106dc06909648ee00))
* **Pn-2026:** filters date are set after checkin notification detail ([#365](https://github.com/pagopa/pn-frontend/issues/365)) ([4154e56](https://github.com/pagopa/pn-frontend/commit/4154e56a2c68181d037b84aeb582d85d5d44e7be))
* **PN-2028:** Commented out code link and test for API-KEYS ([#366](https://github.com/pagopa/pn-frontend/issues/366)) ([347ccf8](https://github.com/pagopa/pn-frontend/commit/347ccf8984e521255d0458df220bd1b03b8e7d4e))
* **pn-2044:** Added maxLength limit to 25 to iunMatch input in PA ([#368](https://github.com/pagopa/pn-frontend/issues/368)) ([e391390](https://github.com/pagopa/pn-frontend/commit/e3913906679fab42b332935e57d93627dfd15e2c))


### Features

* **PN-1947:** user validation in sessionStorage ([#360](https://github.com/pagopa/pn-frontend/issues/360)) ([6a2922c](https://github.com/pagopa/pn-frontend/commit/6a2922c0f442d8433e3fce049645a2bb99811d1f))





## [0.1.7](https://github.com/pagopa/pn-frontend/compare/v0.1.6...v0.1.7) (2022-08-09)


### Bug Fixes

* **pn-1984:** fixed expired session check for pf ([d8d0920](https://github.com/pagopa/pn-frontend/commit/d8d09208ca6c33ff97e50d68513cd2bcfb717202))
* **pn-2023:** issue related to indexes of documents values ([#362](https://github.com/pagopa/pn-frontend/issues/362)) ([56d93b1](https://github.com/pagopa/pn-frontend/commit/56d93b1f942c5a9103ed592cc8e555a43c3d89bd))





## [0.1.6](https://github.com/pagopa/pn-frontend/compare/v0.1.5...v0.1.6) (2022-08-05)


### Features

* **pn-1926:** timeline new copy and new status ([#359](https://github.com/pagopa/pn-frontend/issues/359)) ([6f92d1c](https://github.com/pagopa/pn-frontend/commit/6f92d1cb94fc018fe4fee3a4076bfa0703f9682a))





## [0.1.5](https://github.com/pagopa/pn-frontend/compare/v0.1.4...v0.1.5) (2022-08-03)


### Bug Fixes

* fixed path for onetrust folders ([9888380](https://github.com/pagopa/pn-frontend/commit/988838040a6d2b9d8da9d36dd9713d7857fa208e))
* pn 1923 legalfacts differentiation labels ([#343](https://github.com/pagopa/pn-frontend/issues/343)) ([8421679](https://github.com/pagopa/pn-frontend/commit/8421679ebb3981e40f741af8cc085b0f5d35c960))
* **PN-1984:** expired session handler([#349](https://github.com/pagopa/pn-frontend/issues/349)) ([314643e](https://github.com/pagopa/pn-frontend/commit/314643e5ae94c46da9871acca165bf109e0a28e6))


### Features

* **1908:** fixed path for .env file in pa portal ([69a7acc](https://github.com/pagopa/pn-frontend/commit/69a7acc6d034b145e0718fd9695b2fce55b1af17))
* **PN-1369:** removed some comments related to mixpanel init ([52dcf1e](https://github.com/pagopa/pn-frontend/commit/52dcf1e5ede186e55e1b7db13d4d3a18ed71be27))
* pn-1850 nome ente da api ([02c262c](https://github.com/pagopa/pn-frontend/commit/02c262c6def6646c00e75e7f24f067d43129d0c7))
* **PN-1908:** added .env file to get package version ([654b291](https://github.com/pagopa/pn-frontend/commit/654b291f9591d47b171d28abb9aee58bffe8a5cf))





## [0.1.4](https://github.com/pagopa/pn-frontend/compare/v0.1.3...v0.1.4) (2022-08-01)


### Features

* pn 1295 pn-commons internationalization ([#295](https://github.com/pagopa/pn-frontend/issues/295)) ([ab48285](https://github.com/pagopa/pn-frontend/commit/ab4828551601ad00d4307288cb7a57900d3c487d))
* pn 1631 change language ([#297](https://github.com/pagopa/pn-frontend/issues/297)) ([fe70df7](https://github.com/pagopa/pn-frontend/commit/fe70df7475715c6c11092405997db95b4cfe732b))
* pn 1908 release version in code and reachable from running app ([#344](https://github.com/pagopa/pn-frontend/issues/344)) ([eb6cd3a](https://github.com/pagopa/pn-frontend/commit/eb6cd3a662974f9a85407b4c6a9714c2e9350fe3))
* pn 969 internationalization for sender app ([#330](https://github.com/pagopa/pn-frontend/issues/330)) ([9a7b62c](https://github.com/pagopa/pn-frontend/commit/9a7b62c2aa82ebbea69c1927547a7cb296268c50))
* pn-1558 chiamata ad api lista enti solo quando necessario ([c895249](https://github.com/pagopa/pn-frontend/commit/c895249837b66084c282b858e07fb267b23a8454))
* pn-1777 suddivisione pn-commons ([8e0f409](https://github.com/pagopa/pn-frontend/commit/8e0f409843a501b00c048520c06e71183d1e37ca))
