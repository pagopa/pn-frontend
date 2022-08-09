# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.7](https://github.com/pagopa/pn-frontend/compare/v0.1.6...v0.1.7) (2022-08-09)


### Bug Fixes

* **pn-1984:** fixed expired session check for pf ([d8d0920](https://github.com/pagopa/pn-frontend/commit/d8d09208ca6c33ff97e50d68513cd2bcfb717202))
* **pn-2023:** issue related to indexes of documents values ([#362](https://github.com/pagopa/pn-frontend/issues/362)) ([56d93b1](https://github.com/pagopa/pn-frontend/commit/56d93b1f942c5a9103ed592cc8e555a43c3d89bd))





## [0.1.6](https://github.com/pagopa/pn-frontend/compare/v0.1.5...v0.1.6) (2022-08-05)


### Bug Fixes

* **PN-1988:** Changed method to open SPID login page ([#351](https://github.com/pagopa/pn-frontend/issues/351)) ([f729081](https://github.com/pagopa/pn-frontend/commit/f729081e377085a41b10b6449a8336c650f3e4e2))
* **PN-1989:** transient error page avoided if user cancels the login or other user-related situations ([#357](https://github.com/pagopa/pn-frontend/issues/357)) ([53a90f9](https://github.com/pagopa/pn-frontend/commit/53a90f9e434eb1279ae6fc830c2c6b94b0cd6420))


### Features

* pn-1702 url pagamento recuperato da be ([6891f2d](https://github.com/pagopa/pn-frontend/commit/6891f2dccf4e0ef5fd4c0174fb7a62ee80969e97))
* **pn-1926:** timeline new copy and new status ([#359](https://github.com/pagopa/pn-frontend/issues/359)) ([6f92d1c](https://github.com/pagopa/pn-frontend/commit/6f92d1cb94fc018fe4fee3a4076bfa0703f9682a))


### Reverts

* Revert "fix(PN-1988): Changed method to open SPID login page (#351)" (#353) ([1de5f9e](https://github.com/pagopa/pn-frontend/commit/1de5f9e78ef761aeb12aaec79a14dd7ec02d7a60)), closes [#351](https://github.com/pagopa/pn-frontend/issues/351) [#353](https://github.com/pagopa/pn-frontend/issues/353)





## [0.1.5](https://github.com/pagopa/pn-frontend/compare/v0.1.4...v0.1.5) (2022-08-03)


### Bug Fixes

* fixed path for onetrust folders ([9888380](https://github.com/pagopa/pn-frontend/commit/988838040a6d2b9d8da9d36dd9713d7857fa208e))
* pn 1923 legalfacts differentiation labels ([#343](https://github.com/pagopa/pn-frontend/issues/343)) ([8421679](https://github.com/pagopa/pn-frontend/commit/8421679ebb3981e40f741af8cc085b0f5d35c960))
* **PN-1984:** expired session handler([#349](https://github.com/pagopa/pn-frontend/issues/349)) ([314643e](https://github.com/pagopa/pn-frontend/commit/314643e5ae94c46da9871acca165bf109e0a28e6))
* **PN-1987:** fixed typo in recapiti locale ([31755af](https://github.com/pagopa/pn-frontend/commit/31755af658e48c9b811806b48326c9920005b520))


### Features

* **1908:** fixed path for .env file in pa portal ([69a7acc](https://github.com/pagopa/pn-frontend/commit/69a7acc6d034b145e0718fd9695b2fce55b1af17))
* **PN-1369:** removed some comments related to mixpanel init ([52dcf1e](https://github.com/pagopa/pn-frontend/commit/52dcf1e5ede186e55e1b7db13d4d3a18ed71be27))
* **PN-1369:** trying to instantiate mixpanel ([2eb2ace](https://github.com/pagopa/pn-frontend/commit/2eb2acec788f68f57b8ab1542268611586f5bf2e))
* pn-1850 nome ente da api ([02c262c](https://github.com/pagopa/pn-frontend/commit/02c262c6def6646c00e75e7f24f067d43129d0c7))
* **PN-1908:** added .env file to get package version ([654b291](https://github.com/pagopa/pn-frontend/commit/654b291f9591d47b171d28abb9aee58bffe8a5cf))





## [0.1.4](https://github.com/pagopa/pn-frontend/compare/v0.1.3...v0.1.4) (2022-08-01)


### Bug Fixes

* added a console error in empty catch ([f9023dd](https://github.com/pagopa/pn-frontend/commit/f9023ddc7ebf0cc5499322993b2d0fdb4f42a4e7))
* pn-1943 allow the user to access the application only if the ToS acceptance request is successfully sent ([#340](https://github.com/pagopa/pn-frontend/issues/340)) ([3b8614a](https://github.com/pagopa/pn-frontend/commit/3b8614a993c86083ce304197808bc951ab15ed9c))


### Features

* pn 1295 pn-commons internationalization ([#295](https://github.com/pagopa/pn-frontend/issues/295)) ([ab48285](https://github.com/pagopa/pn-frontend/commit/ab4828551601ad00d4307288cb7a57900d3c487d))
* pn 1631 change language ([#297](https://github.com/pagopa/pn-frontend/issues/297)) ([fe70df7](https://github.com/pagopa/pn-frontend/commit/fe70df7475715c6c11092405997db95b4cfe732b))
* pn 1779 lazy loading ([#341](https://github.com/pagopa/pn-frontend/issues/341)) ([00c51a0](https://github.com/pagopa/pn-frontend/commit/00c51a083619a1648b372552179cb4e3252100e6))
* pn 1908 release version in code and reachable from running app ([#344](https://github.com/pagopa/pn-frontend/issues/344)) ([eb6cd3a](https://github.com/pagopa/pn-frontend/commit/eb6cd3a662974f9a85407b4c6a9714c2e9350fe3))
* pn 969 internationalization for sender app ([#330](https://github.com/pagopa/pn-frontend/issues/330)) ([9a7b62c](https://github.com/pagopa/pn-frontend/commit/9a7b62c2aa82ebbea69c1927547a7cb296268c50))
* pn-1558 chiamata ad api lista enti solo quando necessario ([c895249](https://github.com/pagopa/pn-frontend/commit/c895249837b66084c282b858e07fb267b23a8454))
* pn-1777 suddivisione pn-commons ([8e0f409](https://github.com/pagopa/pn-frontend/commit/8e0f409843a501b00c048520c06e71183d1e37ca))
* pn-1904 personafisica-login - usato componente Layout di pn-commons  ([68efaac](https://github.com/pagopa/pn-frontend/commit/68efaac1bd08d9fdf81cc7f57df9cedba237c4a1))
