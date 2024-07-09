# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.5.1](https://github.com/pagopa/pn-frontend/compare/v2.5.0...v2.5.1) (2024-06-26)


### Bug Fixes

* **pn-11775:** resolve an error on DigitalErrorTypes model causing the pa-webapp to crash ([#1263](https://github.com/pagopa/pn-frontend/issues/1263)) ([b5c84ff](https://github.com/pagopa/pn-frontend/commit/b5c84ffff7979369b715e2b1659ecdbe33be2d33))





# [2.5.0](https://github.com/pagopa/pn-frontend/compare/v2.5.0-RC.2...v2.5.0) (2024-06-14)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





# [2.5.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.5.0-RC.0...v2.5.0-RC.1) (2024-06-05)


### Bug Fixes

* add charts aria configuration for sender dashboard ([#1240](https://github.com/pagopa/pn-frontend/issues/1240)) ([88a44e8](https://github.com/pagopa/pn-frontend/commit/88a44e81e03d63ffc43dd2ef8628522e1390ad88))
* change sender dashboard download button ([#1243](https://github.com/pagopa/pn-frontend/issues/1243)) ([5fabc3a](https://github.com/pagopa/pn-frontend/commit/5fabc3abae8ba3f860c6e9797db50eb3c5e2043d))


### Features

* **PN-10910:** Integrate and test Sender Dashboard api ([#1223](https://github.com/pagopa/pn-frontend/issues/1223)) ([0b6f8b8](https://github.com/pagopa/pn-frontend/commit/0b6f8b8315acd5bb513207e33d0ccbe5fe5e9e4e))
* **pn-11273:** updated bff dependencies ([#1242](https://github.com/pagopa/pn-frontend/issues/1242)) ([0939949](https://github.com/pagopa/pn-frontend/commit/093994978a517c62aa21ce69089651e5fc2cb970))





# [2.5.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.4.2...v2.5.0-RC.0) (2024-05-30)


### Bug Fixes

* **pn-10930:** create notification -> remove digital address from recipient when it is not selected ([#1216](https://github.com/pagopa/pn-frontend/issues/1216)) ([42e3a78](https://github.com/pagopa/pn-frontend/commit/42e3a78521b79edd7665db7690bb6b967b4e197e))
* **pn-10941:** fixed preload request error ([#1221](https://github.com/pagopa/pn-frontend/issues/1221)) ([5388345](https://github.com/pagopa/pn-frontend/commit/53883453d73ea4e744897f89c2d3d09b72b8ef94))


### Features

* **pn-10287:** Models autogeneration ([#1163](https://github.com/pagopa/pn-frontend/issues/1163)) ([b8f951e](https://github.com/pagopa/pn-frontend/commit/b8f951e1b6c838ef760c0ff21112fae72ac37b20))
* **pn-10579:** migrate tos and privacy api to bff ones ([#1192](https://github.com/pagopa/pn-frontend/issues/1192)) ([6ca28cc](https://github.com/pagopa/pn-frontend/commit/6ca28cc1c06cd222307ce056dde3e1a57085c00d))
* **pn-10587:** integrated institutions-and-products bff api ([#1194](https://github.com/pagopa/pn-frontend/issues/1194)) ([612ad98](https://github.com/pagopa/pn-frontend/commit/612ad98401e6da33b0619a7565a5f9ef06c102b1))
* **pn-10591:** migrated api key api to bff ones ([#1184](https://github.com/pagopa/pn-frontend/issues/1184)) ([3e3717d](https://github.com/pagopa/pn-frontend/commit/3e3717d248a2bc843dd47f87b6341f2fdb78217d))
* **pn-10738:** Downtime logs api bff integration ([#1196](https://github.com/pagopa/pn-frontend/issues/1196)) ([1602529](https://github.com/pagopa/pn-frontend/commit/16025293ac107a8df9948b606f7429ad89a7b5c5))
* **pN-10843:** notifications list api ([#1198](https://github.com/pagopa/pn-frontend/issues/1198)) ([b4e0fb6](https://github.com/pagopa/pn-frontend/commit/b4e0fb63a479be0242bef22a76fa4fc73ea81481))
* **pn-10851, PN-10451, PN-10846:** pn-data-viz setup, web api call for Sender statistics Dashboard ([#1202](https://github.com/pagopa/pn-frontend/issues/1202)) ([ad87fff](https://github.com/pagopa/pn-frontend/commit/ad87fffb9ac30989fdbca9ac2d4cbc02cd021033))
* **PN-10855:** Sender Dashboard components - aggregate and andamental charts ([#1214](https://github.com/pagopa/pn-frontend/issues/1214)) ([8900b8b](https://github.com/pagopa/pn-frontend/commit/8900b8bb9b80c3e4e4f66b8257403f16f6a8317a))
* **PN-10858:** Sender Dashboard Components 2/2 ([#1222](https://github.com/pagopa/pn-frontend/issues/1222)) ([f002364](https://github.com/pagopa/pn-frontend/commit/f0023640cfdf0bca360d9b01282a9deccc89f9cf))
* **pn-10889:** Download notification documents bff api ([#1199](https://github.com/pagopa/pn-frontend/issues/1199)) ([0586a3b](https://github.com/pagopa/pn-frontend/commit/0586a3b04be1401b9d1a3ed11051a1e3258c489c))
* **pn-10936:** payments api migration ([#1204](https://github.com/pagopa/pn-frontend/issues/1204)) ([0d27d4f](https://github.com/pagopa/pn-frontend/commit/0d27d4fcabe5f7b499ba1fa7ace647c009edf28a))
* **pn-10941:** new notification api migration ([#1218](https://github.com/pagopa/pn-frontend/issues/1218)) ([bce38ed](https://github.com/pagopa/pn-frontend/commit/bce38ed3d96c566ec259f1cc272b7d71c55e7e2b))
* **pn-10943:** cancel notification api migration ([#1203](https://github.com/pagopa/pn-frontend/issues/1203)) ([6cbe571](https://github.com/pagopa/pn-frontend/commit/6cbe5718a350e4e67702850c39c6e53e4d6e4bb9))
* **pn-10947:** list groups api migration ([#1207](https://github.com/pagopa/pn-frontend/issues/1207)) ([f7b5b89](https://github.com/pagopa/pn-frontend/commit/f7b5b89b9f703ced094c829602be4b24b588b29a))
* **pn-10957:** PG groups list api migration ([#1212](https://github.com/pagopa/pn-frontend/issues/1212)) ([3b96005](https://github.com/pagopa/pn-frontend/commit/3b960057d6f48fbeacb406d97bda87347c6ebcde))
* **pn-9831:** migration to bff api for notification detail ([#1153](https://github.com/pagopa/pn-frontend/issues/1153)) ([b3936dc](https://github.com/pagopa/pn-frontend/commit/b3936dcaccdb3cb9b134d21303559d0dd13be166))





## [2.4.2](https://github.com/pagopa/pn-frontend/compare/v2.4.2-RC.3...v2.4.2) (2024-05-02)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.4.2-RC.3](https://github.com/pagopa/pn-frontend/compare/v2.4.2-RC.2...v2.4.2-RC.3) (2024-04-29)


### Bug Fixes

* **pn-10623:** Create notification with sender denomination greater than 80 characters ([#1197](https://github.com/pagopa/pn-frontend/issues/1197)) ([44dff14](https://github.com/pagopa/pn-frontend/commit/44dff14e44be442a42cdee3b0249d662b8a40724))





## [2.4.1](https://github.com/pagopa/pn-frontend/compare/v2.4.1-RC.1...v2.4.1) (2024-04-09)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





# [2.4.0](https://github.com/pagopa/pn-frontend/compare/v2.4.0-RC.0...v2.4.0) (2024-03-07)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





# [2.4.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.2...v2.4.0-RC.0) (2024-02-27)


### Bug Fixes

* **pn-9145:** added test case for duplicated protocol error ([#1120](https://github.com/pagopa/pn-frontend/issues/1120)) ([d2ca754](https://github.com/pagopa/pn-frontend/commit/d2ca754e07ed665211dab7a6d9e92d35b89ddee6))


### Features

* **PN-9684:** implemented alert in notificationDetail for alternative-RADD ([#1134](https://github.com/pagopa/pn-frontend/issues/1134)) ([bfc1d4a](https://github.com/pagopa/pn-frontend/commit/bfc1d4ad8d085d5691853fb54d1dad6049ca5f92))


### Reverts

* Revert "Release/v2.3.2" (#1143) ([7cfe17e](https://github.com/pagopa/pn-frontend/commit/7cfe17e1dffd43d0ffc7c0081dbdd538e0691fb6)), closes [#1143](https://github.com/pagopa/pn-frontend/issues/1143)





## [2.3.2](https://github.com/pagopa/pn-frontend/compare/v2.3.1...v2.3.2) (2024-02-20)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.3.1](https://github.com/pagopa/pn-frontend/compare/v2.3.1-RC.1...v2.3.1) (2024-02-19)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.3.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0...v2.3.1-RC.0) (2024-02-14)


### Bug Fixes

* **PN-8916:** logging out user when receiving a 403 ([#1116](https://github.com/pagopa/pn-frontend/issues/1116)) ([afed98a](https://github.com/pagopa/pn-frontend/commit/afed98a569ee446177d8b9214eed099a44c88fac))
* **PN-9412:** fix alert message when AAR not available for PA ([#1123](https://github.com/pagopa/pn-frontend/issues/1123)) ([3200b08](https://github.com/pagopa/pn-frontend/commit/3200b08df59c4139423aa4c8fe8cb285d5183c66))
* **PN-9659:** replaced API_B2B_LINK value in config file in all environment of PA ([#1122](https://github.com/pagopa/pn-frontend/issues/1122)) ([71bde4d](https://github.com/pagopa/pn-frontend/commit/71bde4dfb2b45ebfcc1761b941505268c74a75c8))


### Features

* **pn-9774:** added some new tracking events for user monitoring ([#1129](https://github.com/pagopa/pn-frontend/issues/1129)) ([45704ff](https://github.com/pagopa/pn-frontend/commit/45704fffcc1c1d89a41bf21ecc942defd49dcf57))
* **PN-9883:** added new version segment for notification detail and creation API ([#1126](https://github.com/pagopa/pn-frontend/issues/1126)) ([6599a2d](https://github.com/pagopa/pn-frontend/commit/6599a2d8a05b73ea11cdd7ffcbb9c4d837abafb8))





# [2.3.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.2...v2.3.0) (2024-01-25)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





# [2.3.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.1...v2.3.0-RC.2) (2024-01-24)


### Bug Fixes

* **pn-9624:** updated vitest config for coverage analysis ([#1115](https://github.com/pagopa/pn-frontend/issues/1115)) ([c940dd9](https://github.com/pagopa/pn-frontend/commit/c940dd9f3be6b78f5c2ef0df0e9628caf05d245a))





# [2.3.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.0...v2.3.0-RC.1) (2024-01-19)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.2.4](https://github.com/pagopa/pn-frontend/compare/v2.2.4-RC.0...v2.2.4) (2024-01-12)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.2.4-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.3...v2.2.4-RC.0) (2024-01-03)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.2.3](https://github.com/pagopa/pn-frontend/compare/v2.2.3-RC.0...v2.2.3) (2023-12-14)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.2.3-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.2...v2.2.3-RC.0) (2023-12-12)


### Bug Fixes

* **pn-7067:** Added mobile support for buttons in new notification page ([#1051](https://github.com/pagopa/pn-frontend/issues/1051)) ([fb31399](https://github.com/pagopa/pn-frontend/commit/fb313999fb8f46edfb66596b89108645901f07dd))
* **pn-8589:** updated babel library to fix security vulnerability ([#1040](https://github.com/pagopa/pn-frontend/issues/1040)) ([91bbe13](https://github.com/pagopa/pn-frontend/commit/91bbe13cf3ca2a371526e635e29da038f8e7c453))
* **pn-8619:** fixed "from date" and "to date" filters in pa/pf/pg  ([#1067](https://github.com/pagopa/pn-frontend/issues/1067)) ([f37bcb0](https://github.com/pagopa/pn-frontend/commit/f37bcb00b120468b0d442e1db51c4536e9da7a79))
* **PN-8692:** modify copy for event recrn-005-c-in-timeline ([#1055](https://github.com/pagopa/pn-frontend/issues/1055)) ([f9a645d](https://github.com/pagopa/pn-frontend/commit/f9a645d09b3fab387293593a2d32c71598f18353))
* **pn-8862:** pa - date filter isn't emptied when the value is manually cancelled ([#1074](https://github.com/pagopa/pn-frontend/issues/1074)) ([c8d6569](https://github.com/pagopa/pn-frontend/commit/c8d656954e7fee1e6451ff2389aa90a61ed1342c))
* **PN-8901:** Fixed mixpanel events and renaming, and attributes ([#1078](https://github.com/pagopa/pn-frontend/issues/1078)) ([5a42baf](https://github.com/pagopa/pn-frontend/commit/5a42baf356b4b9e7e31949b36507bffe94b8236c))
* **pn-9001:** Fixed product url calculation using product id ([#1084](https://github.com/pagopa/pn-frontend/issues/1084)) ([e3ddd3f](https://github.com/pagopa/pn-frontend/commit/e3ddd3f2472f3de50dddbcb778958c34a7f3ba8c))


### Features

* **PN-8737:** Added taxId validation according to PF (only length 16) or PG (only length 11) recipient ([#1070](https://github.com/pagopa/pn-frontend/issues/1070)) ([507113f](https://github.com/pagopa/pn-frontend/commit/507113f126815069c705facbdb4c5c7efbe1108e))
* **PN-8789:** Cancel notification button shown as administrator role only ([#1072](https://github.com/pagopa/pn-frontend/issues/1072)) ([3f0946c](https://github.com/pagopa/pn-frontend/commit/3f0946c1d0ef74293dea1c269384a8fdb10d8e0f))
* **pn-8995:** added copy for new analog-workflow-attachment-kind 23I, in all languages, for PA / PF / PG ([#1085](https://github.com/pagopa/pn-frontend/issues/1085)) ([366ec01](https://github.com/pagopa/pn-frontend/commit/366ec0134a04fdecd7c103d3b455654d5b951622))





## [2.2.2](https://github.com/pagopa/pn-frontend/compare/v2.2.2-RC.0...v2.2.2) (2023-11-21)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.2.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.1...v2.2.2-RC.0) (2023-11-21)


### Bug Fixes

* **PN-8735:** Fix overflow of f24 items on notification payment box of PA ([#1060](https://github.com/pagopa/pn-frontend/issues/1060)) ([752f47d](https://github.com/pagopa/pn-frontend/commit/752f47ddaed29919f0da4d90d1f978dcd26dd74f))





## [2.2.1](https://github.com/pagopa/pn-frontend/compare/v2.1.4...v2.2.1) (2023-11-21)



# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.2.0) (2023-11-16)



# [2.2.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.1...v2.2.0-RC.2) (2023-11-03)


### Bug Fixes

* **pn-8614:** today label localization ([#1037](https://github.com/pagopa/pn-frontend/issues/1037)) ([d62daf8](https://github.com/pagopa/pn-frontend/commit/d62daf8067903b3fc24ecb0c6b8f6d740f588af7))
* **PN-8627:** Added translation support for timeline ([#1047](https://github.com/pagopa/pn-frontend/issues/1047)) ([190c25b](https://github.com/pagopa/pn-frontend/commit/190c25b3854c051283745757bac5e7ddcc4f65dc))
* **pn-8630:** Replaced tax code text with fiscal code ([#1041](https://github.com/pagopa/pn-frontend/issues/1041)) ([67572fa](https://github.com/pagopa/pn-frontend/commit/67572faf8b866d1ecc26427cd2bcffcbdcf1e8e7))
* **PN-8633:** Fixed missing translation for Privacy Policy in footer ([#1045](https://github.com/pagopa/pn-frontend/issues/1045)) ([1d8b8fc](https://github.com/pagopa/pn-frontend/commit/1d8b8fc11a07d11baa1d4612d290397840277c48))
* **PN-8639:** Added translation support for datepicker ([#1046](https://github.com/pagopa/pn-frontend/issues/1046)) ([6912d7e](https://github.com/pagopa/pn-frontend/commit/6912d7e85b2bcad8bd807fbcf7640afc46ee9f3e))


### Features

* **pn-8575:** product and party switch refactoring ([#1039](https://github.com/pagopa/pn-frontend/issues/1039)) ([b1b82a7](https://github.com/pagopa/pn-frontend/commit/b1b82a7662398c2aed3e6615751527e4b2aaca94))



# [2.2.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.0...v2.2.0-RC.1) (2023-10-25)


### Bug Fixes

* version of cancel notification api ([#1030](https://github.com/pagopa/pn-frontend/issues/1030)) ([bc52364](https://github.com/pagopa/pn-frontend/commit/bc523641c9ff468aab0ca141936e536f7e6bd77f))



# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)


### Bug Fixes

* EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
* **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
* **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))
* **pn-8056:** used Trans component to show bold text in Api Keys's modals ([#1006](https://github.com/pagopa/pn-frontend/issues/1006)) ([2b82ee0](https://github.com/pagopa/pn-frontend/commit/2b82ee088e52da2feef0f07cafdd7d20430ca58e))


### Features

* **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
* **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
* **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
* **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
* **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))
* **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
* **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
* **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))
* **PN-8368:** configurated apikey api link in PA in config.json ([#1025](https://github.com/pagopa/pn-frontend/issues/1025)) ([e8c3848](https://github.com/pagopa/pn-frontend/commit/e8c384843663d5b858479b9ed43f98ce5e05d4f9))
* **pn-8376:** added senderDenomination concatenation when creating a new notification ([#1028](https://github.com/pagopa/pn-frontend/issues/1028)) ([ad68185](https://github.com/pagopa/pn-frontend/commit/ad68185a42593aeab9cd445e4cd2872ee3e383bb))





# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.2...v2.2.0) (2023-11-16)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp

# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)


### Bug Fixes

* EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
* **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
* **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))
* **pn-8056:** used Trans component to show bold text in Api Keys's modals ([#1006](https://github.com/pagopa/pn-frontend/issues/1006)) ([2b82ee0](https://github.com/pagopa/pn-frontend/commit/2b82ee088e52da2feef0f07cafdd7d20430ca58e))


### Features

* **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
* **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
* **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
* **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
* **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))
* **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
* **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
* **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))
* **PN-8368:** configurated apikey api link in PA in config.json ([#1025](https://github.com/pagopa/pn-frontend/issues/1025)) ([e8c3848](https://github.com/pagopa/pn-frontend/commit/e8c384843663d5b858479b9ed43f98ce5e05d4f9))
* **pn-8376:** added senderDenomination concatenation when creating a new notification ([#1028](https://github.com/pagopa/pn-frontend/issues/1028)) ([ad68185](https://github.com/pagopa/pn-frontend/commit/ad68185a42593aeab9cd445e4cd2872ee3e383bb))

## [2.1.4](https://github.com/pagopa/pn-frontend/compare/v2.1.3...v2.1.4) (2023-11-20)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp


## [2.1.3](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.1.3) (2023-11-17)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp




## [2.1.2](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.1.2) (2023-11-08)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp




## [2.1.1](https://github.com/pagopa/pn-frontend/compare/v2.1.0...v2.1.1) (2023-10-19)


### Bug Fixes

* **PN-8290:** modified api b2b link ([f756e48](https://github.com/pagopa/pn-frontend/commit/f756e483f0411f6fa1aba2e51ff16270a5a19cf0))





# [2.1.0](https://github.com/pagopa/pn-frontend/compare/v2.1.0-RC.5...v2.1.0) (2023-09-28)

**Note:** Version bump only for package @pagopa-pn/pn-pa-webapp





## [2.0.1-RC.4](https://github.com/pagopa/pn-frontend/compare/v2.0.1-RC.3...v2.0.1-RC.4) (2023-07-31)


### Bug Fixes

* **pn-6134:** removed css override on paper component ([#921](https://github.com/pagopa/pn-frontend/issues/921)) ([cd3be7c](https://github.com/pagopa/pn-frontend/commit/cd3be7cb8316ef13b7e455a2cdea484d828f6764))
* **pn-7078:** prevent index.html caching to avoid MIME type error ([#924](https://github.com/pagopa/pn-frontend/issues/924)) ([d52814c](https://github.com/pagopa/pn-frontend/commit/d52814c6c9397a1fad3fe0ad05e7908a191cc6f2))
* **pn-7120:** mobile filter dialog closes even if filters are invalid ([#914](https://github.com/pagopa/pn-frontend/issues/914)) ([299c8f7](https://github.com/pagopa/pn-frontend/commit/299c8f7dd2c244be30679dc146ff79cb77fa4685))
* **pn-7124:** fixed UI of the api-keys dialogs ([#923](https://github.com/pagopa/pn-frontend/issues/923)) ([5c3f759](https://github.com/pagopa/pn-frontend/commit/5c3f759db66502dd03b19c393baa8e58579c49de))
* **pn-7211:** added pagination for api-keys list ([#926](https://github.com/pagopa/pn-frontend/issues/926)) ([928e732](https://github.com/pagopa/pn-frontend/commit/928e732abde8074acf0f946354b1068a066627cc))


### Features

* **pn-4267:** removed Cypress from webapps ([#919](https://github.com/pagopa/pn-frontend/issues/919)) ([1e1d4b5](https://github.com/pagopa/pn-frontend/commit/1e1d4b506a3d1328d697ab23a217107caf21beb4))
* **pn-6205:** added localization for others languages ([#916](https://github.com/pagopa/pn-frontend/issues/916)) ([dc8ae08](https://github.com/pagopa/pn-frontend/commit/dc8ae08458fc6adb3fc69d3876ead3ee16e2158d))





## [2.0.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.0.0-RC.6...v2.0.1-RC.0) (2023-07-05)


### Bug Fixes

* **pn-6114:** removed trailing slash in prod config ([#886](https://github.com/pagopa/pn-frontend/issues/886)) ([bad786b](https://github.com/pagopa/pn-frontend/commit/bad786b6127829ad043a75237fb9fcd556b2f89c))
* **pn-7042:** validation mode of notifications filter ([#884](https://github.com/pagopa/pn-frontend/issues/884)) ([5d51671](https://github.com/pagopa/pn-frontend/commit/5d516713b3b4d368fd1810a080647ac628d954fb))


### Features

* **pn-6792:**  analog progress event PNALL001 ([#872](https://github.com/pagopa/pn-frontend/issues/872)) ([fbf14bb](https://github.com/pagopa/pn-frontend/commit/fbf14bb2ca625d49ab72d844af1c72bcfaf842ff))





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
