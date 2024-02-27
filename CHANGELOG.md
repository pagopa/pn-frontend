# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.4.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.2...v2.4.0-RC.0) (2024-02-27)


### Bug Fixes

* **PN-10025:** added aria-label to button with IDP name ([#1138](https://github.com/pagopa/pn-frontend/issues/1138)) ([c24c02b](https://github.com/pagopa/pn-frontend/commit/c24c02be95d92e1e44e5128070d98f0a3c5f3061))
* **pn-9145:** added test case for duplicated protocol error ([#1120](https://github.com/pagopa/pn-frontend/issues/1120)) ([d2ca754](https://github.com/pagopa/pn-frontend/commit/d2ca754e07ed665211dab7a6d9e92d35b89ddee6))


### Features

* **PN-9684:** implemented alert in notificationDetail for alternative-RADD ([#1134](https://github.com/pagopa/pn-frontend/issues/1134)) ([bfc1d4a](https://github.com/pagopa/pn-frontend/commit/bfc1d4ad8d085d5691853fb54d1dad6049ca5f92))


### Reverts

* Revert "Release/v2.3.2" (#1143) ([7cfe17e](https://github.com/pagopa/pn-frontend/commit/7cfe17e1dffd43d0ffc7c0081dbdd538e0691fb6)), closes [#1143](https://github.com/pagopa/pn-frontend/issues/1143)
* Revert "fix(PN-10025): added aria-label to button with IDP name (#1138)" (#1140) ([2559495](https://github.com/pagopa/pn-frontend/commit/25594959e7184c0ae7dc59839845eda7cbd900d5)), closes [#1138](https://github.com/pagopa/pn-frontend/issues/1138) [#1140](https://github.com/pagopa/pn-frontend/issues/1140)





## [2.3.2](https://github.com/pagopa/pn-frontend/compare/v2.3.1...v2.3.2) (2024-02-20)


### Bug Fixes

* **PN-10025:** added aria-label to button with IDP name ([#1141](https://github.com/pagopa/pn-frontend/issues/1141)) ([2554c60](https://github.com/pagopa/pn-frontend/commit/2554c60c302dab1ebb8784040fc0c8fc2a225e5f))





## [2.3.1](https://github.com/pagopa/pn-frontend/compare/v2.3.1-RC.1...v2.3.1) (2024-02-19)

**Note:** Version bump only for package send-monorepo





## [2.3.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0...v2.3.1-RC.0) (2024-02-14)


### Bug Fixes

* **PN-8916:** logging out user when receiving a 403 ([#1116](https://github.com/pagopa/pn-frontend/issues/1116)) ([afed98a](https://github.com/pagopa/pn-frontend/commit/afed98a569ee446177d8b9214eed099a44c88fac))
* **PN-9412:** fix alert message when AAR not available for PA ([#1123](https://github.com/pagopa/pn-frontend/issues/1123)) ([3200b08](https://github.com/pagopa/pn-frontend/commit/3200b08df59c4139423aa4c8fe8cb285d5183c66))
* **PN-9659:** replaced API_B2B_LINK value in config file in all environment of PA ([#1122](https://github.com/pagopa/pn-frontend/issues/1122)) ([71bde4d](https://github.com/pagopa/pn-frontend/commit/71bde4dfb2b45ebfcc1761b941505268c74a75c8))
* **PN-9689:** replaced copy '10 minuti' with '15 minuti' in pop-up message when update o insert email, pec and sms address for PG and PF ([#1121](https://github.com/pagopa/pn-frontend/issues/1121)) ([e5df8dc](https://github.com/pagopa/pn-frontend/commit/e5df8dc0701bd616e97587fa1ecfaecd18e4cd70))
* **PN-9774:** added SEND_RAPID_ACCESS event and made some fixes ([#1135](https://github.com/pagopa/pn-frontend/issues/1135)) ([f2cf4d1](https://github.com/pagopa/pn-frontend/commit/f2cf4d18d33ba4901c4bacab9c13b1be7b9dcdf0))
* **PN-9873:** disabled button for downloading f24 when another f24 is already downloading ([#1128](https://github.com/pagopa/pn-frontend/issues/1128)) ([95fcd5e](https://github.com/pagopa/pn-frontend/commit/95fcd5e1bfe61b25f6fe82dc88dcafc166c1cf88))
* **PN-9939:** fix in products.json ([#1130](https://github.com/pagopa/pn-frontend/issues/1130)) ([ab1af2c](https://github.com/pagopa/pn-frontend/commit/ab1af2c0d74fbd3ca01063640fd36c54e4754ef4))
* **PN-9954:** fixed yarn installation in codebuilders ([0e9554f](https://github.com/pagopa/pn-frontend/commit/0e9554f55295947b40113600bedf9f1468ecee2f))


### Features

* **pn-9774:** added some new tracking events for user monitoring ([#1129](https://github.com/pagopa/pn-frontend/issues/1129)) ([45704ff](https://github.com/pagopa/pn-frontend/commit/45704fffcc1c1d89a41bf21ecc942defd49dcf57))
* **PN-9883:** added new version segment for notification detail and creation API ([#1126](https://github.com/pagopa/pn-frontend/issues/1126)) ([6599a2d](https://github.com/pagopa/pn-frontend/commit/6599a2d8a05b73ea11cdd7ffcbb9c4d837abafb8))





# [2.3.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.2...v2.3.0) (2024-01-25)

**Note:** Version bump only for package send-monorepo





# [2.3.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.1...v2.3.0-RC.2) (2024-01-24)


### Bug Fixes

* **PN-9541:** Logout from ToS and PP page ([#1118](https://github.com/pagopa/pn-frontend/issues/1118)) ([b143072](https://github.com/pagopa/pn-frontend/commit/b143072f7ac4f03383117aa05db7afed7f5c28bf))
* **pn-9624:** updated vitest config for coverage analysis ([#1115](https://github.com/pagopa/pn-frontend/issues/1115)) ([c940dd9](https://github.com/pagopa/pn-frontend/commit/c940dd9f3be6b78f5c2ef0df0e9628caf05d245a))





# [2.3.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.0...v2.3.0-RC.1) (2024-01-19)

**Note:** Version bump only for package send-monorepo





## [2.2.4](https://github.com/pagopa/pn-frontend/compare/v2.2.4-RC.0...v2.2.4) (2024-01-12)

**Note:** Version bump only for package send-monorepo





## [2.2.4-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.3...v2.2.4-RC.0) (2024-01-03)


### Bug Fixes

* **PN-7003:** updated sentence for pf in proxy creation page and modal for watching code ([d73399f](https://github.com/pagopa/pn-frontend/commit/d73399fe12b104eac97d8f92d952791a791ef6ef))
* **PN-7004:** update sentences for pg in proxy page and modal ([6923246](https://github.com/pagopa/pn-frontend/commit/6923246826aae8edac9b063ae77feb05c136f14d))





## [2.2.3](https://github.com/pagopa/pn-frontend/compare/v2.2.3-RC.0...v2.2.3) (2023-12-14)

**Note:** Version bump only for package send-monorepo





## [2.2.3-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.2...v2.2.3-RC.0) (2023-12-12)


### Bug Fixes

* **pn-7067:** Added mobile support for buttons in new notification page ([#1051](https://github.com/pagopa/pn-frontend/issues/1051)) ([fb31399](https://github.com/pagopa/pn-frontend/commit/fb313999fb8f46edfb66596b89108645901f07dd))
* **pn-8287:** pg - fixed links to selfcare users and groups pages ([#1050](https://github.com/pagopa/pn-frontend/issues/1050)) ([76e6b2d](https://github.com/pagopa/pn-frontend/commit/76e6b2d66be91a0349752359875e183b701b8ac8))
* **pn-8589:** updated babel library to fix security vulnerability ([#1040](https://github.com/pagopa/pn-frontend/issues/1040)) ([91bbe13](https://github.com/pagopa/pn-frontend/commit/91bbe13cf3ca2a371526e635e29da038f8e7c453))
* **pn-8619:** fixed "from date" and "to date" filters in pa/pf/pg  ([#1067](https://github.com/pagopa/pn-frontend/issues/1067)) ([f37bcb0](https://github.com/pagopa/pn-frontend/commit/f37bcb00b120468b0d442e1db51c4536e9da7a79))
* **PN-8692:** modify copy for event recrn-005-c-in-timeline ([#1055](https://github.com/pagopa/pn-frontend/issues/1055)) ([f9a645d](https://github.com/pagopa/pn-frontend/commit/f9a645d09b3fab387293593a2d32c71598f18353))
* **pn-8850:** Moved documents above payments box and changed title variant ([#1069](https://github.com/pagopa/pn-frontend/issues/1069)) ([3050dff](https://github.com/pagopa/pn-frontend/commit/3050dff56926ef08f5c486303bec314b57abd9a2))
* **pn-8862:** pa - date filter isn't emptied when the value is manually cancelled ([#1074](https://github.com/pagopa/pn-frontend/issues/1074)) ([c8d6569](https://github.com/pagopa/pn-frontend/commit/c8d656954e7fee1e6451ff2389aa90a61ed1342c))
* **PN-8869:** No "download" button for payments having no attachment ([#1079](https://github.com/pagopa/pn-frontend/issues/1079)) ([e5d26fc](https://github.com/pagopa/pn-frontend/commit/e5d26fcb5cadc0fb409b24191c68273e854825ba))
* **PN-8874:** fix aar to make it dowloadable after 120 days ([#1082](https://github.com/pagopa/pn-frontend/issues/1082)) ([d578f50](https://github.com/pagopa/pn-frontend/commit/d578f50b500bfb056b25512f8ec05cd616047bfd))
* **PN-8900:** Removed loaded method from mixpanel ([#1080](https://github.com/pagopa/pn-frontend/issues/1080)) ([a86022f](https://github.com/pagopa/pn-frontend/commit/a86022f0a55b610a724fb236db62eb5d382b6d8e))
* **PN-8901:** Fixed mixpanel events and renaming, and attributes ([#1078](https://github.com/pagopa/pn-frontend/issues/1078)) ([5a42baf](https://github.com/pagopa/pn-frontend/commit/5a42baf356b4b9e7e31949b36507bffe94b8236c))
* **pn-8912:** Removed title when all payments are paid ([#1083](https://github.com/pagopa/pn-frontend/issues/1083)) ([151d8bc](https://github.com/pagopa/pn-frontend/commit/151d8bcdec67bc34cbd45ea70d21acf9b4fc70f5))
* **PN-8984:** Fixed issues with mixPanel events ([#1086](https://github.com/pagopa/pn-frontend/issues/1086)) ([729121a](https://github.com/pagopa/pn-frontend/commit/729121a8abe947d0d2a273dc29da4f611a3292dc))
* **pn-9001:** Fixed product url calculation using product id ([#1084](https://github.com/pagopa/pn-frontend/issues/1084)) ([e3ddd3f](https://github.com/pagopa/pn-frontend/commit/e3ddd3f2472f3de50dddbcb778958c34a7f3ba8c))


### Features

* **pn-7003:** added 7-days expiration message to the delegation creation page and to the modal for the code viewing ([#1054](https://github.com/pagopa/pn-frontend/issues/1054)) ([94ee1df](https://github.com/pagopa/pn-frontend/commit/94ee1dfc0c8a8bfdee401a41586c2e26ecf4080a))
* **pn-7341:** payment pagination for pg/pf webapp [#1049](https://github.com/pagopa/pn-frontend/issues/1049) ([0438504](https://github.com/pagopa/pn-frontend/commit/04385044f09ad93f859a87fb0c7143528f5ae1df))
* **pn-7437:** Added new mixpanel events for PF ([#1065](https://github.com/pagopa/pn-frontend/issues/1065)) ([64d79ad](https://github.com/pagopa/pn-frontend/commit/64d79adb10ae715b1f0a16133b83c8fbb473daa5))
* **PN-7437:** added new tracking events for pf ([#1077](https://github.com/pagopa/pn-frontend/issues/1077)) ([b5ff12d](https://github.com/pagopa/pn-frontend/commit/b5ff12d0c8789d0d16ae60c9b23053f3fe853ca3))
* **PN-8737:** Added taxId validation according to PF (only length 16) or PG (only length 11) recipient ([#1070](https://github.com/pagopa/pn-frontend/issues/1070)) ([507113f](https://github.com/pagopa/pn-frontend/commit/507113f126815069c705facbdb4c5c7efbe1108e))
* **PN-8789:** Cancel notification button shown as administrator role only ([#1072](https://github.com/pagopa/pn-frontend/issues/1072)) ([3f0946c](https://github.com/pagopa/pn-frontend/commit/3f0946c1d0ef74293dea1c269384a8fdb10d8e0f))
* **pn-8995:** added copy for new analog-workflow-attachment-kind 23I, in all languages, for PA / PF / PG ([#1085](https://github.com/pagopa/pn-frontend/issues/1085)) ([366ec01](https://github.com/pagopa/pn-frontend/commit/366ec0134a04fdecd7c103d3b455654d5b951622))
* **pn-9009:** removed note about limit of 7 days to accept a delegation (PF and PG). ([#1088](https://github.com/pagopa/pn-frontend/issues/1088)) ([aec5766](https://github.com/pagopa/pn-frontend/commit/aec5766e31afc547e06472e21d0f03632769a6fe))


### Reverts

* Revert "feat(pn-7437): Added new mixpanel events for PF (#1065)" (#1075) ([559a927](https://github.com/pagopa/pn-frontend/commit/559a92768f69e83f4f23848d6fa0408566604aa8)), closes [#1065](https://github.com/pagopa/pn-frontend/issues/1065) [#1075](https://github.com/pagopa/pn-frontend/issues/1075)





## [2.2.2](https://github.com/pagopa/pn-frontend/compare/v2.2.2-RC.0...v2.2.2) (2023-11-21)

**Note:** Version bump only for package send-monorepo





## [2.2.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.1...v2.2.2-RC.0) (2023-11-21)


### Bug Fixes

* **PN-8735:** Fix overflow of f24 items on notification payment box of PA ([#1060](https://github.com/pagopa/pn-frontend/issues/1060)) ([752f47d](https://github.com/pagopa/pn-frontend/commit/752f47ddaed29919f0da4d90d1f978dcd26dd74f))
* **PN-8835:** subtitle copy when having a single payment ([#1066](https://github.com/pagopa/pn-frontend/issues/1066)) ([b96408d](https://github.com/pagopa/pn-frontend/commit/b96408dd8f3ec5d7a27f8711b3ebbb6e19c4a3c9))





## [2.2.1](https://github.com/pagopa/pn-frontend/compare/v2.1.4...v2.2.1) (2023-11-21)



# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.2.0) (2023-11-16)



# [2.2.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.1...v2.2.0-RC.2) (2023-11-03)


### Bug Fixes

* **pn-8597:** fixed padding of the ConfirmationModal ([#1036](https://github.com/pagopa/pn-frontend/issues/1036)) ([8356e26](https://github.com/pagopa/pn-frontend/commit/8356e265510da26f6fc6466e7c7823b8959f6a01))
* **pn-8608:** AppStatus - today label not translated ([#1035](https://github.com/pagopa/pn-frontend/issues/1035)) ([9da483d](https://github.com/pagopa/pn-frontend/commit/9da483d0e7138744234006efa289f9a072fb989c))
* **pn-8614:** today label localization ([#1037](https://github.com/pagopa/pn-frontend/issues/1037)) ([d62daf8](https://github.com/pagopa/pn-frontend/commit/d62daf8067903b3fc24ecb0c6b8f6d740f588af7))
* **PN-8627:** Added translation support for timeline ([#1047](https://github.com/pagopa/pn-frontend/issues/1047)) ([190c25b](https://github.com/pagopa/pn-frontend/commit/190c25b3854c051283745757bac5e7ddcc4f65dc))
* **pn-8628:** replaced strings traslation for subtitle in notification detail page ([#1043](https://github.com/pagopa/pn-frontend/issues/1043)) ([d3464c7](https://github.com/pagopa/pn-frontend/commit/d3464c771c5dd641af4a6a9fd4103b8b92c580b7))
* **PN-8629:** replaced translation string for Active in delegation page ([#1042](https://github.com/pagopa/pn-frontend/issues/1042)) ([e23effa](https://github.com/pagopa/pn-frontend/commit/e23effa855c50fd59d142a76ebeebcdda55560a8))
* **pn-8630:** Replaced tax code text with fiscal code ([#1041](https://github.com/pagopa/pn-frontend/issues/1041)) ([67572fa](https://github.com/pagopa/pn-frontend/commit/67572faf8b866d1ecc26427cd2bcffcbdcf1e8e7))
* **PN-8633:** Fixed missing translation for Privacy Policy in footer ([#1045](https://github.com/pagopa/pn-frontend/issues/1045)) ([1d8b8fc](https://github.com/pagopa/pn-frontend/commit/1d8b8fc11a07d11baa1d4612d290397840277c48))
* **PN-8639:** Added translation support for datepicker ([#1046](https://github.com/pagopa/pn-frontend/issues/1046)) ([6912d7e](https://github.com/pagopa/pn-frontend/commit/6912d7e85b2bcad8bd807fbcf7640afc46ee9f3e))


### Features

* **pn-7858:** removed disambiguation page from code ([#1031](https://github.com/pagopa/pn-frontend/issues/1031)) ([68a7a32](https://github.com/pagopa/pn-frontend/commit/68a7a32abf2bacb4d90d8e8b64f9bb28599e119b))
* **PN-8116:** added codeowners file ([8b811ba](https://github.com/pagopa/pn-frontend/commit/8b811baf411fd3bf5eddde3c2eb9ab91eb5354dd))
* **pn-8575:** product and party switch refactoring ([#1039](https://github.com/pagopa/pn-frontend/issues/1039)) ([b1b82a7](https://github.com/pagopa/pn-frontend/commit/b1b82a7662398c2aed3e6615751527e4b2aaca94))



# [2.2.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.0...v2.2.0-RC.1) (2023-10-25)


### Bug Fixes

* version of cancel notification api ([#1030](https://github.com/pagopa/pn-frontend/issues/1030)) ([bc52364](https://github.com/pagopa/pn-frontend/commit/bc523641c9ff468aab0ca141936e536f7e6bd77f))



# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)


### Bug Fixes

* EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
* **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
* **pn-8056:** used Trans component to show bold text in Api Keys's modals ([#1006](https://github.com/pagopa/pn-frontend/issues/1006)) ([2b82ee0](https://github.com/pagopa/pn-frontend/commit/2b82ee088e52da2feef0f07cafdd7d20430ca58e))
* **PN-8100:** fix links in footer for Società Trasparente and Modello 231 ([#1014](https://github.com/pagopa/pn-frontend/issues/1014)) ([26809e7](https://github.com/pagopa/pn-frontend/commit/26809e7f1a810f5b090a26b8be17060b44a197c1))
* **PN-8128:** fixed copy destinatario sezione recapiti box recapito legale ([#1015](https://github.com/pagopa/pn-frontend/issues/1015)) ([07b07cf](https://github.com/pagopa/pn-frontend/commit/07b07cf2458a54f0cd4f7a3bdce5c0cba14bf10a))


### Features

* **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
* **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
* **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
* **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
* **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
* **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))
* **pn-8255:** Added new IDPS Intesi Group S.p.A ([#1024](https://github.com/pagopa/pn-frontend/issues/1024)) ([d838cf4](https://github.com/pagopa/pn-frontend/commit/d838cf416b8763a7c573f6ece10c1b363301f4de))
* **PN-8368:** configurated apikey api link in PA in config.json ([#1025](https://github.com/pagopa/pn-frontend/issues/1025)) ([e8c3848](https://github.com/pagopa/pn-frontend/commit/e8c384843663d5b858479b9ed43f98ce5e05d4f9))
* **pn-8376:** added senderDenomination concatenation when creating a new notification ([#1028](https://github.com/pagopa/pn-frontend/issues/1028)) ([ad68185](https://github.com/pagopa/pn-frontend/commit/ad68185a42593aeab9cd445e4cd2872ee3e383bb))



## [2.0.2](https://github.com/pagopa/pn-frontend/compare/v2.0.2-RC.0...v2.0.2) (2023-10-02)



## [2.0.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.0...v2.0.2-RC.0) (2023-10-02)


### Bug Fixes

* **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))
* **pn-8099:** avoid popup block on ios opening the attachment on the same window ([#1005](https://github.com/pagopa/pn-frontend/issues/1005)) ([73718ba](https://github.com/pagopa/pn-frontend/commit/73718ba9e10825073f6943952ff44f29b7866227))


### Features

* **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
* **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))





# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.2...v2.2.0) (2023-11-16)

**Note:** Version bump only for package send-monorepo


# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)



### Bug Fixes

* EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
* **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
* **pn-8056:** used Trans component to show bold text in Api Keys's modals ([#1006](https://github.com/pagopa/pn-frontend/issues/1006)) ([2b82ee0](https://github.com/pagopa/pn-frontend/commit/2b82ee088e52da2feef0f07cafdd7d20430ca58e))
* **PN-8100:** fix links in footer for Società Trasparente and Modello 231 ([#1014](https://github.com/pagopa/pn-frontend/issues/1014)) ([26809e7](https://github.com/pagopa/pn-frontend/commit/26809e7f1a810f5b090a26b8be17060b44a197c1))
* **PN-8128:** fixed copy destinatario sezione recapiti box recapito legale ([#1015](https://github.com/pagopa/pn-frontend/issues/1015)) ([07b07cf](https://github.com/pagopa/pn-frontend/commit/07b07cf2458a54f0cd4f7a3bdce5c0cba14bf10a))
* **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))
* **pn-8099:** avoid popup block on ios opening the attachment on the same window ([#1005](https://github.com/pagopa/pn-frontend/issues/1005)) ([73718ba](https://github.com/pagopa/pn-frontend/commit/73718ba9e10825073f6943952ff44f29b7866227))

### Features

* **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
* **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
* **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
* **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
* **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
* **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))
* **pn-8255:** Added new IDPS Intesi Group S.p.A ([#1024](https://github.com/pagopa/pn-frontend/issues/1024)) ([d838cf4](https://github.com/pagopa/pn-frontend/commit/d838cf416b8763a7c573f6ece10c1b363301f4de))
* **PN-8368:** configurated apikey api link in PA in config.json ([#1025](https://github.com/pagopa/pn-frontend/issues/1025)) ([e8c3848](https://github.com/pagopa/pn-frontend/commit/e8c384843663d5b858479b9ed43f98ce5e05d4f9))
* **pn-8376:** added senderDenomination concatenation when creating a new notification ([#1028](https://github.com/pagopa/pn-frontend/issues/1028)) ([ad68185](https://github.com/pagopa/pn-frontend/commit/ad68185a42593aeab9cd445e4cd2872ee3e383bb))
* **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
* **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))



## [2.1.4](https://github.com/pagopa/pn-frontend/compare/v2.1.3...v2.1.4) (2023-11-20)

### Bug Fixes
* fix correct mixpanel utility, removed old one ([cd83106](https://github.com/pagopa/pn-frontend/commit/cd831063da0cca6352da04d79f4c870896537259))





## [2.1.3](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.1.3) (2023-11-17)


### Bug Fixes

* added mixpanel property to blacklist ([41093d0](https://github.com/pagopa/pn-frontend/commit/41093d07dbdf9a428d167d9fd237786b826c4c2d))





## [2.1.2](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.1.2) (2023-11-08)


### Bug Fixes

* intesigroup idp data and added relaystate ([85c2e37](https://github.com/pagopa/pn-frontend/commit/85c2e37837ea5389ff75f08928df4effd2a1b8c3))


### Features

* **pn-8255:** Added new IDPS Intesi Group S.p.A ([#1024](https://github.com/pagopa/pn-frontend/issues/1024)) ([f22cf57](https://github.com/pagopa/pn-frontend/commit/f22cf57e8c9a46fc6a90234bef5d498a01cb841c))





## [2.1.1](https://github.com/pagopa/pn-frontend/compare/v2.1.0...v2.1.1) (2023-10-19)


### Bug Fixes

* **PN-8290:** modified api b2b link ([f756e48](https://github.com/pagopa/pn-frontend/commit/f756e483f0411f6fa1aba2e51ff16270a5a19cf0))





# [2.1.0](https://github.com/pagopa/pn-frontend/compare/v2.1.0-RC.5...v2.1.0) (2023-09-28)

**Note:** Version bump only for package send-monorepo



## [2.0.2](https://github.com/pagopa/pn-frontend/compare/v2.0.2-RC.0...v2.0.2) (2023-10-02)


## [2.0.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.0.1...v2.0.2-RC.0) (2023-10-02)


### Bug Fixes

* **pn-8099:** avoid popup block on ios opening the attachment on the same window ([#1005](https://github.com/pagopa/pn-frontend/issues/1005)) ([73718ba](https://github.com/pagopa/pn-frontend/commit/73718ba9e10825073f6943952ff44f29b7866227))





## [2.0.1-RC.4](https://github.com/pagopa/pn-frontend/compare/v2.0.1-RC.3...v2.0.1-RC.4) (2023-07-31)


### Bug Fixes

* **pn-6134:** removed css override on paper component ([#921](https://github.com/pagopa/pn-frontend/issues/921)) ([cd3be7c](https://github.com/pagopa/pn-frontend/commit/cd3be7cb8316ef13b7e455a2cdea484d828f6764))
* **pn-6720:** fixed inline link of digital contacts code verification modal ([#922](https://github.com/pagopa/pn-frontend/issues/922)) ([1738524](https://github.com/pagopa/pn-frontend/commit/1738524d779b1151d0fcdcd42c1f10899b3fa13e))
* **pn-6724:** columns size in delegators list ([#917](https://github.com/pagopa/pn-frontend/issues/917)) ([cbac32a](https://github.com/pagopa/pn-frontend/commit/cbac32a4a5f6e1a3593c6341f9a666c087ac1a1e))
* **pn-6728:** alignment of chip in AppStatus ([#918](https://github.com/pagopa/pn-frontend/issues/918)) ([b0cdd7c](https://github.com/pagopa/pn-frontend/commit/b0cdd7c645085fa510a5296e15c177667eafb746))
* **pn-7078:** prevent index.html caching to avoid MIME type error ([#924](https://github.com/pagopa/pn-frontend/issues/924)) ([d52814c](https://github.com/pagopa/pn-frontend/commit/d52814c6c9397a1fad3fe0ad05e7908a191cc6f2))
* **pn-7120:** mobile filter dialog closes even if filters are invalid ([#914](https://github.com/pagopa/pn-frontend/issues/914)) ([299c8f7](https://github.com/pagopa/pn-frontend/commit/299c8f7dd2c244be30679dc146ff79cb77fa4685))
* **pn-7124:** fixed UI of the api-keys dialogs ([#923](https://github.com/pagopa/pn-frontend/issues/923)) ([5c3f759](https://github.com/pagopa/pn-frontend/commit/5c3f759db66502dd03b19c393baa8e58579c49de))
* **pn-7126:** accessibility of AppStatus page ([#915](https://github.com/pagopa/pn-frontend/issues/915)) ([77f2f37](https://github.com/pagopa/pn-frontend/commit/77f2f372a0f3483c8dbad6ee94143692e2267b4a))
* **pn-7195:** added pnpg path to csp ([#920](https://github.com/pagopa/pn-frontend/issues/920)) ([6bbedaa](https://github.com/pagopa/pn-frontend/commit/6bbedaa21b54720d61144d5cc2baaea3af12a69a))
* **pn-7211:** added pagination for api-keys list ([#926](https://github.com/pagopa/pn-frontend/issues/926)) ([928e732](https://github.com/pagopa/pn-frontend/commit/928e732abde8074acf0f946354b1068a066627cc))


### Features

* **pn-4267:** removed Cypress from webapps ([#919](https://github.com/pagopa/pn-frontend/issues/919)) ([1e1d4b5](https://github.com/pagopa/pn-frontend/commit/1e1d4b506a3d1328d697ab23a217107caf21beb4))
* **pn-6205:** added localization for others languages ([#916](https://github.com/pagopa/pn-frontend/issues/916)) ([dc8ae08](https://github.com/pagopa/pn-frontend/commit/dc8ae08458fc6adb3fc69d3876ead3ee16e2158d))





## [2.0.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.0.0-RC.6...v2.0.1-RC.0) (2023-07-05)


### Bug Fixes

* **pn-6114:** removed trailing slash in prod config ([#886](https://github.com/pagopa/pn-frontend/issues/886)) ([bad786b](https://github.com/pagopa/pn-frontend/commit/bad786b6127829ad043a75237fb9fcd556b2f89c))
* **pn-6780:** fix collide tab in deleghe ([#842](https://github.com/pagopa/pn-frontend/issues/842)) ([414105b](https://github.com/pagopa/pn-frontend/commit/414105b0e3590d59ec3e3e5bb21fb36be8d2d0ce))
* **pn-6969:** add a11y ([#858](https://github.com/pagopa/pn-frontend/issues/858)) ([2b6e071](https://github.com/pagopa/pn-frontend/commit/2b6e0715016f8a58e25aa56dea1596075e847fc8))
* **pn-6970:** a11y of landing page ([#867](https://github.com/pagopa/pn-frontend/issues/867)) ([a345b3f](https://github.com/pagopa/pn-frontend/commit/a345b3f56cb28f0a5c8805f93ab5e0f00bc33489))
* **pn-6971:** fix a11y in emptystate ([#861](https://github.com/pagopa/pn-frontend/issues/861)) ([f75f8a3](https://github.com/pagopa/pn-frontend/commit/f75f8a38dff8202444af52820ec24e7e8a984f41))
* **pn-7042:** validation mode of notifications filter ([#884](https://github.com/pagopa/pn-frontend/issues/884)) ([5d51671](https://github.com/pagopa/pn-frontend/commit/5d516713b3b4d368fd1810a080647ac628d954fb))
* **pn-7063:** date in new delegation clears when user deletes the content ([#882](https://github.com/pagopa/pn-frontend/issues/882)) ([9c39215](https://github.com/pagopa/pn-frontend/commit/9c3921583bfba2d7dff77307134d4fe2455e7b81))


### Features

* **pn-6792:**  analog progress event PNALL001 ([#872](https://github.com/pagopa/pn-frontend/issues/872)) ([fbf14bb](https://github.com/pagopa/pn-frontend/commit/fbf14bb2ca625d49ab72d844af1c72bcfaf842ff))
* **pn-6828:** allowed particular accessibility link for one URL pattern / disabled languages other than Italian ([#877](https://github.com/pagopa/pn-frontend/issues/877)) ([d6e5249](https://github.com/pagopa/pn-frontend/commit/d6e524909aca4b85c275254989ce7531dadde4c9))


### Reverts

* Revert "fix: add shadow in switch of TOS" ([aaeded8](https://github.com/pagopa/pn-frontend/commit/aaeded845ebb45824a696f7f9e7f56b348a10097))





## [1.5.4](https://github.com/pagopa/pn-frontend/compare/v1.5.3...v1.5.4) (2022-12-23)


### Bug Fixes

* **PN-2921:** generated and added test script for cookie management in pa-webapp ([b6cb71c](https://github.com/pagopa/pn-frontend/commit/b6cb71c8bde21eb53ae5d4f5be089c8141433a95))
* **PN-3034:** updated handbook link ([9d47cff](https://github.com/pagopa/pn-frontend/commit/9d47cffa451aaf3da73edf86e7a2242abdeda2c5))
* **pn-3046:** error message for denomination in manual send page ([#527](https://github.com/pagopa/pn-frontend/issues/527)) ([374c221](https://github.com/pagopa/pn-frontend/commit/374c2215a51be4c3e7b0e66b6a4613b11730deb6))


### Features

* **PN-1789:** exclusion for test files for coverage analysis ([80b3f60](https://github.com/pagopa/pn-frontend/commit/80b3f60ba3d7c28dc25f57a554b986278967025b))
* **pn-1789:** sonar setup for coverage analysis ([#507](https://github.com/pagopa/pn-frontend/issues/507)) ([fdb6c82](https://github.com/pagopa/pn-frontend/commit/fdb6c82f6dc21cbf815041ab0bea470401ecef3d))
* **pn-2981:** delete pageSize greater than 50 ([#525](https://github.com/pagopa/pn-frontend/issues/525)) ([415ad73](https://github.com/pagopa/pn-frontend/commit/415ad73af1ed17fcd366f20196d13f0ad1078ec4))





## [1.5.3](https://github.com/pagopa/pn-frontend/compare/v1.5.2...v1.5.3) (2022-12-14)


### Bug Fixes

* **pn-2826:** New notification - lost payment document infos after back action ([#489](https://github.com/pagopa/pn-frontend/issues/489)) ([6c92929](https://github.com/pagopa/pn-frontend/commit/6c929297e30b4c66b091623ab9acd28d55857e3a))
* **pn-2838:** special chars sanitized during translation ([#490](https://github.com/pagopa/pn-frontend/issues/490)) ([13ca14a](https://github.com/pagopa/pn-frontend/commit/13ca14aad46ef556699e2a049995e2e8eb70ddd6))
* **pn-2838:** updated tsconfig to manage dom manipulation ([#502](https://github.com/pagopa/pn-frontend/issues/502)) ([ff54c3d](https://github.com/pagopa/pn-frontend/commit/ff54c3d0a01bb6360106e50629324c97f63bd9e5))
* **pn-2852:** allign recipients denomination regexps to BE ([#506](https://github.com/pagopa/pn-frontend/issues/506)) ([935134f](https://github.com/pagopa/pn-frontend/commit/935134f714c31b0e63f3782af5cea54c7ba270d2))
* **PN-2855:** reset document ref when upload changes ([#503](https://github.com/pagopa/pn-frontend/issues/503)) ([75c027f](https://github.com/pagopa/pn-frontend/commit/75c027ff5b5f88050eb23a123371b0a6216159de))


### Features

* **pn-2198:** new notification - group required ([50a6ec9](https://github.com/pagopa/pn-frontend/commit/50a6ec961528ba7c1f8ed3785a4066e3c2955419))





## [1.5.2](https://github.com/pagopa/pn-frontend/compare/v1.5.1...v1.5.2) (2022-11-29)


### Bug Fixes

* add SPID_VALIDATOR_ENV_ENABLED in env.ts ([5791a4c](https://github.com/pagopa/pn-frontend/commit/5791a4c194af02b9b478f4af59645fa742ac14f9))
* add validator env variable for test ([0863d63](https://github.com/pagopa/pn-frontend/commit/0863d63604c14a718c0d83495f0794293fe25a9d))
* added sonar script in pn-commons ([2712e6a](https://github.com/pagopa/pn-frontend/commit/2712e6a521123968449ddb16433fb1404cc973c8))
* change validator icon ([981e389](https://github.com/pagopa/pn-frontend/commit/981e3896505fd5ee1babfcdb4edf7bd42cd55d36))
* **pn-2672:** format payment amount from eurocents to euros ([9ec5e8d](https://github.com/pagopa/pn-frontend/commit/9ec5e8d6ad97e610985da0c6b0321fe548a003b0))
* updated node version to 16 for landing codebuilder ([e5065e0](https://github.com/pagopa/pn-frontend/commit/e5065e009692fe8038174d541308dddf875238c7))
* updated sonar pipeline to check packages and not monorepo ([9ec3081](https://github.com/pagopa/pn-frontend/commit/9ec30812e2d8e65865b8fa845c4ef7e22ded0bc4))


### Features

* **pn-785:** added sonar scripts to all packages ([#480](https://github.com/pagopa/pn-frontend/issues/480)) ([56e7456](https://github.com/pagopa/pn-frontend/commit/56e7456929317759916bf88cd03d4a29cc8d513a))





## [1.5.1](https://github.com/pagopa/pn-frontend/compare/v1.5.0...v1.5.1) (2022-11-14)


### Bug Fixes

* **pn-2483:** Added denomination data to recipients list in notification detail ([9e63125](https://github.com/pagopa/pn-frontend/commit/9e63125ce188268d62fac5acf06de6a702cb35ac))
* **pn-2487:** adds multiple recipient with same notice code warning ([#457](https://github.com/pagopa/pn-frontend/issues/457)) ([8b39491](https://github.com/pagopa/pn-frontend/commit/8b3949100737f9ff664b6ec2c134a969e590dccd))
* **pn-2498:** legal fact not visible when timeline step is expanded ([5392aa2](https://github.com/pagopa/pn-frontend/commit/5392aa2a19076757e2151ab6de1e92ba069b3e33))
* **pn-2576:** add municipality to yup validation schema and set it to required for recipients on a new notification ([1c40245](https://github.com/pagopa/pn-frontend/commit/1c40245cbe90e948cbe8b07ae6a19bafcf877e4d))
* **pn-2577:** fix wrong data reset deleting an attachment or a payment file creating a new notification ([ac95e1c](https://github.com/pagopa/pn-frontend/commit/ac95e1cc8806a7ae9efe63a6af17f7462b2c2d90))
* **PN-2613:** Hide payment related fields after choosing "no payment" on a new notification ([#464](https://github.com/pagopa/pn-frontend/issues/464)) ([7263eee](https://github.com/pagopa/pn-frontend/commit/7263eeef70ccab9105db0718561d9969745c2b2f))


### Features

* **pn-2428:** added cypress for pa ([a968b24](https://github.com/pagopa/pn-frontend/commit/a968b2408de16fcd0a2d42fcbe55253bf535bb04))
* **pn-2488:** taxonomy code field in new notification page ([765c342](https://github.com/pagopa/pn-frontend/commit/765c34249955cfffd72c3e87b375f42cc6e1b2a8))
* **pn-785:** added sonar codebuilder  ([#455](https://github.com/pagopa/pn-frontend/issues/455)) ([89185b5](https://github.com/pagopa/pn-frontend/commit/89185b55211f82b1b205fa3c905ec11ae5a1546d))





# [1.5.0](https://github.com/pagopa/pn-frontend/compare/v1.4.1...v1.5.0) (2022-11-07)


### Bug Fixes

* fixed broken pagopa links ([7e06e34](https://github.com/pagopa/pn-frontend/commit/7e06e347408d825845a6d9b9d9751eaaed8de58e))
* fixed navigation back and forward Area Riservata ([bbd6206](https://github.com/pagopa/pn-frontend/commit/bbd6206f6988cec6a2c91f8c3471abb006253dc5))
* **PN-1789:** fixed coverage reports paths ([014aa1a](https://github.com/pagopa/pn-frontend/commit/014aa1a537f9357f7955a43ec1ea417b7af9cd1c))
* **pn-2198:** added right validation rule for groups in manual sending ([a9d2240](https://github.com/pagopa/pn-frontend/commit/a9d2240c21131b038bff24b1735262150b8c301b))
* **pn-2204:** remove index.html ending from landing app links ([#440](https://github.com/pagopa/pn-frontend/issues/440)) ([faa5c23](https://github.com/pagopa/pn-frontend/commit/faa5c234bd542f79d4404f9880b411baf135a25d))
* **pn-2390:** enable filter button when only one date constraint is set ([250b6ec](https://github.com/pagopa/pn-frontend/commit/250b6ec6a7b8078ac66b25a8c68e3c2424857eec))
* **pn-2392:** differenziate tos acceptance page using mui-italia components ([ec8a3ab](https://github.com/pagopa/pn-frontend/commit/ec8a3ab643f31b79667f28161ef6b1610454dcfe))
* **pn-2433:** fixed multiple api calls ([#439](https://github.com/pagopa/pn-frontend/issues/439)) ([0153651](https://github.com/pagopa/pn-frontend/commit/015365145bbd87ce7128acf3210c1d85622b3cb6))
* **pn-2455:** modified copy text in login page. ([df02421](https://github.com/pagopa/pn-frontend/commit/df024216644a38911369163f239dae2f3ce202e3))
* **pn-2478:** change route NOTIFICA from notifica to dettaglio ([#451](https://github.com/pagopa/pn-frontend/issues/451)) ([7b93055](https://github.com/pagopa/pn-frontend/commit/7b930553660548e3c01332ff068a5c11cc65f6ef))


### Features

* **1285:** added onetrust scripts for production ([05cc91a](https://github.com/pagopa/pn-frontend/commit/05cc91aeab923457f593d56f0934e6a129648e0a))
* **2391:** refactoring footer links ([9fc71f5](https://github.com/pagopa/pn-frontend/commit/9fc71f5336848f8cd08ce22b373b2d25874f8300))
* **2394:** different pages for term of service and privacy ([a011dd7](https://github.com/pagopa/pn-frontend/commit/a011dd75d25f4615c9b304684c096d30c6518d82))
* **Pn 2501:** changed copy for Tos and privacy policy acceptance ([#452](https://github.com/pagopa/pn-frontend/issues/452)) ([5fc0608](https://github.com/pagopa/pn-frontend/commit/5fc06084de074e00246d18c14ff373f2e8ec9350))
* **pn-2138:** replaced loading spinner with skeleton to improve UX ([#438](https://github.com/pagopa/pn-frontend/issues/438)) ([a6f5766](https://github.com/pagopa/pn-frontend/commit/a6f576614865ba9015aedfb0307b1b5b2557999c))
* **pn-2261:** Handling failure in API calls to retrieve information, for pa-webapp ([339453a](https://github.com/pagopa/pn-frontend/commit/339453a13afb0666f2439344e42454670680a5cd))
* **pn-2298:** add tos guard ([c4b5a68](https://github.com/pagopa/pn-frontend/commit/c4b5a685bf5b366630e12e8038d74ecab5b619cc))
* **pn-2383:** notifications without payment ([#449](https://github.com/pagopa/pn-frontend/issues/449)) ([4658ca2](https://github.com/pagopa/pn-frontend/commit/4658ca2e4f7c22312691614fda557c293c887426))
* **pn-2398:** added build list item for hotfix environment ([46e36f1](https://github.com/pagopa/pn-frontend/commit/46e36f135da279e6709d82cec701674f2e8e73de))
* **pn-2410:** Translated README.md(s) and other documents in english ([a59de44](https://github.com/pagopa/pn-frontend/commit/a59de44d62b82cd60c8eaa75f2a4536aa8a6a0ae))
* **PN-2455:** added subtitle to login courtesy page ([c00759a](https://github.com/pagopa/pn-frontend/commit/c00759afb0218ab6b07c186edd25719ff815ae18))
* **pn-2460:** Edited regex for phone number ([8d8023e](https://github.com/pagopa/pn-frontend/commit/8d8023ef0d4e93ff89f1fb2eea61330c7e5af8dc))





## [1.4.2](https://github.com/pagopa/pn-frontend/compare/v1.4.1...v1.4.2) (2022-10-25)


### Bug Fixes

* **PN-1789:** fixed coverage reports paths ([014aa1a](https://github.com/pagopa/pn-frontend/commit/014aa1a537f9357f7955a43ec1ea417b7af9cd1c))
* **pn-2198:** added right validation rule for groups in manual sending ([a9d2240](https://github.com/pagopa/pn-frontend/commit/a9d2240c21131b038bff24b1735262150b8c301b))
* **pn-2204:** remove index.html ending from landing app links ([#440](https://github.com/pagopa/pn-frontend/issues/440)) ([faa5c23](https://github.com/pagopa/pn-frontend/commit/faa5c234bd542f79d4404f9880b411baf135a25d))
* **pn-2390:** enable filter button when only one date constraint is set ([250b6ec](https://github.com/pagopa/pn-frontend/commit/250b6ec6a7b8078ac66b25a8c68e3c2424857eec))
* **pn-2433:** fixed multiple api calls ([#439](https://github.com/pagopa/pn-frontend/issues/439)) ([0153651](https://github.com/pagopa/pn-frontend/commit/015365145bbd87ce7128acf3210c1d85622b3cb6))


### Features

* **2391:** refactoring footer links ([9fc71f5](https://github.com/pagopa/pn-frontend/commit/9fc71f5336848f8cd08ce22b373b2d25874f8300))
* **2394:** different pages for term of service and privacy ([a011dd7](https://github.com/pagopa/pn-frontend/commit/a011dd75d25f4615c9b304684c096d30c6518d82))





## [1.4.1](https://github.com/pagopa/pn-frontend/compare/v1.3.1...v1.4.1) (2022-10-18)


### Bug Fixes

* **pn-2048:** Hide legalfacts under macro status when timeline is expanded ([#410](https://github.com/pagopa/pn-frontend/issues/410)) ([7ea4434](https://github.com/pagopa/pn-frontend/commit/7ea4434ba1215349bb19abf636b0a7882c1ed725))
* **pn-2210:** spread token exchange response in User fields ([#415](https://github.com/pagopa/pn-frontend/issues/415)) ([2a014fc](https://github.com/pagopa/pn-frontend/commit/2a014fcb97e17c882d3fa05e4093d6ad4a79a078))
* **pn-2272:** enables attachments elimination in NewNotification page attachments section ([#419](https://github.com/pagopa/pn-frontend/issues/419)) ([e5b44ff](https://github.com/pagopa/pn-frontend/commit/e5b44ff3ec57bc8ad82991d28dbea11f2700c145))
* **PN-2281:** user should not access to contact page if tos are not accessed ([#417](https://github.com/pagopa/pn-frontend/issues/417)) ([5de1d43](https://github.com/pagopa/pn-frontend/commit/5de1d43c94989e80deae0db66c971e60a5817db3))
* **pn-2347:** substitute uploaded file ([#422](https://github.com/pagopa/pn-frontend/issues/422)) ([0d9be09](https://github.com/pagopa/pn-frontend/commit/0d9be0918175fd65a57ecf70f02742737d96f58d))
* removed cancelledIun as empty string ([cc58767](https://github.com/pagopa/pn-frontend/commit/cc58767141173d2e76f17e7e8b0f5dfa9b696c1b))


### Code Refactoring

* **PN-1994:** refactor VerifyUser e RequireAuth ([#400](https://github.com/pagopa/pn-frontend/issues/400)) ([50316d1](https://github.com/pagopa/pn-frontend/commit/50316d1ee17a6ebc732fa6774473bdf4db48d79a))


### Features

* **PN-1843:** rework notification sender page in order to make it navigable ([#350](https://github.com/pagopa/pn-frontend/issues/350)) ([67a96c8](https://github.com/pagopa/pn-frontend/commit/67a96c8129d1f0eb60feb5f392bd1ff7c52bdbfe))
* pn-1852 ottimizzare script mixpanel ([d1d7945](https://github.com/pagopa/pn-frontend/commit/d1d79455205a43c13dabaab9e4670339beed7967))
* pn-1942 gestione disservizio e informazioni corrette all'utente ([bc3918a](https://github.com/pagopa/pn-frontend/commit/bc3918a4c34a88fd8fdad9776e40313a85cd4dfe))
* **pn-2005:** Fluent Validation package ([#385](https://github.com/pagopa/pn-frontend/issues/385)) ([55f79d7](https://github.com/pagopa/pn-frontend/commit/55f79d71bfa86fc90ea6098630734fc9fb2a9400))
* **pn-2007:** update dependencies and move to devDependencies react-scripts p… ([#393](https://github.com/pagopa/pn-frontend/issues/393)) ([a28f16d](https://github.com/pagopa/pn-frontend/commit/a28f16d95ec08aac577204e666773aba0733a765))
* **Pn-2091:** enhanced dropdown usability ([#382](https://github.com/pagopa/pn-frontend/issues/382)) ([f639b02](https://github.com/pagopa/pn-frontend/commit/f639b0297d6128d87c6d6013e5f6d6c5db52ca25))
* **Pn-2125:** managing not functioning API for TOs in pa and pf ([#427](https://github.com/pagopa/pn-frontend/issues/427)) ([67897c4](https://github.com/pagopa/pn-frontend/commit/67897c44872d3495ff00a59d0b386ff3d2c9658b))
* **PN-2149:** certificate, CSP, DNS for prod environments ([#432](https://github.com/pagopa/pn-frontend/issues/432)) ([af48cf6](https://github.com/pagopa/pn-frontend/commit/af48cf6a416b94ae3620784c7493ee072beb4979))
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


### Bug Fixes

* **pn-2164:** change copy for activate service banner ([#411](https://github.com/pagopa/pn-frontend/issues/411)) ([7fc83e7](https://github.com/pagopa/pn-frontend/commit/7fc83e788caeff90a47211c39201e5d411137445))
* **pn-2242:** add link to accessibility page ([#412](https://github.com/pagopa/pn-frontend/issues/412)) ([3e67199](https://github.com/pagopa/pn-frontend/commit/3e67199902c14536ef38d82ce75705c2bc12e9ff))
* **PN-2248:** added new eventcode to manage a KO in digitalprogress (timeline) ([c5ca9fe](https://github.com/pagopa/pn-frontend/commit/c5ca9fe18f545ab6f3e18d8413215071e1e0d2e1))





# [1.3.0](https://github.com/pagopa/pn-frontend/compare/v1.2.2...v1.3.0) (2022-09-23)


### Bug Fixes

* **pn-1368:** change mixpanel imports and target cookies ([#403](https://github.com/pagopa/pn-frontend/issues/403)) ([daf07e9](https://github.com/pagopa/pn-frontend/commit/daf07e98c8aef983b10813d56e6f1f671664aafc))
* **PN-2107:** fixed copy in timeline and some refactoring to reduce cognitive complex ([e776461](https://github.com/pagopa/pn-frontend/commit/e7764611ff769c7c7395472f82463047d44ff8a8))
* pn-2216 change tokenExchange from get to post ([4b75578](https://github.com/pagopa/pn-frontend/commit/4b7557818eece06eddb8b08bf76401c2bd575c4d))


### Features

* **Pn-1851:** cookie script  ([#408](https://github.com/pagopa/pn-frontend/issues/408)) ([7c8021d](https://github.com/pagopa/pn-frontend/commit/7c8021d5fcc326bfb1d0a1a7ce8088e9538e5f8d))
* **PN-2145:** redirect to logout  route when doing logout ([#396](https://github.com/pagopa/pn-frontend/issues/396)) ([6d5509a](https://github.com/pagopa/pn-frontend/commit/6d5509a9931f4aaa1463a5a70aa3d4e5435e5eab))
* pn-2195 bottone CIE nascosto ([d3322d8](https://github.com/pagopa/pn-frontend/commit/d3322d8355439df14ad3d8773a1bd0067c2fc9c7))
* **pn-2209:** add issue templates ([#404](https://github.com/pagopa/pn-frontend/issues/404)) ([97353c5](https://github.com/pagopa/pn-frontend/commit/97353c58211e2d472afcc65aa64dc574cd9ade5e))





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
