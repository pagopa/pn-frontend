# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.9.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.8.1...v2.9.0-RC.0) (2024-11-07)

### Bug Fixes

- **pn-12729:** duplicated payment when cart api goes in error ([#1360](https://github.com/pagopa/pn-frontend/issues/1360)) ([0c7c400](https://github.com/pagopa/pn-frontend/commit/0c7c400799a1256d0d0005e343a8fc15653da740))
- **pn-12897:** Channel type select initially empty in the dialog for the addition of a new special contact ([#1357](https://github.com/pagopa/pn-frontend/issues/1357)) ([f4e9ee0](https://github.com/pagopa/pn-frontend/commit/f4e9ee02be21d0e710a60fca98827fef9fef7afe))
- **pn-12958:** hide virtual key section when there is no public key ([#1375](https://github.com/pagopa/pn-frontend/issues/1375)) ([a7b154b](https://github.com/pagopa/pn-frontend/commit/a7b154b2199c421a1692e4b7bebfea373cfe9f1a))
- **PN-12960:** Show successful message on public key block/delete ([#1372](https://github.com/pagopa/pn-frontend/issues/1372)) ([366ada1](https://github.com/pagopa/pn-frontend/commit/366ada188f163c78cd7bb65caf17b17e9a6c8514))
- **PN-12968:** replace key name with user denomination in virtual key table for PG ([#1373](https://github.com/pagopa/pn-frontend/issues/1373)) ([f286afc](https://github.com/pagopa/pn-frontend/commit/f286afc77bfe81fb5393891870006577123bc0fe))

### Features

- **PN-11301:** create custom error type to handle PN_INVALID_BODY server response error for PF and PG ([#1371](https://github.com/pagopa/pn-frontend/issues/1371)) ([9d6f915](https://github.com/pagopa/pn-frontend/commit/9d6f9156c89e9102ff7d9f7c3370a6e883c84fde))
- **pn-13032:** update commitId and migrate to new getNotificationDocument ([#1383](https://github.com/pagopa/pn-frontend/issues/1383)) ([#1393](https://github.com/pagopa/pn-frontend/issues/1393)) ([bef2483](https://github.com/pagopa/pn-frontend/commit/bef24836df0ea4a249272c81def7c448c4b3bf13)), closes [#1390](https://github.com/pagopa/pn-frontend/issues/1390)

## [2.8.2](https://github.com/pagopa/pn-frontend/compare/v2.8.2-RC.1...v2.8.2) (2024-11-07)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.8.2-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.8.2-RC.0...v2.8.2-RC.1) (2024-11-04)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.8.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.8.0...v2.8.2-RC.0) (2024-11-04)

## [2.8.1](https://github.com/pagopa/pn-frontend/compare/v2.8.1-RC.1...v2.8.1) (2024-10-30)

## [2.8.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.8.0...v2.8.1-RC.0) (2024-10-28)

### Bug Fixes

- wrong casting on env variable and fix wrong tests ([f596c3c](https://github.com/pagopa/pn-frontend/commit/f596c3cfdf588945467e5dda7af5a6d08d4c6c52))
- **PN-12934:** now SercqSendCourtesyDialog does not appear when adding Sercq for a specific Party ([#1367](https://github.com/pagopa/pn-frontend/issues/1367)) ([8c15489](https://github.com/pagopa/pn-frontend/commit/8c15489c3edec1f64de0b63fc73ce65c1a74a3df))
- **PN-12966:** set maximum length for public key value ([#1365](https://github.com/pagopa/pn-frontend/issues/1365)) ([1c5cc00](https://github.com/pagopa/pn-frontend/commit/1c5cc0072e3c40560128611017c1a3dd005dc7c6))

### Features

- **pn-12878:** New copy for analog flow ([#1359](https://github.com/pagopa/pn-frontend/issues/1359)) ([7fc60b1](https://github.com/pagopa/pn-frontend/commit/7fc60b1759762a9771a39cda6339985a041edcb0))

## [2.7.1](https://github.com/pagopa/pn-frontend/compare/v2.8.0-RC.0...v2.7.1) (2024-10-14)

### Bug Fixes

- **PN-12893:** update PEC disclaimer message ([#1354](https://github.com/pagopa/pn-frontend/issues/1354)) ([5482db9](https://github.com/pagopa/pn-frontend/commit/5482db939047db5b8ba58c302c1683b3438d6497))

# [2.8.0](https://github.com/pagopa/pn-frontend/compare/v2.8.0-RC.3...v2.8.0) (2024-10-16)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.8.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.7.0...v2.8.0-RC.0) (2024-10-08)

## [2.7.1](https://github.com/pagopa/pn-frontend/compare/v2.7.0...v2.7.1) (2024-10-14)

### Bug Fixes

- **pn-12392:** Migrated to pg api for tos retrieve and acceptance ([#1335](https://github.com/pagopa/pn-frontend/issues/1335)) ([18596a6](https://github.com/pagopa/pn-frontend/commit/18596a68993fb3bcdf535bbdfccbea62f5f1b893))
- **pn-12392:** updated bff dependencies ([#1338](https://github.com/pagopa/pn-frontend/issues/1338)) ([b265ff7](https://github.com/pagopa/pn-frontend/commit/b265ff7e2eeae8b7895a80025592c93ab7c65d29))
- **pn-12394:** reset modal state when cancel is clicked ([#1339](https://github.com/pagopa/pn-frontend/issues/1339)) ([b65175c](https://github.com/pagopa/pn-frontend/commit/b65175c992cd90f9fcafaa0501bb60929faaafe5))
- **pn-12424:** disabling SERCQ SEND deletion when special address is added ([#1334](https://github.com/pagopa/pn-frontend/issues/1334)) ([fd45986](https://github.com/pagopa/pn-frontend/commit/fd45986b2079d039bf626d10f59dcc097da1977b))
- **pn-12537:** fixed layout when pec is in validation state ([#1340](https://github.com/pagopa/pn-frontend/issues/1340)) ([b26db35](https://github.com/pagopa/pn-frontend/commit/b26db357434bb76205144e178ef03238d3402181))
- **pn-12538:** fix banner condition ([#1341](https://github.com/pagopa/pn-frontend/issues/1341)) ([e14891c](https://github.com/pagopa/pn-frontend/commit/e14891c7ffad352538ecdaf2cdc60f49f183aa7c))
- **pn-12538:** fix bug on banner ([#1337](https://github.com/pagopa/pn-frontend/issues/1337)) ([37ecdd6](https://github.com/pagopa/pn-frontend/commit/37ecdd65e0e0c8d2443142b167e00db7430fd335))
- **pn-12539:** localized sercq send event in timeline ([#1328](https://github.com/pagopa/pn-frontend/issues/1328)) ([10bb57f](https://github.com/pagopa/pn-frontend/commit/10bb57fad8d4dfcef005547484b553bca13792c4))
- **pn-12661:** fixed tos and privacy pages ([#1327](https://github.com/pagopa/pn-frontend/issues/1327)) ([436c838](https://github.com/pagopa/pn-frontend/commit/436c8387cac525c45d330337c0fa7fba8d2a0da8))
- **pn-12661:** updated tos and privacy pages for pg ([#1330](https://github.com/pagopa/pn-frontend/issues/1330)) ([019ed1a](https://github.com/pagopa/pn-frontend/commit/019ed1a076fd0ec2d9429626f129802d24638233))
- **pn-12791:** Store and API for PG api keys ([#1332](https://github.com/pagopa/pn-frontend/issues/1332)) ([7e69eb4](https://github.com/pagopa/pn-frontend/commit/7e69eb41d3fd44ea833c140c58fe5984d805b729))

### Features

- **12777:** feature flag for B2B ([#1331](https://github.com/pagopa/pn-frontend/issues/1331)) ([6f6abf8](https://github.com/pagopa/pn-frontend/commit/6f6abf80603bf368f11529a95438c63c6f22ffc6))
- **pn-12392:** bff integration ([#1317](https://github.com/pagopa/pn-frontend/issues/1317)) ([4af8310](https://github.com/pagopa/pn-frontend/commit/4af8310b0d1191a94fe7527d65b53931c3a8abb0))
- **pn-12393:** add SERCQ value to channelType enumeration ([#1299](https://github.com/pagopa/pn-frontend/issues/1299)) ([b2384aa](https://github.com/pagopa/pn-frontend/commit/b2384aab2151de10d8a482c40e889eb06d5dbf85))
- **pn-12394:** reworked layout of contacts page ([#1301](https://github.com/pagopa/pn-frontend/issues/1301)) ([b300f49](https://github.com/pagopa/pn-frontend/commit/b300f499d2e2d12b5e6a5c304491a787df214c58))
- **pn-12405 :** reworked layout of EditDigitalContact ([#1302](https://github.com/pagopa/pn-frontend/issues/1302)) ([ab9abcf](https://github.com/pagopa/pn-frontend/commit/ab9abcf7f73b7066c076a02f6dd4fd351194c6df))
- **pn-12424:** Sercq SEND management - NO PEC case ([#1304](https://github.com/pagopa/pn-frontend/issues/1304)) ([ba9c225](https://github.com/pagopa/pn-frontend/commit/ba9c225b0cbaba6286b272415279515894c6dd89))
- **pn-12438:** Rework section "Altri recapiti" for Digital Domicile feature ([#1305](https://github.com/pagopa/pn-frontend/issues/1305)) ([adc18db](https://github.com/pagopa/pn-frontend/commit/adc18dbf44346eff1443a570ad3d963b466e938e))
- **pn-12438:** Rework special contacts section ([#1313](https://github.com/pagopa/pn-frontend/issues/1313)) ([57d3ec8](https://github.com/pagopa/pn-frontend/commit/57d3ec8503c24a3bf1e9b0416402b7dc52278e37))
- **pn-12492:** Add contacts summary cards ([#1310](https://github.com/pagopa/pn-frontend/issues/1310)) ([9832681](https://github.com/pagopa/pn-frontend/commit/98326814c22d039a6473ee8fe77f3da4b83a9aca))
- **pn-12537:** Pec addtion when sercq send is enabled as default address ([#1323](https://github.com/pagopa/pn-frontend/issues/1323)) ([3ff9ee3](https://github.com/pagopa/pn-frontend/commit/3ff9ee37781d1e268b24b58dcca5b695ea8d1ca7))
- **pn-12538:** work on banner for Digital Domicile ([#1324](https://github.com/pagopa/pn-frontend/issues/1324)) ([f155a93](https://github.com/pagopa/pn-frontend/commit/f155a939bbfc0e02d111907e191fb858187d0d57))
- **pn-12540:** Digital domicile mixpanel events ([#1321](https://github.com/pagopa/pn-frontend/issues/1321)) ([c0fbba7](https://github.com/pagopa/pn-frontend/commit/c0fbba7cd729698980d474a853e5173cc544500b))
- **pn-12661:** reworked layout ([#1318](https://github.com/pagopa/pn-frontend/issues/1318)) ([6a794a6](https://github.com/pagopa/pn-frontend/commit/6a794a6c7d9af6be7b9d8f6a6f47cbe97c6455eb))
- **pn-12741:** Reworked "Altri recapiti" section ([#1325](https://github.com/pagopa/pn-frontend/issues/1325)) ([23fbf82](https://github.com/pagopa/pn-frontend/commit/23fbf82b443604d6e903c33809a4c1569ed6b20e))
- **pn-12742:** Feature flag ([#1326](https://github.com/pagopa/pn-frontend/issues/1326)) ([eb2f8fe](https://github.com/pagopa/pn-frontend/commit/eb2f8fee093a2757462adf8dbe377f77ad6d5fce))
- **PN-12808:** update copy for digital domicile feature ([#1333](https://github.com/pagopa/pn-frontend/issues/1333)) ([9178a63](https://github.com/pagopa/pn-frontend/commit/9178a632dbf425d026878a08392d10f282eee2b9))
- **PN-12893:** update PEC disclaimer message ([#1354](https://github.com/pagopa/pn-frontend/issues/1354)) ([5482db9](https://github.com/pagopa/pn-frontend/commit/5482db939047db5b8ba58c302c1683b3438d6497))

# [2.7.0](https://github.com/pagopa/pn-frontend/compare/v2.7.0-RC.1...v2.7.0) (2024-09-18)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.7.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.7.0-RC.0...v2.7.0-RC.1) (2024-09-10)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.7.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.6.1...v2.7.0-RC.0) (2024-09-09)

### Bug Fixes

- **pn-11704:** fix group button allignment ([#1307](https://github.com/pagopa/pn-frontend/issues/1307)) ([cff4910](https://github.com/pagopa/pn-frontend/commit/cff49101fbf550264c1525e2e5c47fe0a41e8877))
- **pn-12097:** translation on breadcrumb ([#1284](https://github.com/pagopa/pn-frontend/issues/1284)) ([d6889a6](https://github.com/pagopa/pn-frontend/commit/d6889a6b0e0959b74ab8856a757cd676328df57f))

### Features

- **pn-11371:** Remove useless aria-label and tabIndex attributes ([#1286](https://github.com/pagopa/pn-frontend/issues/1286)) ([22f8683](https://github.com/pagopa/pn-frontend/commit/22f868373e9b57e9512837bbac29a583ca9788b5))
- **pn-11896:** rework on courtesyAddressContacts ([#1267](https://github.com/pagopa/pn-frontend/issues/1267)) ([37839d7](https://github.com/pagopa/pn-frontend/commit/37839d77b3a06a795ba82b49612d9eb631fe606f))
- **pn-11898:** DigitalContactElem component refactor ([#1290](https://github.com/pagopa/pn-frontend/issues/1290)) ([ca61889](https://github.com/pagopa/pn-frontend/commit/ca6188964060fe74569e2ad9226b5daaaaac4300))
- **pn-11965:** Rework courtesy contact item ([#1291](https://github.com/pagopa/pn-frontend/issues/1291)) ([7b62ed5](https://github.com/pagopa/pn-frontend/commit/7b62ed5fe94ae03710395ad38a1d1a5567d35ec6))
- **pn-11966:** reworked PecContactItem ([#1293](https://github.com/pagopa/pn-frontend/issues/1293)) ([c55b4f6](https://github.com/pagopa/pn-frontend/commit/c55b4f6ac267e4ca7b1df14e6969ce2e275d5342))
- **pn-11969:** Remove context from courtesy contacts ([#1294](https://github.com/pagopa/pn-frontend/issues/1294)) ([fda5e6f](https://github.com/pagopa/pn-frontend/commit/fda5e6f9628bc37f1dd8d4cacb38664516c32605))
- **pn-11970:** removed context from PecContactItem ([#1295](https://github.com/pagopa/pn-frontend/issues/1295)) ([cb87d6c](https://github.com/pagopa/pn-frontend/commit/cb87d6cbff44b3b75030e15b4a6f5d191d1b4a97))
- **pn-12055:** Rework special contacts ([#1292](https://github.com/pagopa/pn-frontend/issues/1292)) ([644dbf6](https://github.com/pagopa/pn-frontend/commit/644dbf67f08b229bb6a37ff9203c5bd6b08ebb59))
- **pn-12056:** created two components for email and sms ([#1296](https://github.com/pagopa/pn-frontend/issues/1296)) ([f045c00](https://github.com/pagopa/pn-frontend/commit/f045c00fe804aa7cf8db6c7199bd247be1b46e36))
- **pn-12069:** use single contact component into SpecialContactElem ([#1297](https://github.com/pagopa/pn-frontend/issues/1297)) ([c35cd7f](https://github.com/pagopa/pn-frontend/commit/c35cd7fc66b59feb6b72c5b522d6fc2e674a3838))
- **pn-12070:** removed context from contacts ([#1298](https://github.com/pagopa/pn-frontend/issues/1298)) ([bd0892e](https://github.com/pagopa/pn-frontend/commit/bd0892e2a345a698703a2629709dcf4a502fc602))

## [2.6.1](https://github.com/pagopa/pn-frontend/compare/v2.6.0...v2.6.1) (2024-07-30)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.6.0](https://github.com/pagopa/pn-frontend/compare/v2.6.0-RC.1...v2.6.0) (2024-07-22)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.6.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.6.0-RC.1...v2.6.0-RC.2) (2024-07-18)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.6.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.5.1...v2.6.0-RC.0) (2024-07-15)

### Bug Fixes

- **PN-11250:** fixed aar link for PG users ([#1224](https://github.com/pagopa/pn-frontend/issues/1224)) ([ba3d75a](https://github.com/pagopa/pn-frontend/commit/ba3d75a379bf2254cd10dd8edc87e4ee7c72d1d3))
- **pn-11618:** Added min and max width to DelegationsElements for pf and pg ([#1264](https://github.com/pagopa/pn-frontend/issues/1264)) ([3461f8e](https://github.com/pagopa/pn-frontend/commit/3461f8eb3b1539988de02c3e5c672e9e196350bc))

### Features

- **pn-10800:** add sitemap.xml to PF/PG/PA ([#1265](https://github.com/pagopa/pn-frontend/issues/1265)) ([d8eb2c2](https://github.com/pagopa/pn-frontend/commit/d8eb2c21a60d03a435ecb99c3e122560af3a7173))
- **pn-11372:** Move client generation to the start, test and buil phases ([#1260](https://github.com/pagopa/pn-frontend/issues/1260)) ([da50caa](https://github.com/pagopa/pn-frontend/commit/da50caa9b690889aee218d3e466b57b49fee3e15))

## [2.5.1](https://github.com/pagopa/pn-frontend/compare/v2.5.0...v2.5.1) (2024-06-26)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.5.0](https://github.com/pagopa/pn-frontend/compare/v2.5.0-RC.2...v2.5.0) (2024-06-14)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.5.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.5.0-RC.0...v2.5.0-RC.1) (2024-06-05)

### Features

- **pn-11273:** updated bff dependencies ([#1242](https://github.com/pagopa/pn-frontend/issues/1242)) ([0939949](https://github.com/pagopa/pn-frontend/commit/093994978a517c62aa21ce69089651e5fc2cb970))

# [2.5.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.4.2...v2.5.0-RC.0) (2024-05-30)

### Bug Fixes

- **pn-10637:** new mandate -> made case insensitive fiscalCode field ([#1217](https://github.com/pagopa/pn-frontend/issues/1217)) ([d9a91a4](https://github.com/pagopa/pn-frontend/commit/d9a91a4540ae8d4f2be78f14e7a812ae5268410e))
- **pn-10641:** contacts - show error message when user insert a wrong code twice ([#1219](https://github.com/pagopa/pn-frontend/issues/1219)) ([2338969](https://github.com/pagopa/pn-frontend/commit/2338969d0d8a751032b1d44a323149eb5e606381))

### Features

- **pn-10287:** Models autogeneration ([#1163](https://github.com/pagopa/pn-frontend/issues/1163)) ([b8f951e](https://github.com/pagopa/pn-frontend/commit/b8f951e1b6c838ef760c0ff21112fae72ac37b20))
- **pn-10579:** migrate tos and privacy api to bff ones ([#1192](https://github.com/pagopa/pn-frontend/issues/1192)) ([6ca28cc](https://github.com/pagopa/pn-frontend/commit/6ca28cc1c06cd222307ce056dde3e1a57085c00d))
- **pn-10591:** migrated api key api to bff ones ([#1184](https://github.com/pagopa/pn-frontend/issues/1184)) ([3e3717d](https://github.com/pagopa/pn-frontend/commit/3e3717d248a2bc843dd47f87b6341f2fdb78217d))
- **pn-10738:** Downtime logs api bff integration ([#1196](https://github.com/pagopa/pn-frontend/issues/1196)) ([1602529](https://github.com/pagopa/pn-frontend/commit/16025293ac107a8df9948b606f7429ad89a7b5c5))
- **pN-10843:** notifications list api ([#1198](https://github.com/pagopa/pn-frontend/issues/1198)) ([b4e0fb6](https://github.com/pagopa/pn-frontend/commit/b4e0fb63a479be0242bef22a76fa4fc73ea81481))
- **pn-10889:** Download notification documents bff api ([#1199](https://github.com/pagopa/pn-frontend/issues/1199)) ([0586a3b](https://github.com/pagopa/pn-frontend/commit/0586a3b04be1401b9d1a3ed11051a1e3258c489c))
- **pn-10936:** payments api migration ([#1204](https://github.com/pagopa/pn-frontend/issues/1204)) ([0d27d4f](https://github.com/pagopa/pn-frontend/commit/0d27d4fcabe5f7b499ba1fa7ace647c009edf28a))
- **pn-10951:** exchange qr code api migration ([#1210](https://github.com/pagopa/pn-frontend/issues/1210)) ([479bf47](https://github.com/pagopa/pn-frontend/commit/479bf477bdc6c94f6cabcc9ba5250335499bbda4))
- **pn-10953:** Mandate api migration ([#1209](https://github.com/pagopa/pn-frontend/issues/1209)) ([c85c72f](https://github.com/pagopa/pn-frontend/commit/c85c72f05e54ccf8bbdf6adf94f12dc9bc3cdebf))
- **pn-10957:** PG groups list api migration ([#1212](https://github.com/pagopa/pn-frontend/issues/1212)) ([3b96005](https://github.com/pagopa/pn-frontend/commit/3b960057d6f48fbeacb406d97bda87347c6ebcde))
- **pn-9831:** migration to bff api for notification detail ([#1153](https://github.com/pagopa/pn-frontend/issues/1153)) ([b3936dc](https://github.com/pagopa/pn-frontend/commit/b3936dcaccdb3cb9b134d21303559d0dd13be166))

## [2.4.2](https://github.com/pagopa/pn-frontend/compare/v2.4.2-RC.3...v2.4.2) (2024-05-02)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.4.2-RC.3](https://github.com/pagopa/pn-frontend/compare/v2.4.2-RC.2...v2.4.2-RC.3) (2024-04-29)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.4.1](https://github.com/pagopa/pn-frontend/compare/v2.4.1-RC.1...v2.4.1) (2024-04-09)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.4.0](https://github.com/pagopa/pn-frontend/compare/v2.4.0-RC.0...v2.4.0) (2024-03-07)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.4.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.2...v2.4.0-RC.0) (2024-02-27)

### Features

- **PN-9684:** implemented alert in notificationDetail for alternative-RADD ([#1134](https://github.com/pagopa/pn-frontend/issues/1134)) ([bfc1d4a](https://github.com/pagopa/pn-frontend/commit/bfc1d4ad8d085d5691853fb54d1dad6049ca5f92))

### Reverts

- Revert "Release/v2.3.2" (#1143) ([7cfe17e](https://github.com/pagopa/pn-frontend/commit/7cfe17e1dffd43d0ffc7c0081dbdd538e0691fb6)), closes [#1143](https://github.com/pagopa/pn-frontend/issues/1143)

## [2.3.2](https://github.com/pagopa/pn-frontend/compare/v2.3.1...v2.3.2) (2024-02-20)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.3.1](https://github.com/pagopa/pn-frontend/compare/v2.3.1-RC.1...v2.3.1) (2024-02-19)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.3.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0...v2.3.1-RC.0) (2024-02-14)

### Bug Fixes

- **PN-8916:** logging out user when receiving a 403 ([#1116](https://github.com/pagopa/pn-frontend/issues/1116)) ([afed98a](https://github.com/pagopa/pn-frontend/commit/afed98a569ee446177d8b9214eed099a44c88fac))
- **PN-9412:** fix alert message when AAR not available for PA ([#1123](https://github.com/pagopa/pn-frontend/issues/1123)) ([3200b08](https://github.com/pagopa/pn-frontend/commit/3200b08df59c4139423aa4c8fe8cb285d5183c66))
- **PN-9689:** replaced copy '10 minuti' with '15 minuti' in pop-up message when update o insert email, pec and sms address for PG and PF ([#1121](https://github.com/pagopa/pn-frontend/issues/1121)) ([e5df8dc](https://github.com/pagopa/pn-frontend/commit/e5df8dc0701bd616e97587fa1ecfaecd18e4cd70))
- **PN-9939:** fix in products.json ([#1130](https://github.com/pagopa/pn-frontend/issues/1130)) ([ab1af2c](https://github.com/pagopa/pn-frontend/commit/ab1af2c0d74fbd3ca01063640fd36c54e4754ef4))

### Features

- **pn-9774:** added some new tracking events for user monitoring ([#1129](https://github.com/pagopa/pn-frontend/issues/1129)) ([45704ff](https://github.com/pagopa/pn-frontend/commit/45704fffcc1c1d89a41bf21ecc942defd49dcf57))
- **PN-9883:** added new version segment for notification detail and creation API ([#1126](https://github.com/pagopa/pn-frontend/issues/1126)) ([6599a2d](https://github.com/pagopa/pn-frontend/commit/6599a2d8a05b73ea11cdd7ffcbb9c4d837abafb8))

# [2.3.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.2...v2.3.0) (2024-01-25)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.3.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.1...v2.3.0-RC.2) (2024-01-24)

### Bug Fixes

- **PN-9541:** Logout from ToS and PP page ([#1118](https://github.com/pagopa/pn-frontend/issues/1118)) ([b143072](https://github.com/pagopa/pn-frontend/commit/b143072f7ac4f03383117aa05db7afed7f5c28bf))
- **pn-9624:** updated vitest config for coverage analysis ([#1115](https://github.com/pagopa/pn-frontend/issues/1115)) ([c940dd9](https://github.com/pagopa/pn-frontend/commit/c940dd9f3be6b78f5c2ef0df0e9628caf05d245a))

# [2.3.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.0...v2.3.0-RC.1) (2024-01-19)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.2.4](https://github.com/pagopa/pn-frontend/compare/v2.2.4-RC.0...v2.2.4) (2024-01-12)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.2.4-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.3...v2.2.4-RC.0) (2024-01-03)

### Bug Fixes

- **PN-7004:** update sentences for pg in proxy page and modal ([6923246](https://github.com/pagopa/pn-frontend/commit/6923246826aae8edac9b063ae77feb05c136f14d))

## [2.2.3](https://github.com/pagopa/pn-frontend/compare/v2.2.3-RC.0...v2.2.3) (2023-12-14)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.2.3-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.2...v2.2.3-RC.0) (2023-12-12)

### Bug Fixes

- **pn-8287:** pg - fixed links to selfcare users and groups pages ([#1050](https://github.com/pagopa/pn-frontend/issues/1050)) ([76e6b2d](https://github.com/pagopa/pn-frontend/commit/76e6b2d66be91a0349752359875e183b701b8ac8))
- **pn-8589:** updated babel library to fix security vulnerability ([#1040](https://github.com/pagopa/pn-frontend/issues/1040)) ([91bbe13](https://github.com/pagopa/pn-frontend/commit/91bbe13cf3ca2a371526e635e29da038f8e7c453))
- **pn-8619:** fixed "from date" and "to date" filters in pa/pf/pg ([#1067](https://github.com/pagopa/pn-frontend/issues/1067)) ([f37bcb0](https://github.com/pagopa/pn-frontend/commit/f37bcb00b120468b0d442e1db51c4536e9da7a79))
- **PN-8692:** modify copy for event recrn-005-c-in-timeline ([#1055](https://github.com/pagopa/pn-frontend/issues/1055)) ([f9a645d](https://github.com/pagopa/pn-frontend/commit/f9a645d09b3fab387293593a2d32c71598f18353))
- **pn-8850:** Moved documents above payments box and changed title variant ([#1069](https://github.com/pagopa/pn-frontend/issues/1069)) ([3050dff](https://github.com/pagopa/pn-frontend/commit/3050dff56926ef08f5c486303bec314b57abd9a2))
- **PN-8869:** No "download" button for payments having no attachment ([#1079](https://github.com/pagopa/pn-frontend/issues/1079)) ([e5d26fc](https://github.com/pagopa/pn-frontend/commit/e5d26fcb5cadc0fb409b24191c68273e854825ba))
- **PN-8874:** fix aar to make it dowloadable after 120 days ([#1082](https://github.com/pagopa/pn-frontend/issues/1082)) ([d578f50](https://github.com/pagopa/pn-frontend/commit/d578f50b500bfb056b25512f8ec05cd616047bfd))
- **PN-8901:** Fixed mixpanel events and renaming, and attributes ([#1078](https://github.com/pagopa/pn-frontend/issues/1078)) ([5a42baf](https://github.com/pagopa/pn-frontend/commit/5a42baf356b4b9e7e31949b36507bffe94b8236c))

### Features

- **pn-7003:** added 7-days expiration message to the delegation creation page and to the modal for the code viewing ([#1054](https://github.com/pagopa/pn-frontend/issues/1054)) ([94ee1df](https://github.com/pagopa/pn-frontend/commit/94ee1dfc0c8a8bfdee401a41586c2e26ecf4080a))
- **pn-7341:** payment pagination for pg/pf webapp [#1049](https://github.com/pagopa/pn-frontend/issues/1049) ([0438504](https://github.com/pagopa/pn-frontend/commit/04385044f09ad93f859a87fb0c7143528f5ae1df))
- **pn-8995:** added copy for new analog-workflow-attachment-kind 23I, in all languages, for PA / PF / PG ([#1085](https://github.com/pagopa/pn-frontend/issues/1085)) ([366ec01](https://github.com/pagopa/pn-frontend/commit/366ec0134a04fdecd7c103d3b455654d5b951622))
- **pn-9009:** removed note about limit of 7 days to accept a delegation (PF and PG). ([#1088](https://github.com/pagopa/pn-frontend/issues/1088)) ([aec5766](https://github.com/pagopa/pn-frontend/commit/aec5766e31afc547e06472e21d0f03632769a6fe))

## [2.2.2](https://github.com/pagopa/pn-frontend/compare/v2.2.2-RC.0...v2.2.2) (2023-11-21)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.2.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.1...v2.2.2-RC.0) (2023-11-21)

### Bug Fixes

- **PN-8835:** subtitle copy when having a single payment ([#1066](https://github.com/pagopa/pn-frontend/issues/1066)) ([b96408d](https://github.com/pagopa/pn-frontend/commit/b96408dd8f3ec5d7a27f8711b3ebbb6e19c4a3c9))

## [2.2.1](https://github.com/pagopa/pn-frontend/compare/v2.1.4...v2.2.1) (2023-11-21)

# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.2.0) (2023-11-16)

# [2.2.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.1...v2.2.0-RC.2) (2023-11-03)

### Bug Fixes

- **pn-8614:** today label localization ([#1037](https://github.com/pagopa/pn-frontend/issues/1037)) ([d62daf8](https://github.com/pagopa/pn-frontend/commit/d62daf8067903b3fc24ecb0c6b8f6d740f588af7))
- **PN-8627:** Added translation support for timeline ([#1047](https://github.com/pagopa/pn-frontend/issues/1047)) ([190c25b](https://github.com/pagopa/pn-frontend/commit/190c25b3854c051283745757bac5e7ddcc4f65dc))
- **pn-8628:** replaced strings traslation for subtitle in notification detail page ([#1043](https://github.com/pagopa/pn-frontend/issues/1043)) ([d3464c7](https://github.com/pagopa/pn-frontend/commit/d3464c771c5dd641af4a6a9fd4103b8b92c580b7))
- **PN-8629:** replaced translation string for Active in delegation page ([#1042](https://github.com/pagopa/pn-frontend/issues/1042)) ([e23effa](https://github.com/pagopa/pn-frontend/commit/e23effa855c50fd59d142a76ebeebcdda55560a8))
- **pn-8630:** Replaced tax code text with fiscal code ([#1041](https://github.com/pagopa/pn-frontend/issues/1041)) ([67572fa](https://github.com/pagopa/pn-frontend/commit/67572faf8b866d1ecc26427cd2bcffcbdcf1e8e7))
- **PN-8639:** Added translation support for datepicker ([#1046](https://github.com/pagopa/pn-frontend/issues/1046)) ([6912d7e](https://github.com/pagopa/pn-frontend/commit/6912d7e85b2bcad8bd807fbcf7640afc46ee9f3e))

### Features

- **pn-7858:** removed disambiguation page from code ([#1031](https://github.com/pagopa/pn-frontend/issues/1031)) ([68a7a32](https://github.com/pagopa/pn-frontend/commit/68a7a32abf2bacb4d90d8e8b64f9bb28599e119b))

# [2.2.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.0...v2.2.0-RC.1) (2023-10-25)

# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)

### Bug Fixes

- EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
- **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
- **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))

### Features

- **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
- **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
- **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
- **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
- **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))
- **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
- **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
- **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))

# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.2...v2.2.0) (2023-11-16)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)

### Bug Fixes

- EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
- **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
- **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))

### Features

- **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
- **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
- **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
- **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
- **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))
- **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
- **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
- **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))

## [2.1.4](https://github.com/pagopa/pn-frontend/compare/v2.1.3...v2.1.4) (2023-11-20)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.1.3](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.1.3) (2023-11-17)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.1.2](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.1.2) (2023-11-08)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.1.1](https://github.com/pagopa/pn-frontend/compare/v2.1.0...v2.1.1) (2023-10-19)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

# [2.1.0](https://github.com/pagopa/pn-frontend/compare/v2.1.0-RC.5...v2.1.0) (2023-09-28)

**Note:** Version bump only for package @pagopa-pn/pn-personagiuridica-webapp

## [2.0.1-RC.4](https://github.com/pagopa/pn-frontend/compare/v2.0.1-RC.3...v2.0.1-RC.4) (2023-07-31)

### Bug Fixes

- **pn-6134:** removed css override on paper component ([#921](https://github.com/pagopa/pn-frontend/issues/921)) ([cd3be7c](https://github.com/pagopa/pn-frontend/commit/cd3be7cb8316ef13b7e455a2cdea484d828f6764))
- **pn-6720:** fixed inline link of digital contacts code verification modal ([#922](https://github.com/pagopa/pn-frontend/issues/922)) ([1738524](https://github.com/pagopa/pn-frontend/commit/1738524d779b1151d0fcdcd42c1f10899b3fa13e))
- **pn-7078:** prevent index.html caching to avoid MIME type error ([#924](https://github.com/pagopa/pn-frontend/issues/924)) ([d52814c](https://github.com/pagopa/pn-frontend/commit/d52814c6c9397a1fad3fe0ad05e7908a191cc6f2))
- **pn-7120:** mobile filter dialog closes even if filters are invalid ([#914](https://github.com/pagopa/pn-frontend/issues/914)) ([299c8f7](https://github.com/pagopa/pn-frontend/commit/299c8f7dd2c244be30679dc146ff79cb77fa4685))

### Features

- **pn-4267:** removed Cypress from webapps ([#919](https://github.com/pagopa/pn-frontend/issues/919)) ([1e1d4b5](https://github.com/pagopa/pn-frontend/commit/1e1d4b506a3d1328d697ab23a217107caf21beb4))
- **pn-6205:** added localization for others languages ([#916](https://github.com/pagopa/pn-frontend/issues/916)) ([dc8ae08](https://github.com/pagopa/pn-frontend/commit/dc8ae08458fc6adb3fc69d3876ead3ee16e2158d))

## [2.0.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.0.0-RC.6...v2.0.1-RC.0) (2023-07-05)

### Bug Fixes

- **pn-6114:** removed trailing slash in prod config ([#886](https://github.com/pagopa/pn-frontend/issues/886)) ([bad786b](https://github.com/pagopa/pn-frontend/commit/bad786b6127829ad043a75237fb9fcd556b2f89c))
- **pn-6780:** fix collide tab in deleghe ([#842](https://github.com/pagopa/pn-frontend/issues/842)) ([414105b](https://github.com/pagopa/pn-frontend/commit/414105b0e3590d59ec3e3e5bb21fb36be8d2d0ce))
- **pn-6969:** add a11y ([#858](https://github.com/pagopa/pn-frontend/issues/858)) ([2b6e071](https://github.com/pagopa/pn-frontend/commit/2b6e0715016f8a58e25aa56dea1596075e847fc8))
- **pn-7042:** validation mode of notifications filter ([#884](https://github.com/pagopa/pn-frontend/issues/884)) ([5d51671](https://github.com/pagopa/pn-frontend/commit/5d516713b3b4d368fd1810a080647ac628d954fb))
- **pn-7063:** date in new delegation clears when user deletes the content ([#882](https://github.com/pagopa/pn-frontend/issues/882)) ([9c39215](https://github.com/pagopa/pn-frontend/commit/9c3921583bfba2d7dff77307134d4fe2455e7b81))

### Features

- **pn-6792:** analog progress event PNALL001 ([#872](https://github.com/pagopa/pn-frontend/issues/872)) ([fbf14bb](https://github.com/pagopa/pn-frontend/commit/fbf14bb2ca625d49ab72d844af1c72bcfaf842ff))
