# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/pagopa/pn-frontend/compare/v0.2.2...v1.2.2) (2022-09-14)


### Bug Fixes

* **pn-2000:** added correct Tos file and hidden accessibility page ([1cf42c5](https://github.com/pagopa/pn-frontend/commit/1cf42c58c1c18041ccddd9af4347fd7204b957b3))





## [0.2.2](https://github.com/pagopa/pn-frontend/compare/v0.2.1...v0.2.2) (2022-09-13)


### Bug Fixes

* **PN-2170:** fixed social links in footer ([2276b30](https://github.com/pagopa/pn-frontend/commit/2276b307ec2893473502307d41ce78ca0dbfab8a))
* renamed Avviso di cortesia to notifiche digitali on website ([cbe5596](https://github.com/pagopa/pn-frontend/commit/cbe5596a50d662b3c44c48dad45b5a5f3dcbab8e))
* strange redirect to home page when reloading any page ([#397](https://github.com/pagopa/pn-frontend/issues/397)) ([be8cc59](https://github.com/pagopa/pn-frontend/commit/be8cc595adba3bfbb04e1a5338e54b2bea4efcee))





## [0.2.1](https://github.com/pagopa/pn-frontend/compare/v0.2.0...v0.2.1) (2022-09-12)


### Bug Fixes

* change http code for delegation creation errors (duplicated and self-delegation) ([#395](https://github.com/pagopa/pn-frontend/issues/395)) ([b6f0c61](https://github.com/pagopa/pn-frontend/commit/b6f0c61970a72e978b9f5f5b48fd21f79d7652b8))
* fixed new http code for verification code ([cc4914b](https://github.com/pagopa/pn-frontend/commit/cc4914bbef1bda62e245e70e8018262b4e1ec9c5))
* fixed rediret to portale-login in coll environment ([7974d25](https://github.com/pagopa/pn-frontend/commit/7974d2588176f92e028abaaa518fd6808b58d668))
* **pn-1700:** Modified text error title when verification code is wrong ([#390](https://github.com/pagopa/pn-frontend/issues/390)) ([acf3a02](https://github.com/pagopa/pn-frontend/commit/acf3a02957984d0dda7b2a8a8f5096e01e25f2ac))
* **PN-2000:** added preview env and removed PN-CTA for such environment ([bff15d9](https://github.com/pagopa/pn-frontend/commit/bff15d9a62ef3e271b65866d0f00e40624c41648))
* **PN-2000:** fix for navigation on cloudfront ([db7b016](https://github.com/pagopa/pn-frontend/commit/db7b0162f8f37b7b059a74b2a90c0fe6a9a88724))
* **PN-2000:** fix informativa-privacy and accessibilita links ([1c0ae35](https://github.com/pagopa/pn-frontend/commit/1c0ae35892fb74ee9628d041596b122d71509298))
* **pn-2000:** fix on footer links for pn-website ([c8622ee](https://github.com/pagopa/pn-frontend/commit/c8622eef1cf49cd1ae9920227c9b13464d2bb221))
* **pn-2146:** pn-website settare immagini e icon giuste ([#392](https://github.com/pagopa/pn-frontend/issues/392)) ([df9889f](https://github.com/pagopa/pn-frontend/commit/df9889fb1ce37dce20b60ebf11331cbcdb1665a9))
* **pn-2146:** setting images and icons ([#388](https://github.com/pagopa/pn-frontend/issues/388)) ([f61f1b5](https://github.com/pagopa/pn-frontend/commit/f61f1b5694467530b823c6f36ccc4586a0787f38))
* **PN-2153:** fix copy for enti ([bfcb5e7](https://github.com/pagopa/pn-frontend/commit/bfcb5e738a94651d5a694055f8382c130a03e105))


### Features

* **pn-1816:** Aggiunto certificato per sito landing tra le configurazioni ([#387](https://github.com/pagopa/pn-frontend/issues/387)) ([9692aca](https://github.com/pagopa/pn-frontend/commit/9692aca1a0a279815f8885e2800149165bf9cca2))





# [0.2.0](https://github.com/pagopa/pn-frontend/compare/v0.1.11...v0.2.0) (2022-09-06)


### Bug Fixes

* **PN-2107:** modified copy about timeline and sending manual notification ([#383](https://github.com/pagopa/pn-frontend/issues/383)) ([a4a5445](https://github.com/pagopa/pn-frontend/commit/a4a544501f8d43b037a94889b15d2fd9f598b3b0))


### Features

* **pn-1572:** landing ci cd ([#381](https://github.com/pagopa/pn-frontend/issues/381)) ([5ff7063](https://github.com/pagopa/pn-frontend/commit/5ff7063cc6ef2dce4b504ed70a57f4c78c255de5))
* **PN-1754:** implement relative path login (link di accesso rapido) ([#380](https://github.com/pagopa/pn-frontend/issues/380)) ([1cf7583](https://github.com/pagopa/pn-frontend/commit/1cf758304a7b5dc0d424c671d5cedfd424aa01e3))
* **pn-1754:** link qr email pec ([#384](https://github.com/pagopa/pn-frontend/issues/384)) ([e86b45b](https://github.com/pagopa/pn-frontend/commit/e86b45bfb818e3eac94b022481de894b3783afe5))
* **PN-2047:** particular handle of status 403 in the response of the exchangeToken BE call ([#372](https://github.com/pagopa/pn-frontend/issues/372)) ([a5fa5f2](https://github.com/pagopa/pn-frontend/commit/a5fa5f22519cbffdc2134e2b74af62779db43045))





## [0.1.11](https://github.com/pagopa/pn-frontend/compare/v0.1.10...v0.1.11) (2022-08-31)


### Bug Fixes

* changed PartyRole to PnRole to manage access for PA users ([9e43e5e](https://github.com/pagopa/pn-frontend/commit/9e43e5eb70aa74e8bdbc6f2e6443a9a9a64be292))
* fixed test on requireAuth component ([74aed26](https://github.com/pagopa/pn-frontend/commit/74aed26c9864e16cf9b5793b6c2a11d5abee4151))
* **pn-2103:** fixed strange loop in contacts page ([#378](https://github.com/pagopa/pn-frontend/issues/378)) ([1406fb4](https://github.com/pagopa/pn-frontend/commit/1406fb4e2c56c029052c3fde636952655a4dba8f))





## [0.1.10](https://github.com/pagopa/pn-frontend/compare/v0.1.9...v0.1.10) (2022-08-26)


### Bug Fixes

* pn-2068 timeline - visualizzazione stato "invio messaggio di cortesia" ([c3f8ca8](https://github.com/pagopa/pn-frontend/commit/c3f8ca897d09c8ade4ac143ac0e03e6f49ca1902))


### Features

* pn-1374 lista gruppi per creazione nuova notifica ([b99ea09](https://github.com/pagopa/pn-frontend/commit/b99ea09059fbcc1d4d3f5ff6f445cce5c26b1071))






## [0.1.9](https://github.com/pagopa/pn-frontend/compare/v0.1.8...v0.1.9) (2022-08-12)


### Bug Fixes

* **Pn-2013:** avoid identical taxId input in manual notification form ([#361](https://github.com/pagopa/pn-frontend/issues/361)) ([c0be535](https://github.com/pagopa/pn-frontend/commit/c0be535d7db6244980107bc64ea820f69b24492f))
* **pn-2052:** Fixed CSS alignment or legal facts in timeline ([#370](https://github.com/pagopa/pn-frontend/issues/370)) ([cfa48da](https://github.com/pagopa/pn-frontend/commit/cfa48dab951e40169c498087bcec1472524c1977))
* removed config from next.config ([b31be4b](https://github.com/pagopa/pn-frontend/commit/b31be4b277e1186ab1d990223bb1ee3bdf97e45b))
* trying to use middleware for redirects ([65fd334](https://github.com/pagopa/pn-frontend/commit/65fd334364cb4c882e271b226face054d997ea94))


### Features

* **PN-1948:** reducers refactoring ([#352](https://github.com/pagopa/pn-frontend/issues/352)) ([0194539](https://github.com/pagopa/pn-frontend/commit/019453949a6bbbc6270f615dac9c004fe2f92ce2))
* **PN-2030:** Added new page 'Dichiarazione Accessibilità' to landing webapp, replaced link in footer ([#371](https://github.com/pagopa/pn-frontend/issues/371)) ([5196998](https://github.com/pagopa/pn-frontend/commit/5196998a9b34bc8e0d39d0853ffb4220bce968d9))
* **PN-2030:** fixed dichiarazione di accessibilità path ([32b5fde](https://github.com/pagopa/pn-frontend/commit/32b5fde02e03fe03f4dcd3fa60d024889de4def8))
* trying to use middleware to redirect pages ([183a7bf](https://github.com/pagopa/pn-frontend/commit/183a7bf05308398f92c3b3ca14d54f61c1109f7a))


### Reverts

* Revert "chore: dependencies upgrade" ([b1f0e97](https://github.com/pagopa/pn-frontend/commit/b1f0e978129fa73fd1547269c1fb6d6e057d9509))





## [0.1.8](https://github.com/pagopa/pn-frontend/compare/v0.1.7...v0.1.8) (2022-08-10)


### Bug Fixes

* fixed wrong mapping in localization files ([6f790d5](https://github.com/pagopa/pn-frontend/commit/6f790d5ea9690f1ae6d7ebe519b74ae67d77d635))
* **PN-1835:** added FLAT_RATE as notificationFeePolicy ([1c3de05](https://github.com/pagopa/pn-frontend/commit/1c3de058fdb876a28bbdd7e106dc06909648ee00))
* **Pn-2026:** filters date are set after checkin notification detail ([#365](https://github.com/pagopa/pn-frontend/issues/365)) ([4154e56](https://github.com/pagopa/pn-frontend/commit/4154e56a2c68181d037b84aeb582d85d5d44e7be))
* **PN-2028:** Commented out code link and test for API-KEYS ([#366](https://github.com/pagopa/pn-frontend/issues/366)) ([347ccf8](https://github.com/pagopa/pn-frontend/commit/347ccf8984e521255d0458df220bd1b03b8e7d4e))
* **pn-2029:** Commented out code link to FAQ in payment section ([#367](https://github.com/pagopa/pn-frontend/issues/367)) ([51f5f3a](https://github.com/pagopa/pn-frontend/commit/51f5f3a05a9093c8111747b263752477a503c4bc))
* **pn-2044:** Added maxLength limit to 25 to iunMatch input in PA ([#368](https://github.com/pagopa/pn-frontend/issues/368)) ([e391390](https://github.com/pagopa/pn-frontend/commit/e3913906679fab42b332935e57d93627dfd15e2c))


### Features

* **PN-1947:** user validation in sessionStorage ([#360](https://github.com/pagopa/pn-frontend/issues/360)) ([6a2922c](https://github.com/pagopa/pn-frontend/commit/6a2922c0f442d8433e3fce049645a2bb99811d1f))





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
